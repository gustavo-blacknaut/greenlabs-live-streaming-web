// Servidor público de conveniência, para quem quer testar sem hospedar nada.
//
// Guardado sem esquema de propósito: normalizarServidor() escolhe ws:// ou
// wss:// conforme o protocolo da página. Fixar o esquema aqui quebraria
// justamente no caso mais comum, que é o site publicado em HTTPS.
export type ServidorPublico = {
  id: string;
  nome: string;
  endereco: string;
  regiao: string;
};

export const SERVIDORES_PUBLICOS: ServidorPublico[] = [
  {
    id: 'greencodes',
    nome: 'Grátis',
    // Sem porta e sem esquema de proposito: este endereco termina TLS no nginx,
    // na 443. Escrever a porta do processo aqui (25640) e o erro mais facil de
    // cometer, e o sintoma nao ajuda - a conexao so estoura o tempo limite.
    endereco: 'sinal.greencodes.com.br',
    regiao: 'BR',
  },
];

/**
 * A ponte publica: da TLS a quem nao tem.
 *
 * Uma pagina em HTTPS nao consegue abrir `ws://` - o navegador bloqueia e nao
 * existe configuracao que mude. Entao um servidor caseiro sem certificado fica
 * inalcancavel pelo site mesmo estando no ar e funcionando perfeitamente.
 *
 * A ponte fica no meio: o navegador fala `wss://` com ela, ela fala `ws://` com
 * o servidor. So a sinalizacao passa por ali; video e audio continuam indo
 * direto entre os participantes.
 *
 * Fica vazio por padrao de proposito. Este site diz que video e audio nunca
 * passam por servidor nosso, e mandar gente para um intermediario sem escolha
 * contradiria isso. Quem quiser usa - a de baixo, ou a propria, com
 * `go build ./cmd/ponte` do repositorio do servidor.
 */
export const PONTE_PUBLICA = 'ponte.greencodes.com.br';

/**
 * Monta o endereco do servidor passando pela ponte.
 *
 * Devolve null quando nao da: a ponte exige host E porta, porque sem porta nao
 * ha o que discar do outro lado.
 */
export function montarPelaPonte(servidor: string, ponte = PONTE_PUBLICA): string | null {
  const limpo = String(servidor || '')
    .trim()
    .replace(/^wss?:\/\//, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

  if (!limpo || limpo.includes('/')) return null;
  // host:porta, com a porta obrigatoria. IPv6 entre colchetes tambem passa.
  if (!/^(\[[^\]]+\]|[^:]+):\d+$/.test(limpo)) return null;
  if (limpo.startsWith(ponte)) return null;

  return `${ponte}/ws?alvo=${encodeURIComponent(limpo)}`;
}
