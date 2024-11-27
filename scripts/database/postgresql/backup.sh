#!/bin/bash
# Lendo variáveis de ambiente
set -o allexport
[ -f .env ] && . .env
set +o allexport

POSTGRES_CONTAINER="sigsaude_postgres"

# Verificando se o diretório de backup existe e, se não, criando-o
BACKUP_DIR="./backup"
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

CURRENT_DATE=$(date +%Y%m%d%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/db_dump_${CURRENT_DATE}.sql"

# Criando dump do banco de dados com nome dinâmico
docker exec -t ${POSTGRES_CONTAINER} pg_dump -U ${DB_USERNAME} ${DB_DATABASE} > "${BACKUP_FILE}"

echo "Backup realizado com sucesso!"
echo "Arquivo: ${BACKUP_FILE}"
