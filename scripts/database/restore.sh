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
check_postgres_health() {
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec $POSTGRES_CONTAINER pg_isready -U $DB_USERNAME > /dev/null 2>&1; then
            log "PostgreSQL está pronto!"
            return 0
        fi
        warn "Tentativa $attempt/$max_attempts - Aguardando PostgreSQL iniciar..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    error "PostgreSQL não iniciou após $max_attempts tentativas"
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
    for var in DB_USERNAME DB_PASSWORD; do
        if [ -z "${!var}" ]; then
            error "Variável $var não definida"
            exit 1
        fi
    done

    POSTGRES_CONTAINER="sigsaude_postgres"
    VOLUME_NAME="backend-dsas_postgres_db"
    BACKUP_FILE="./backup/db_dump_20241028000631.sql"

    # Verificar se o backup existe
    check_backup "$BACKUP_FILE"

    # Parar e remover container existente
    if docker ps -a | grep -q $POSTGRES_CONTAINER; then
        log "Parando container existente..."
        docker stop $POSTGRES_CONTAINER || true
        docker rm $POSTGRES_CONTAINER || true
    fi

    # Remover volume existente
    if docker volume ls | grep -q $VOLUME_NAME; then
        log "Removendo volume existente..."
        docker volume rm $VOLUME_NAME || true
    fi

    # Recriar ambiente
    log "Recriando ambiente com docker-compose..."
    docker-compose up -d

    # Verificar saúde do PostgreSQL
    if ! check_postgres_health; then
        error "Falha ao iniciar PostgreSQL"
        exit 1
    fi

    # Restaurar o backup
    log "Iniciando restauração do backup..."
    if cat "$BACKUP_FILE" | docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude; then
        log "Backup restaurado com sucesso!"
    else
        error "Falha na restauração do backup"
        exit 1
    fi

    # Verificar restauração
    log "Verificando tabelas restauradas..."
    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude -c "
    SELECT
        schemaname,
        relname as table_name,
        n_live_tup as row_count
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC;
    "

    # Verificar integridade das foreign keys
    log "Verificando integridade das foreign keys..."
    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude -c "
    SELECT DISTINCT
        conrelid::regclass AS table_name,
        conname AS foreign_key
    FROM pg_constraint
    WHERE confrelid != 0
    AND NOT EXISTS (
        SELECT 1
        FROM pg_constraint c2
        WHERE c2.conrelid = pg_constraint.conrelid
        AND c2.confrelid = pg_constraint.confrelid
        AND c2.conname = pg_constraint.conname
        AND c2.convalidated
    );
    "

    log "Processo concluído com sucesso!"
}

# Executar função principal
main "$@"