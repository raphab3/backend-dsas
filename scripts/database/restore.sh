#!/bin/bash

# Ler variáveis de ambiente
source .env || { echo "Erro ao ler .env"; exit 1; }

# Verificar se todas as variáveis de ambiente necessárias estão definidas
[ -z "$POSTGRES_USER" ] && { echo "POSTGRES_USER não definido"; exit 1; }
[ -z "$POSTGRES_DB" ] && { echo "POSTGRES_DB não definido"; exit 1; }

POSTGRES_CONTAINER="iowa_postgres"

# Parar o contêiner do Postgres
docker stop ${POSTGRES_CONTAINER} || { echo "Erro ao parar o contêiner do Postgres"; exit 1; }

# Iniciar o contêiner do Postgres
docker start ${POSTGRES_CONTAINER} || { echo "Erro ao iniciar o contêiner do Postgres"; exit 1; }

# Verificar se o arquivo de dump existe
[ -f "./backup/db_dump.sql" ] || { echo "Arquivo de dump não encontrado"; exit 1; }

# Restaurar o dump do banco de dados usando pg_restore
cat ./backup/db_dump.sql | docker exec -i ${POSTGRES_CONTAINER} pg_restore -U ${DB_USERNAME} -d ${DB_NAME} || { echo "Erro ao restaurar o dump do banco de dados"; exit 1; }

echo "Restauração realizada com sucesso!"
