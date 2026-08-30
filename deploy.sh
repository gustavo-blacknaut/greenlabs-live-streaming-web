#!/usr/bin/env bash
#
# Atualiza o site na VPS. Rode de dentro do repositorio:
#
#   ./deploy.sh
#
# Faz o ciclo inteiro e para no primeiro erro, em vez de seguir e deixar o
# site pela metade - que e o que acontece quando se emenda tudo com && na mao
# e o build falha no meio.

set -euo pipefail

PROCESSO="${PM2_NOME:-greenlabs-site}"
PORTA="${PORTA:-4068}"

cd "$(dirname "$0")"

echo "==> baixando"
git pull --ff-only

echo "==> dependencias"
# ci e nao install: apaga o node_modules e refaz exatamente do package-lock.
# install por cima costuma deixar resto da versao anterior, e o erro que
# aparece depois nao tem nada a ver com a causa.
npm ci

echo "==> build"
npm run build

# O build e estatico: se o out/ nao existe, nao ha o que servir e reiniciar o
# pm2 so troca um site quebrado por outro.
if [ ! -f out/index.html ]; then
  echo "ERRO: build nao gerou out/index.html" >&2
  exit 1
fi

echo "==> reiniciando"
pm2 restart "$PROCESSO"

echo "==> conferindo"
sleep 2
for caminho in / /call /downloads; do
  codigo=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORTA}${caminho}" || echo 000)
  printf '    %-12s %s\n' "$caminho" "$codigo"
  if [ "$codigo" != "200" ]; then
    echo "ERRO: $caminho respondeu $codigo" >&2
    exit 1
  fi
done

echo "==> pronto"
