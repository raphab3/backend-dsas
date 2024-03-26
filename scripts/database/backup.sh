#!/bin/bash
# Lendo variáveis de ambiente
set -o allexport
[ -f .env ] && . .env
set +o allexport

# Nome do volume
VOLUME_NAME="maeduca-api_postgres_db"
POSTGRES_CONTAINER="sigsaude_postgres"

# Verificando se o diretório de backup existe e, se não, criando-o
BACKUP_DIR="./backup"
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

CURRENT_DATE=$(date +%Y%m%d%H%M%S)

# Criando dump do banco de dados com nome dinâmico
docker exec -t ${POSTGRES_CONTAINER} pg_dump -U ${DB_USERNAME} ${DB_DATABASE} > "${BACKUP_DIR}/db_dump_${CURRENT_DATE}.sql"

echo "Backup realizado com sucesso!"
