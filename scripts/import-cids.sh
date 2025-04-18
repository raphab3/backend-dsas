#!/bin/bash

# Script para importar CIDs a partir de arquivos CSV

echo "Iniciando importação de CIDs..."

# Verifica se os arquivos CSV existem
if [ ! -f "src/modules/cids/uploads/CID-10-CAPITULOS.CSV" ] || \
   [ ! -f "src/modules/cids/uploads/CID-10-GRUPOS.CSV" ] || \
   [ ! -f "src/modules/cids/uploads/CID-10-CATEGORIAS.CSV" ] || \
   [ ! -f "src/modules/cids/uploads/CID-10-SUBCATEGORIAS.CSV" ]; then
  echo "Erro: Arquivos CSV não encontrados em src/modules/cids/uploads/"
  echo "Por favor, coloque os arquivos CSV no diretório src/modules/cids/uploads/"
  exit 1
fi

# Executa o seed para importar os CIDs
echo "Executando importação..."
pnpm seed 6

echo "Importação concluída!"
