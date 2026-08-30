import { Check, Minus } from 'lucide-react';

type Linha = {
  plataforma: string;
  assistir: boolean;
  camera: boolean;
  tela: boolean | string;
  nota?: string;
  destaque?: boolean;
};

const LINHAS: Linha[] = [
  {
    plataforma: 'Windows · nativo',
    assistir: true,
    camera: true,
    tela: 'até 1080p60',
    nota: 'o mais leve',
    destaque: true,
  },
  {
    plataforma: 'Windows · Electron',
    assistir: true,
    camera: true,
    tela: 'até 1080p60',
    nota: 'som sem o Discord',
  },
  { plataforma: 'Linux · Electron', assistir: true, camera: true, tela: 'até 1080p60' },
  { plataforma: 'App Android', assistir: true, camera: true, tela: 'até 720p30' },
  { plataforma: 'Navegador (PC)', assistir: true, camera: true, tela: 'até 1080p30' },
  { plataforma: 'Navegador (celular)', assistir: true, camera: true, tela: false },
];

const COLUNAS = ['Plataforma', 'Assistir', 'Câmera', 'Transmitir tela'];

function Celula({ valor }: { valor: boolean | string }) {
  if (valor === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-zinc-700">
        <Minus size={16} aria-hidden="true" />
        <span className="sr-only">não disponível</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-green-400 text-sm font-bold">
      <Check size={16} className="shrink-0" aria-hidden="true" />
      {typeof valor === 'string' ? valor : <span className="sr-only">disponível</span>}
    </span>
  );
}

export default function Compatibilidade() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 relative" aria-labelledby="compat-titulo">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem] px-4 sm:px-6 lg:px-10 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 lg:items-start">
        <div className="lg:sticky lg:top-28">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-green-500 mb-4 block">
            O que roda onde
          </span>
          <h2
            id="compat-titulo"
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter uppercase text-white"
          >
            Sem{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              surpresa
            </span>
          </h2>
          <p className="mt-6 text-sm lg:text-base text-zinc-500 leading-relaxed font-medium text-pretty">
            Transmitir tela pelo navegador é coisa de computador: nenhum
            navegador de celular, Android ou iPhone, implementa a API
            necessária. Para transmitir a tela do celular existe o app Android,
            que usa a captura nativa do sistema.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-zinc-900/40 backdrop-blur-md">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-white/5">
                {COLUNAS.map((coluna) => (
                  <th
                    key={coluna}
                    scope="col"
                    className="px-6 lg:px-8 py-5 lg:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                  >
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((linha) => (
                <tr
                  key={linha.plataforma}
                  className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02] ${
                    linha.destaque ? 'bg-green-500/[0.04]' : ''
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 lg:px-8 py-5 lg:py-7 font-bold text-white text-sm lg:text-base"
                  >
                    {linha.plataforma}
                    {linha.nota && (
                      <span className="block text-[11px] font-medium text-green-500/70 mt-1">
                        {linha.nota}
                      </span>
                    )}
                  </th>
                  <td className="px-6 lg:px-8 py-5 lg:py-7">
                    <Celula valor={linha.assistir} />
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-7">
                    <Celula valor={linha.camera} />
                  </td>
                  <td className="px-6 lg:px-8 py-5 lg:py-7">
                    <Celula valor={linha.tela} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
