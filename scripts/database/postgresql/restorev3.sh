#!/bin/bash

set -e

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Carregar variáveis de ambiente
source .env || error "Erro ao ler .env"

# Verificar variáveis obrigatórias
[ -z "$DB_USERNAME" ] && error "DB_USERNAME não definido"
[ -z "$DB_PASSWORD" ] && error "DB_PASSWORD não definido"

# Configurações
POSTGRES_CONTAINER="sigsaude_postgres"
BACKUP_OLD="./backup/db_dump_20241028000631.sql"  # Backup de ontem (íntegro)
BACKUP_NEW="./backup/db_dump_20241029000621.sql"  # Backup de hoje (parcialmente corrompido)

# Função para contar registros em um arquivo de backup
count_backup_records() {
    local backup_file="$1"
    local table="$2"

    if [ ! -f "$backup_file" ]; then
        echo "0"
        return
    fi

    # Tenta extrair e contar os registros da tabela
    local count=$(sed -n "/COPY public.${table} /,/\\./p" "$backup_file" | \
                 grep -v "COPY" | grep -v "\\." | wc -l)
    echo "$count" 
}

# Função para verificar integridade da tabela no backup
check_table_integrity() {
    local backup_file="$1"
    local table="$2"

    # Verifica se a tabela tem início e fim no backup
    local has_start=$(grep "COPY public.${table} " "$backup_file" >/dev/null 2>&1 && echo "1" || echo "0")
    local has_end=$(grep -A10000 "COPY public.${table} " "$backup_file" | grep -m1 "\\." >/dev/null 2>&1 && echo "1" || echo "0")

    if [ "$has_start" = "1" ] && [ "$has_end" = "1" ]; then
        echo "1"
    else
        echo "0"
    fi
}

# Função para restaurar tabela específica
restore_table() {
    local backup_file="$1"
    local table="$2"

    log "Restaurando $table de $backup_file..."

    # Criar backup de segurança
    local safety_dir="/home/ubuntu/backup/safety"
    mkdir -p "$safety_dir"
    local safety_backup="$safety_dir/${table}_$(date +%Y%m%d_%H%M%S).sql"

    docker exec $POSTGRES_CONTAINER pg_dump -U $DB_USERNAME -d db_sigsaude \
        --table="public.${table}" --data-only > "$safety_backup"

    # Restaurar tabela
    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude << EOF
    BEGIN;
    TRUNCATE TABLE ${table} CASCADE;
EOF

    sed -n "/COPY public.${table} /,/\\./p" "$backup_file" | \
    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude

    docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude -c "COMMIT;"
}

main() {
    log "Iniciando análise dos backups..."# Verificar se os backups existem
    [ ! -f "$BACKUP_OLD" ] && error "Backup antigo não encontrado: $BACKUP_OLD"
    [ ! -f "$BACKUP_NEW" ] && error "Backup novo não encontrado: $BACKUP_NEW"

    # Lista de tabelas para verificar
    local tables=(
        "users"
        "schedules"
        "appointments"
        "persons_sig"
        "patients"
    )

    # Comparar backups
    echo -e "\nComparação de backups:"
    printf "%-20s %-15s %-15s %-15s %-15s\n" "TABELA" "ONTEM" "HOJE" "INTEGRIDADE" "USAR"
    echo "--------------------------------------------------------------------------------"

    declare -A use_backup

    for table in "${tables[@]}"; do
        local old_count=$(count_backup_records "$BACKUP_OLD" "$table")
        local new_count=$(count_backup_records "$BACKUP_NEW" "$table")
        local new_integrity=$(check_table_integrity "$BACKUP_NEW" "$table")

        local integrity_status
        local which_backup

        if [ "$new_integrity" = "1" ]; then
            integrity_status="${GREEN}OK${NC}"
            if [ $new_count -gt $old_count ]; then
                which_backup="${GREEN}HOJE${NC}"
                use_backup[$table]="$BACKUP_NEW"
            else
                which_backup="${YELLOW}ONTEM${NC}"
                use_backup[$table]="$BACKUP_OLD"
            fi
        else
            integrity_status="${RED}ERRO${NC}"
            which_backup="${YELLOW}ONTEM${NC}"
            use_backup[$table]="$BACKUP_OLD"
        fi

       printf "%-20s %-15s %-15s %-15b %-15b\n" \
            "$table" \
            "$old_count" \
            "$new_count" \
            "$integrity_status" \
            "$which_backup"
    done

    echo -e "\nDeseja prosseguir com a restauração? (s/N)"
    read -r confirm

    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
        log "Operação cancelada pelo usuário"
        exit 0
    fi

    # Restaurar cada tabela do backup apropriado
    for table in "${tables[@]}"; do
        local backup_to_use="${use_backup[$table]}"
        restore_table "$backup_to_use" "$table"

        # Verificar contagem após restauração
        local final_count=$(docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude -t -c "SELECT COUNT(*) FROM $table;" | tr -d ' ')
        log "Tabela $table restaurada com $final_count registros"
    done

    log "Processo de recuperação concluído!"

    # Mostrar estado final
    echo -e "\nEstado final das tabelas:"
    printf "%-20s %-15s\n" "TABELA" "REGISTROS"
    echo "------------------------------------"

    for table in "${tables[@]}"; do
        local final_count=$(docker exec -i $POSTGRES_CONTAINER psql -U $DB_USERNAME -d db_sigsaude -t -c "SELECT COUNT(*) FROM $table;" | tr -d ' ')
        printf "%-20s %-15s\n" "$table" "$final_count"
    done
}

# Executar script
main