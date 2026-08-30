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
    id: 'br-05',
    nome: 'Brasil',
    endereco: 'br-05.hostmine.com.br:25589',
    regiao: 'BR',
  },
];
