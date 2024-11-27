#!/bin/bash

set -e  # Interrompe o script se houver qualquer erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Função para verificar se o container está saudável
check_mongo_health() {
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec $MONGO_CONTAINER mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
            log "MongoDB está pronto!"
            return 0
        fi
        warn "Tentativa $attempt/$max_attempts - Aguardando MongoDB iniciar..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    error "MongoDB não iniciou após $max_attempts tentativas"
    return 1
}

# Verificar se backup existe
check_backup() {
    if [ ! -f "$1" ]; then
        error "Arquivo de backup não encontrado: $1"
        exit 1
    fi
}

# Função para clonar database atual para backup
clone_current_database() {
    local original_db="$1"
    local current_date=$(date +%Y%m%d_%H%M%S)
    local backup_db="${original_db}_backup_${current_date}"
    
    log "Clonando database atual para $backup_db..."
    
    # Drop do backup se ele já existir (improvável devido ao timestamp)
    docker exec -i $MONGO_CONTAINER mongosh \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        --eval "db.getMongo().getDB('$backup_db').dropDatabase()"
    
    # Copia todas as collections do database atual para o backup
    docker exec -i $MONGO_CONTAINER mongosh \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        --eval "
        const sourceDb = db.getMongo().getDB('$original_db');
        const targetDb = db.getMongo().getDB('$backup_db');
        sourceDb.getCollectionNames().forEach(function(collName) {
            sourceDb[collName].aggregate([{\$out: { db: '$backup_db', coll: collName }}]);
        })"
    
    if [ $? -eq 0 ]; then
        log "Database clonado com sucesso para $backup_db"
        echo "$backup_db"  # Retorna o nome do backup database
    else
        error "Falha ao clonar database"
        exit 1
    fi
}

# Função para comparar databases
compare_databases() {
    local original_db="$1"
    local backup_db="$2"
    
    log "Comparando databases $original_db e $backup_db..."
    
    docker exec -i $MONGO_CONTAINER mongosh \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        --eval "
        const originalDb = db.getMongo().getDB('$original_db');
        const backupDb = db.getMongo().getDB('$backup_db');
        
        console.log('\nComparação de Collections:');
        const originalColls = originalDb.getCollectionNames().sort();
        const backupColls = backupDb.getCollectionNames().sort();
        
        console.log('\n$original_db collections:');
        originalColls.forEach(coll => {
            const count = originalDb[coll].countDocuments();
            console.log(\`\${coll}: \${count} documentos\`);
        });
        
        console.log('\n$backup_db collections:');
        backupColls.forEach(coll => {
            const count = backupDb[coll].countDocuments();
            console.log(\`\${coll}: \${count} documentos\`);
        });"
}

# Função principal
main() {
    # Ler variáveis de ambiente
    if [ -f .env ]; then
        log "Carregando variáveis de ambiente..."
        source .env
    else
        error "Arquivo .env não encontrado"
        exit 1
    fi

    # Verificar variáveis obrigatórias
    for var in MONGODB_USER MONGODB_PASS MONGODB_DATABASE; do
        if [ -z "${!var}" ]; then
            error "Variável $var não definida"
            exit 1
        fi
    done

    MONGO_CONTAINER="sigsaude_mongo_db"
    BACKUP_FILE="./backup/mongodb/mongodb_dump_20241127020923.gz"

    # Verificar se o backup existe
    check_backup "$BACKUP_FILE"

    # Verificar saúde do MongoDB
    if ! check_mongo_health; then
        error "Falha ao verificar MongoDB"
        exit 1
    fi

    # Clonar database atual para backup
    BACKUP_DB=$(clone_current_database ${MONGODB_DATABASE})

    # Copiar arquivo de backup para o container
    log "Copiando arquivo de backup para o container..."
    docker cp "$BACKUP_FILE" ${MONGO_CONTAINER}:/tmp/mongodb_dump.gz

    # Restaurar o backup no database principal
    log "Iniciando restauração do backup..."
    if docker exec -i $MONGO_CONTAINER mongorestore \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        --db ${MONGODB_DATABASE} \
        --gzip \
        --drop \
        --archive=/tmp/mongodb_dump.gz; then
        log "Backup restaurado com sucesso!"
    else
        error "Falha na restauração do backup"
        docker exec -i $MONGO_CONTAINER rm /tmp/mongodb_dump.gz 2>/dev/null || true
        exit 1
    fi

    # Limpar arquivo temporário
    docker exec -i $MONGO_CONTAINER rm /tmp/mongodb_dump.gz

    # Comparar os databases
    compare_databases ${MONGODB_DATABASE} ${BACKUP_DB}

    log "Processo concluído com sucesso!"
    log "O database original foi preservado em ${BACKUP_DB}"
    log "Para restaurar a versão anterior, use o comando:"
    log "mongosh --eval \"db.getMongo().getDB('${MONGODB_DATABASE}').dropDatabase(); db.getMongo().getDB('${BACKUP_DB}').getCollectionNames().forEach(function(collName) { db.getMongo().getDB('${BACKUP_DB}')[collName].aggregate([{\\\$out: { db: '${MONGODB_DATABASE}', coll: collName }}]); })\""
}

# Executar função principal
main "$@"