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
