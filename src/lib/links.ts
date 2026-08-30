// Cada repositório escrito por extenso. Já foram montados por concatenação em
// cima do principal, e quando os nomes mudaram todos os links quebraram de uma
// vez sem ninguém perceber - `greenlabs-desktop` + `-mobile` não existe.
const DONO = 'https://github.com/gustavo-blacknaut';

export const REPO = `${DONO}/greenlabs-desktop`;
export const REPO_MOBILE = `${DONO}/greenlabs-android`;
export const REPO_SERVER = `${DONO}/greenlabs-server`;
export const REPO_WEB = `${DONO}/greenlabs-site`;
export const REPO_WINDOWS = `${DONO}/greenlabs-windows`;

export const RELEASE_WINDOWS = `${REPO}/releases/latest`;
export const RELEASE_ANDROID = `${REPO_MOBILE}/releases/latest`;
export const RELEASE_SERVER = `${REPO_SERVER}/releases/latest`;

export const RELEASE_WINDOWS_NATIVO = `${REPO_WINDOWS}/releases/latest`;

/**
 * Baixa o arquivo mais recente sem passar pela API do GitHub.
 *
 * A API anonima tem limite de 60 chamadas por hora por IP, e uma pagina de
 * downloads que dependesse dela pararia de funcionar num dia movimentado. Este
 * caminho e um redirecionamento do proprio GitHub: nao conta no limite e nunca
 * aponta para uma versao velha.
 */
export function arquivoDaUltimaVersao(repo: string, nome: string): string {
  return `${repo}/releases/latest/download/${nome}`;
}

// Hostmine: patrocinadora do projeto e quem hospeda o servidor publico da
// pagina de entrar. O convite do Discord fica aqui junto do resto para nao
// acabar copiado solto dentro de um componente.
export const HOSTMINE = 'https://hostmine.com.br';
export const HOSTMINE_DISCORD = 'https://discord.gg/UQJysz35GN';
