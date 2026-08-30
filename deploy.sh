#!/usr/bin/env bash
#
# Publica o site na VPS clonando do zero a cada vez.
#
#   greenlabs-deploy
#
# Nao atualiza um clone existente: baixa um clone novo em releases/<data>,
# compila la dentro e so entao aponta o link "atual" para ele. Isso resolve
# dois problemas que a receita obvia (apagar a pasta e clonar por cima) tem:
#
#  - o site fica fora do ar durante o npm ci e o build, que sao o pedaco
#    demorado;
#  - se o build falhar, nao sobrou nada para servir.
#
# Aqui a versao no ar so muda depois que a nova compilou e passou no teste, e
# a anterior continua no disco - voltar e mudar um link.
#
# Este arquivo mora FORA do que e clonado, senao ele se apagaria no meio da
# propria execucao. Instale com:
#
#   sudo curl -fsSL https://raw.githubusercontent.com/gustavo-blacknaut/greenlabs-site/main/deploy.sh \
#     -o /usr/local/bin/greenlabs-deploy && sudo chmod +x /usr/local/bin/greenlabs-deploy

set -euo pipefail

REPO="${REPO:-https://github.com/gustavo-blacknaut/greenlabs-site.git}"
RAIZ="${RAIZ:-/var/www/greenlabs}"
PROCESSO="${PM2_NOME:-greenlabs-site}"
PORTA="${PORTA:-4068}"
GUARDAR="${GUARDAR:-3}"   # quantas versoes antigas ficam no disco

LANCAMENTOS="$RAIZ/releases"
ATUAL="$RAIZ/atual"
NOVO="$LANCAMENTOS/$(date +%Y%m%d-%H%M%S)"

# Para onde voltar se a nova versao nao passar no teste.
#
# Anotado num arquivo, e nao lido do proprio link com readlink: o link e para o
# pm2 saber de onde servir, e depender dele aqui significa que qualquer coisa
# que atrapalhe a leitura do link faz o rollback ser PULADO EM SILENCIO - o
# deploy falha, avisa que falhou, e deixa o site quebrado assim mesmo. Um
# arquivo de texto nao tem esse problema.
REGISTRO="$RAIZ/atual.txt"
ANTERIOR=""
[ -f "$REGISTRO" ] && ANTERIOR="$(cat "$REGISTRO")"

mkdir -p "$LANCAMENTOS"

echo "==> clonando em $NOVO"
# --depth 1: so o ultimo commit. O historico inteiro nao serve para nada em
# producao e e a maior parte do download.
git clone --depth 1 --branch main "$REPO" "$NOVO"

echo "==> dependencias"
cd "$NOVO"
npm ci

echo "==> build"
npm run build

if [ ! -f out/index.html ]; then
  echo "ERRO: o build nao gerou out/index.html; nada foi trocado" >&2
  rm -rf "$NOVO"
  exit 1
fi

echo "==> apontando atual -> $(basename "$NOVO")"
# -n para o ln nao criar o link DENTRO da pasta antiga quando ela ja existe.
ln -sfn "$NOVO" "$ATUAL"

echo "==> reiniciando"
# delete + start em vez de restart: o pm2 guarda o caminho ja resolvido, e um
# restart puro continuaria servindo a pasta antiga mesmo com o link novo.
pm2 delete "$PROCESSO" >/dev/null 2>&1 || true
pm2 start npx --name "$PROCESSO" --cwd "$ATUAL" -- \
  serve out -l "tcp://127.0.0.1:$PORTA" --no-clipboard
pm2 save >/dev/null

echo "==> conferindo"
sleep 3
falhou=0
for caminho in / /call /downloads; do
  codigo=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORTA}${caminho}" || echo 000)
  printf '    %-12s %s\n' "$caminho" "$codigo"
  [ "$codigo" = "200" ] || falhou=1
done

if [ "$falhou" = "1" ]; then
  echo "ERRO: a versao nova nao respondeu" >&2
  if [ -n "$ANTERIOR" ] && [ -d "$ANTERIOR" ]; then
    echo "==> voltando para $(basename "$ANTERIOR")" >&2
    ln -sfn "$ANTERIOR" "$ATUAL"
    pm2 delete "$PROCESSO" >/dev/null 2>&1 || true
    pm2 start npx --name "$PROCESSO" --cwd "$ATUAL" -- \
      serve out -l "tcp://127.0.0.1:$PORTA" --no-clipboard
    pm2 save >/dev/null
    echo "==> versao anterior de volta no ar" >&2
  fi
  exit 1
fi

# Só agora, depois de responder 200, esta versao vira a "boa conhecida".
echo "$NOVO" > "$REGISTRO"

echo "==> limpando versoes antigas (guardando $GUARDAR)"
cd "$LANCAMENTOS"
ls -1dt */ 2>/dev/null | tail -n "+$((GUARDAR + 1))" | while read -r velha; do
  caminho="$LANCAMENTOS/${velha%/}"
  # Cinto de seguranca: a versao no ar nunca e apagada, aconteca o que
  # acontecer com a ordenacao por data.
  if [ "$caminho" = "$NOVO" ] || [ "$caminho" = "$ANTERIOR" ]; then
    continue
  fi
  echo "    removendo ${velha%/}"
  rm -rf "$caminho"
done

echo "==> pronto: $(basename "$NOVO")"
