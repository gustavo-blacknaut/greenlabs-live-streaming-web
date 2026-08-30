import { Check, Download, Github } from 'lucide-react';

export type Baixavel = {
  id: string;
  /** Windows, Linux, Android, Servidor. Vira a etiqueta do canto. */
  plataforma: string;
  titulo: string;
  resumo: string;
  detalhes: string[];
  /** Pagina da versao mais recente no GitHub. */
  href: string;
  repo: string;
  recomendado?: boolean;
};

export default function CartaoDeDownload({ item }: { item: Baixavel }) {
  return (
    <article
      className={`relative flex flex-col rounded-3xl border p-7 transition-colors ${
        item.recomendado
          ? 'border-green-500/40 bg-green-500/[0.06]'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20'
      }`}
    >
      {item.recomendado && (
        <span className="absolute -top-3 left-7 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-black text-[10px] font-black uppercase tracking-widest">
          Recomendado
        </span>
      )}

      <div className="flex items-start justify-between gap-4 mb-1">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
          {item.plataforma}
        </span>
        <a
          href={item.repo}
          target="_blank"
          rel="noreferrer"
          className="text-zinc-600 hover:text-white transition-colors"
          aria-label={`Código de ${item.titulo} no GitHub`}
        >
          <Github size={17} aria-hidden="true" />
        </a>
      </div>

      <h3 className="text-xl font-black text-white tracking-tight">{item.titulo}</h3>

      <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed font-medium text-pretty">
        {item.resumo}
      </p>

      <ul className="mt-5 space-y-2">
        {item.detalhes.map((detalhe) => (
          <li key={detalhe} className="flex items-start gap-2.5 text-[13px] text-zinc-400">
            <Check size={15} className="mt-0.5 shrink-0 text-green-500" aria-hidden="true" />
            <span className="font-medium">{detalhe}</span>
          </li>
        ))}
      </ul>

      {/* mt-auto prende o botao no rodape: sem isso, cartoes com textos de
          tamanhos diferentes ficam com os botoes em alturas diferentes. */}
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={`mt-auto pt-6 group inline-flex items-center justify-center gap-2.5 ${
          item.recomendado ? '' : ''
        }`}
      >
        <span
          className={`w-full px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-95 ${
            item.recomendado
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-[0_0_40px_rgba(34,197,94,0.35)] hover:scale-[1.02]'
              : 'border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:border-green-500/40 hover:bg-white/[0.07]'
          }`}
        >
          <Download size={17} aria-hidden="true" />
          Baixar
        </span>
      </a>
    </article>
  );
}
