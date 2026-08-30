'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Check,
  Columns2,
  Grid2x2,
  Link2,
  Loader2,
  LogOut,
  MonitorPlay,
  MonitorUp,
  Settings,
  Square,
  Users,
  X,
} from 'lucide-react';
import {
  MODOS_AUDIO,
  QUALIDADES,
  pegarModoAudio,
  type ParticipanteFormatado,
} from '@/lib/webrtc';
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
  servidor: string;
  sala: string;
  pingMs: number;
  reconectando: boolean;
  streams: StreamNaTela[];
  participantes: ParticipanteFormatado[];
  temTela: boolean;
  modoAudio: string;
  qualidade: string;
  aviso: string;
  onModoAudioChange: (id: string) => void;
  onQualidadeChange: (id: string) => void;
  onCompartilharTela: () => void;
  onLigarCamera: () => void;
  onEncerrarStream: (id: string) => void;
  onSair: () => void;
  onFecharAviso: () => void;
};

/** As tres divisoes do palco, como no aplicativo nativo. */
const DIVISOES = [
  { quantas: 1, Icone: Square, titulo: 'Uma tela' },
  { quantas: 2, Icone: Columns2, titulo: 'Duas telas' },
  { quantas: 4, Icone: Grid2x2, titulo: 'Quatro telas' },
] as const;

const acao =
  'flex-1 flex flex-col items-center justify-center gap-1.5 min-h-[58px] rounded-xl ' +
  'text-[11px] font-black uppercase tracking-wider transition-colors ' +
  // Em telas maiores vira uma linha compacta, com largura pelo conteúdo.
  'sm:flex-none sm:flex-row sm:gap-2 sm:px-5 sm:min-h-[46px]';

const pastilha =
  'px-3.5 py-2 rounded-lg border text-xs font-bold transition-colors text-left';

export default function SalaAoVivo({
  nome,
  servidor,
  sala,
  pingMs,
  reconectando,
  streams,
  participantes,
  temTela,
  modoAudio,
  qualidade,
  aviso,
  onModoAudioChange,
  onQualidadeChange,
  onCompartilharTela,
  onLigarCamera,
  onEncerrarStream,
  onSair,
  onFecharAviso,
}: Props) {
  const [painelAberto, setPainelAberto] = useState(false);
  const [configAberta, setConfigAberta] = useState(false);
  const [divisoes, setDivisoes] = useState(1);
  const [copiado, setCopiado] = useState(false);
  const total = participantes.length + 1;

  // O palco mostra tantas quantas couberem na divisão escolhida. As vagas que
  // sobram ficam desenhadas e vazias: sem elas, a única transmissão pularia de
  // tamanho a cada pessoa que entra.
  const visiveis = streams.slice(0, divisoes);
  const vagas = Math.max(0, divisoes - visiveis.length);

  /**
   * Copia o link que leva direto a esta sala.
   *
   * O nome NÃO vai no link: ele é de quem convida, e quem recebe precisa
   * escolher o próprio. Vão só o servidor e a sala, que é o que a outra pessoa
   * não tem como adivinhar.
   */
  const copiarConvite = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('servidor', servidor);
    url.searchParams.set('sala', sala);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Área de transferência negada (contexto inseguro, ou o usuário
      // recusou). Mostrar o link é melhor do que não fazer nada.
      window.prompt('Copie o link do convite:', url.toString());
    }
  };

  const gradeDoPalco =
    divisoes === 1
      ? 'grid-cols-1'
      : divisoes === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="min-h-dvh flex flex-col">
      {/*
        Uma barra só, e compacta.
        Antes a escolha de áudio e a de qualidade ocupavam duas faixas de
        largura inteira acima do vídeo - a maior parte da tela era ajuste, e o
        conteúdo, que é a imagem, começava lá embaixo. Ajuste é coisa que se
        mexe uma vez; o lugar dele é atrás de um botão.
      */}
      <header className="flex items-center gap-2 mx-3 sm:mx-4 mt-3 px-3 py-2 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl">
        <Image src="/images/logo-96.png" alt="" width={24} height={24} className="object-contain shrink-0" />
        <span
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            reconectando ? 'bg-amber-400 animate-pulse' : 'bg-green-500'
          )}
          aria-label={reconectando ? 'reconectando' : 'conectado'}
        />

        {/*
          O convite: a sala em destaque e um botão que copia o link pronto.
          Passar "entra no meu servidor, o endereço é tal, a sala é tal" por
          mensagem é onde a maioria das chamadas morre - o link resolve isso com
          um clique, e quem abre já cai na tela de entrar com tudo preenchido.
        */}
        <button
          onClick={copiarConvite}
          title="Copiar link do convite"
          className={cn(
            'ml-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-black transition-colors min-w-0',
            copiado
              ? 'border-green-500/40 bg-green-500/10 text-green-400'
              : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
          )}
        >
          {copiado ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
          <span className="truncate max-w-[9rem] sm:max-w-[14rem]">
            {copiado ? 'Link copiado' : sala}
          </span>
        </button>

        <div className="flex-1" />

        {/* Divisão do palco: três botões grudados num trilho só. */}
        <div
          className="flex gap-0.5 p-0.5 rounded-xl border border-white/10 bg-white/[0.03]"
          role="group"
          aria-label="Divisão da tela"
        >
          {DIVISOES.map(({ quantas, Icone, titulo }) => (
            <button
              key={quantas}
              onClick={() => setDivisoes(quantas)}
              title={titulo}
              aria-label={titulo}
              aria-pressed={divisoes === quantas}
              className={cn(
                'grid place-items-center w-8 h-8 rounded-[0.6rem] transition-colors',
                divisoes === quantas
                  ? 'bg-green-500/15 text-green-400'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <Icone size={15} aria-hidden="true" />
            </button>
          ))}
        </div>

        {reconectando ? (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold shrink-0">
            <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            <span className="hidden sm:inline">Reconectando…</span>
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-green-400 text-xs font-black shrink-0">
            {pingMs > 0 ? `${pingMs}ms` : '—'}
          </span>
        )}

        <button
          onClick={() => setConfigAberta(true)}
          title="Configuração"
          aria-label="Configuração"
          className="grid place-items-center w-9 h-9 rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:text-white hover:bg-white/[0.08] shrink-0"
        >
          <Settings size={16} aria-hidden="true" />
        </button>
      </header>

      {aviso && (
        <div className="mx-3 sm:mx-4 mt-3 flex items-start justify-between gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10">
          <p className="text-red-300 text-sm leading-relaxed">{aviso}</p>
          <button
            onClick={onFecharAviso}
            className="text-red-300/70 hover:text-red-300 shrink-0"
            aria-label="Fechar aviso"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <main className="flex-1 min-h-0 mx-3 sm:mx-4 my-3">
        {visiveis.length === 0 ? (
          <div className="h-full min-h-[45dvh] flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-white/10 text-center px-6 py-14">
            <MonitorPlay size={34} className="text-zinc-700" aria-hidden="true" />
            <p className="font-black text-white">Ninguém transmitindo ainda</p>
            <p className="text-zinc-500 text-sm font-medium">
              Compartilhe sua tela ou ligue a câmera para começar.
            </p>
          </div>
        ) : (
          <div className={cn('grid gap-3', gradeDoPalco)}>
            {visiveis.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black aspect-video"
              >
                <Video stream={item.stream} mudo={item.local} />
                <span className="absolute left-3 bottom-3 max-w-[calc(100%-24px)] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-green-400 text-xs font-bold">
                  {item.kind === 'camera' ? (
                    <Camera size={13} aria-hidden="true" />
                  ) : (
                    <MonitorPlay size={13} aria-hidden="true" />
                  )}
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

            {Array.from({ length: vagas }).map((_, indice) => (
              <div
                key={`vaga-${indice}`}
                className="hidden sm:flex aspect-video flex-col items-center justify-center gap-2 rounded-[1.5rem] border border-dashed border-white/10"
              >
                <MonitorPlay size={22} className="text-zinc-800" aria-hidden="true" />
                <span className="text-zinc-700 text-xs font-bold">vaga livre</span>
              </div>
            ))}
          </div>
        )}

        {streams.length > divisoes && (
          <p className="mt-3 text-center text-xs text-zinc-600 font-medium">
            {streams.length - divisoes} transmissão(ões) fora do palco — aumente a divisão para ver.
          </p>
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
          className={cn(
            acao,
            'text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent'
          )}
        >
          <MonitorUp size={19} aria-hidden="true" />
          Tela
        </button>

        <button
          onClick={onLigarCamera}
          className={cn(acao, 'text-zinc-400 hover:text-white hover:bg-white/5')}
        >
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

      {configAberta && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setConfigAberta(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80dvh] overflow-y-auto rounded-[1.75rem] border border-white/10 bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-green-500/10 text-green-400 shrink-0">
                  <Settings size={18} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-black text-white leading-tight">Configuração</h2>
                  <p className="text-xs text-zinc-500 font-medium">
                    Vale para a próxima transmissão que você começar.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfigAberta(false)}
                className="grid place-items-center w-9 h-9 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                  Qualidade
                </h3>
                <div className="flex flex-col gap-2">
                  {QUALIDADES.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => onQualidadeChange(q.id)}
                      className={cn(
                        pastilha,
                        qualidade === q.id
                          ? 'border-green-500/40 bg-green-500/10 text-green-400'
                          : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-100'
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </section>

              {temTela && (
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">
                    Áudio ao transmitir
                  </h3>
                  <div className="flex flex-col gap-2">
                    {MODOS_AUDIO.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onModoAudioChange(m.id)}
                        className={cn(
                          pastilha,
                          modoAudio === m.id
                            ? 'border-green-500/40 bg-green-500/10 text-green-400'
                            : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-100'
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-zinc-600 leading-relaxed font-medium">
                    {pegarModoAudio(modoAudio).resumo}
                  </p>
                </section>
              )}
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setConfigAberta(false)}
                className="w-full py-3 rounded-xl bg-green-500 text-black font-black text-sm transition-colors hover:bg-green-400"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-white/5 bg-white/[0.03]"
                >
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 text-zinc-400 text-xs font-black shrink-0">
                    {p.nomeExibido.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm font-bold text-white">
                    {p.nomeExibido}
                  </span>
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
