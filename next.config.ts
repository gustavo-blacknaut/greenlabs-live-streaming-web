import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Site estático: o WebRTC roda no navegador e a sinalização é o servidor de
  // quem hospeda, então não há backend para manter no ar.
  output: 'export',

  // O distDir manual que separava dev de build saiu: desde o Next 16 o dev
  // grava em .next/dev por conta propria, que e exatamente o que aquilo
  // resolvia - um `next build` com o `next dev` no ar sobrescrevia os arquivos
  // que o dev servia e a pagina perdia o CSS inteiro.
  images: { unoptimized: true },
};

export default nextConfig;
