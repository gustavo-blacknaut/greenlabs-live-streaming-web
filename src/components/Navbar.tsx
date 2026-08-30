'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { REPO, REPO_SERVER } from '@/lib/links';

const MENU = [
  { nome: 'Início', href: '/' },
  { nome: 'Entrar na sala', href: '/call' },
  { nome: 'Baixar', href: '/downloads' },
  { nome: 'Hospedar', href: REPO_SERVER, externo: true },
  { nome: 'GitHub', href: REPO, externo: true },
];

export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 20);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <div className="fixed w-full top-0 z-50 px-4 sm:px-6 py-4 flex justify-center pointer-events-none">
      <nav
        className={`pointer-events-auto transition-all duration-500 flex items-center justify-between ${
          rolado
            ? 'w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-2xl'
            : 'w-full max-w-7xl 2xl:max-w-[88rem] bg-transparent px-2 sm:px-4 lg:px-10 py-4 rounded-none border-transparent'
        }`}
      >
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <Image
              src="/images/logo-192.png"
              alt="GreenLabs"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <span className="font-black tracking-tighter text-lg text-white">GreenLabs</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {MENU.map((item) => (
            <Link
              key={item.nome}
              href={item.href}
              {...(item.externo ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-green-500 transition-colors"
            >
              {item.nome}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-gray-300 hover:text-white p-2 -mr-2"
          onClick={() => setAberto((v) => !v)}
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={aberto}
        >
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>

        {aberto && (
          <div className="absolute top-full left-0 right-0 mt-2 md:hidden bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
            {MENU.map((item) => (
              <Link
                key={item.nome}
                href={item.href}
                {...(item.externo ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setAberto(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-green-400 hover:bg-white/5 transition-colors"
              >
                {item.nome}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
