#!/bin/bash
# Lendo variáveis de ambiente
set -o allexport
[ -f .env ] && . .env
set +o allexport

# Nome do container e backup
MONGO_CONTAINER="sigsaude_mongo_db"
BACKUP_DIR="./backup/mongodb"

# Verificando se o diretório de backup existe e, se não, criando-o
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

CURRENT_DATE=$(date +%Y%m%d%H%M%S)

# Criando backup do MongoDB com nome dinâmico
docker exec -t ${MONGO_CONTAINER} mongodump \
    --username ${MONGODB_USER} \
    --password ${MONGODB_PASS} \
    --authenticationDatabase admin \
    --db ${MONGODB_DATABASE} \
    --gzip \
    --archive=/tmp/mongodb_dump.gz

# Copiando o arquivo do container para o host
docker cp ${MONGO_CONTAINER}:/tmp/mongodb_dump.gz "${BACKUP_DIR}/mongodb_dump_${CURRENT_DATE}.gz"

# Removendo o arquivo temporário do container
docker exec -t ${MONGO_CONTAINER} rm /tmp/mongodb_dump.gz

if [ $? -eq 0 ]; then
    echo "Backup do MongoDB realizado com sucesso!"
    echo "Arquivo: ${BACKUP_DIR}/mongodb_dump_${CURRENT_DATE}.gz"
else
    echo "Erro ao realizar backup do MongoDB"
    exit 1
fi