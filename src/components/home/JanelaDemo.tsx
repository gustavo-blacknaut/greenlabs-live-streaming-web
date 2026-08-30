import { Mic, MonitorUp, PhoneOff, Users, Video } from 'lucide-react';

const PARTICIPANTES = [
  { nome: 'Você', cor: 'from-green-500/40 to-emerald-600/20', ativo: true },
  { nome: 'Rafa', cor: 'from-sky-500/30 to-indigo-600/20', ativo: false },
  { nome: 'Bia', cor: 'from-fuchsia-500/25 to-purple-600/20', ativo: false },
];

const CONTROLES = [
  { Icone: MonitorUp, rotulo: 'Tela', destaque: true },
  { Icone: Video, rotulo: 'Câmera', destaque: false },
  { Icone: Mic, rotulo: 'Mic', destaque: false },
  { Icone: Users, rotulo: '3', destaque: false },
];

/**
 * Retrato da sala, desenhado em CSS.
 *
 * O lugar de destaque da página mostrava a logo dentro de uma moldura vazia -
 * bonito e sem informação. Quem chega quer saber com o que vai se parecer, e
 * o produto é uma tela compartilhada, então é isso que fica aqui.
 */
export default function JanelaDemo() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <div className="absolute -inset-10 bg-green-500/10 blur-[80px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-3 text-[11px] font-medium text-zinc-500 tracking-wide">
            greenlabs · sala do fim de semana
          </span>
        </div>

        <div className="relative aspect-video bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_40%,rgba(34,197,94,0.18),transparent_60%)]" />

          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 border border-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
            </span>
            Ao vivo · 1080p60
          </span>

          <span className="absolute top-4 right-4 rounded-full bg-black/70 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-green-400 backdrop-blur-md tabular-nums">
            18 ms
          </span>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {PARTICIPANTES.map(({ nome, cor, ativo }) => (
              <div
                key={nome}
                className={`w-16 h-[3.75rem] rounded-lg bg-gradient-to-br ${cor} border ${
                  ativo ? 'border-green-500/60' : 'border-white/10'
                } flex items-end justify-center pb-1 backdrop-blur-sm`}
              >
                <span className="text-[9px] font-bold text-white/80">{nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 bg-black/60">
          {CONTROLES.map(({ Icone, rotulo, destaque }) => (
            <span
              key={rotulo}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
                destaque
                  ? 'bg-green-500 text-black'
                  : 'bg-white/[0.04] text-zinc-400 border border-white/5'
              }`}
            >
              <Icone size={13} />
              {rotulo}
            </span>
          ))}
          <span className="inline-flex items-center rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-red-400">
            <PhoneOff size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
