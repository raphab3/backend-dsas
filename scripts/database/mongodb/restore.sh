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
    VOLUME_NAME="mongo_db"
    BACKUP_FILE="./backup/mongodb/mongodb_dump_20241127004758.gz"

    # Verificar se o backup existe
    check_backup "$BACKUP_FILE"

    # Parar e remover container existente
    if docker ps -a | grep -q $MONGO_CONTAINER; then
        log "Parando container existente..."
        docker stop $MONGO_CONTAINER || true
        docker rm $MONGO_CONTAINER || true
    fi

    # Remover volume existente
    if docker volume ls | grep -q $VOLUME_NAME; then
        log "Removendo volume existente..."
        docker volume rm $VOLUME_NAME || true
    fi

    # Recriar ambiente
    log "Recriando ambiente com docker-compose..."
    docker-compose up -d mongodb

    # Verificar saúde do MongoDB
    if ! check_mongo_health; then
        error "Falha ao iniciar MongoDB"
        exit 1
    fi

    # Copiar arquivo de backup para o container
    log "Copiando arquivo de backup para o container..."
    docker cp "$BACKUP_FILE" ${MONGO_CONTAINER}:/tmp/mongodb_dump.gz

    # Restaurar o backup
    log "Iniciando restauração do backup..."
    if docker exec -i $MONGO_CONTAINER mongorestore \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        --db ${MONGODB_DATABASE} \
        --gzip \
        --archive=/tmp/mongodb_dump.gz; then
        log "Backup restaurado com sucesso!"
    else
        error "Falha na restauração do backup"
        docker exec -i $MONGO_CONTAINER rm /tmp/mongodb_dump.gz
        exit 1
    fi

    # Limpar arquivo temporário
    docker exec -i $MONGO_CONTAINER rm /tmp/mongodb_dump.gz

    # Verificar restauração
    log "Verificando coleções restauradas..."
    docker exec -i $MONGO_CONTAINER mongosh \
        --username ${MONGODB_USER} \
        --password ${MONGODB_PASS} \
        --authenticationDatabase admin \
        ${MONGODB_DATABASE} \
        --eval "db.getCollectionNames().forEach(function(collection) { print(collection + ': ' + db[collection].countDocuments()) })"

    log "Processo concluído com sucesso!"
}

# Executar função principal
main "$@"