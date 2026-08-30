'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2, LogOut, MonitorUp, MonitorPlay, Users, X } from 'lucide-react';
import { MODOS_AUDIO, pegarModoAudio, type ParticipanteFormatado } from '@/lib/webrtc';
import type { StreamNaTela } from '@/lib/useCall';
import { cn } from '@/lib/utils';

function Video({ stream, mudo }: { stream: MediaStream; mudo: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.srcObject !== stream) el.srcObject = stream;
  }, [stream]);
  return (
    <video
      ref={ref}
      className="w-full h-full object-contain block"
      autoPlay
      playsInline
      muted={mudo}
      disablePictureInPicture
    />
  );
}

type Props = {
  nome: string;
  pingMs: number;
  reconectando: boolean;
  streams: StreamNaTela[];
  participantes: ParticipanteFormatado[];
  temTela: boolean;
  modoAudio: string;
  aviso: string;
  onModoAudioChange: (id: string) => void;
  onCompartilharTela: () => void;
  onLigarCamera: () => void;
  onEncerrarStream: (id: string) => void;
  onSair: () => void;
  onFecharAviso: () => void;
};

const acao =
  'flex-1 flex flex-col items-center justify-center gap-1.5 min-h-[58px] rounded-xl ' +
  'text-[11px] font-black uppercase tracking-wider transition-colors ' +
  // Em telas maiores vira uma linha compacta, com largura pelo conteúdo.
  'sm:flex-none sm:flex-row sm:gap-2 sm:px-5 sm:min-h-[46px]';

export default function SalaAoVivo({
  nome,
  pingMs,
  reconectando,
  streams,
  participantes,
  temTela,
  modoAudio,
  aviso,
  onModoAudioChange,
  onCompartilharTela,
  onLigarCamera,
  onEncerrarStream,
  onSair,
  onFecharAviso,
}: Props) {
  const [painelAberto, setPainelAberto] = useState(false);
  const total = participantes.length + 1;

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center justify-between gap-3 mx-3 sm:mx-4 mt-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo-96.png" alt="" width={26} height={26} className="object-contain" />
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              reconectando ? 'bg-amber-400 animate-pulse' : 'bg-green-500'
            )}
            aria-label={reconectando ? 'reconectando' : 'conectado'}
          />
        </div>
        {reconectando ? (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold">
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            Reconectando…
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-green-400 text-xs font-black">
            {pingMs > 0 ? `${pingMs}ms` : '—'}
          </span>
        )}
      </header>

      {aviso && (
        <div className="mx-3 sm:mx-4 mt-3 flex items-start justify-between gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10">
          <p className="text-red-300 text-sm leading-relaxed">{aviso}</p>
          <button onClick={onFecharAviso} className="text-red-300/70 hover:text-red-300 shrink-0" aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}

      {temTela && (
        <section className="mx-3 sm:mx-4 mt-3 px-4 py-3 rounded-2xl border border-white/10 bg-zinc-900/40 lg:flex lg:items-center lg:gap-5">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2.5 lg:mb-0 lg:shrink-0">
            Áudio ao transmitir
          </h2>
          <div className="flex flex-wrap gap-2 lg:shrink-0">
            {MODOS_AUDIO.map((m) => (
              <button
                key={m.id}
                onClick={() => onModoAudioChange(m.id)}
                className={cn(
                  'px-3.5 py-2 rounded-lg border text-xs font-bold transition-colors',
                  modoAudio === m.id
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : 'border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-300'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="mt-2.5 lg:mt-0 text-xs text-zinc-600 leading-relaxed font-medium lg:border-l lg:border-white/10 lg:pl-5">
            {pegarModoAudio(modoAudio).resumo}
          </p>
        </section>
      )}

      <main className="flex-1 min-h-0 mx-3 sm:mx-4 my-3">
        {streams.length === 0 ? (
          <div className="h-full min-h-[45dvh] flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-white/10 text-center px-6 py-14">
            <MonitorPlay size={34} className="text-zinc-700" aria-hidden="true" />
            <p className="font-black text-white">Ninguém transmitindo ainda</p>
            <p className="text-zinc-500 text-sm font-medium">
              Compartilhe sua tela ou ligue a câmera para começar.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            {streams.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black aspect-video"
              >
                <Video stream={item.stream} mudo={item.local} />
                <span className="absolute left-3 bottom-3 max-w-[calc(100%-24px)] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-green-400 text-xs font-bold">
                  <MonitorPlay size={13} aria-hidden="true" />
                  <span className="truncate">{item.nome}</span>
                </span>
                {item.local && (
                  <button
                    onClick={() => onEncerrarStream(item.id)}
                    title="Encerrar esta transmissão"
                    aria-label={`Encerrar ${item.nome}`}
                    className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-xl bg-black/70 backdrop-blur-sm text-red-300 border border-red-500/30 transition-colors hover:bg-red-500/25 hover:text-red-200"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* No celular a barra ocupa a largura toda, ao alcance do polegar. Num
          monitor isso vira quatro botões gigantes, então ali ela encolhe e
          centraliza. */}
      <nav className="flex gap-2 mx-3 sm:mx-4 mb-3 p-2 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl sm:w-fit sm:mx-auto sm:gap-1">
        <button
          onClick={onCompartilharTela}
          disabled={!temTela}
          title={temTela ? 'Transmitir tela' : 'Não disponível neste navegador'}
          className={cn(acao, 'text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent')}
        >
          <MonitorUp size={19} aria-hidden="true" />
          Tela
        </button>

        <button onClick={onLigarCamera} className={cn(acao, 'text-zinc-400 hover:text-white hover:bg-white/5')}>
          <Camera size={19} aria-hidden="true" />
          Câmera
        </button>

        <button
          onClick={() => setPainelAberto(true)}
          className={cn(acao, 'text-zinc-400 hover:text-white hover:bg-white/5')}
        >
          <span className="relative grid place-items-center">
            <Users size={19} aria-hidden="true" />
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 grid place-items-center rounded-full bg-green-500 text-black text-[10px] font-black">
              {total}
            </span>
          </span>
          Pessoas
        </button>

        <button onClick={onSair} className={cn(acao, 'text-red-400 hover:bg-red-500/10')}>
          <LogOut size={19} aria-hidden="true" />
          Sair
        </button>
      </nav>

      {painelAberto && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPainelAberto(false)}
        >
          <div
            className="w-full max-w-md max-h-[74dvh] overflow-y-auto rounded-[1.75rem] border border-white/10 bg-zinc-950 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-white">Na sala ({total})</h2>
              <button
                onClick={() => setPainelAberto(false)}
                className="grid place-items-center w-9 h-9 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Fechar"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-green-500/20 bg-green-500/[0.06]">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-green-500/15 text-green-400 text-xs font-black shrink-0">
                  {(nome || 'VC').slice(0, 2).toUpperCase()}
                </span>
                <span className="flex-1 min-w-0 truncate text-sm font-bold text-white">
                  {nome || 'Você'} <span className="text-zinc-500 font-medium">(você)</span>
                </span>
                {pingMs > 0 && <span className="text-green-400 text-xs font-bold">{pingMs}ms</span>}
              </div>

              {participantes.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-white/5 bg-white/[0.03]">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 text-zinc-400 text-xs font-black shrink-0">
                    {p.nomeExibido.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm font-bold text-white">{p.nomeExibido}</span>
                  {p.pingMs > 0 && <span className="text-green-400 text-xs font-bold">{p.pingMs}ms</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
