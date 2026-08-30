import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Site estático: o WebRTC roda no navegador e a sinalização é o servidor de
  // quem hospeda, então não há backend para manter no ar.
  output: 'export',

  // Dev e build em pastas separadas. Compartilhando a mesma, um
  // `next build` rodado com o `next dev` no ar sobrescreve os arquivos que o
  // dev estava servindo, e o site perde o CSS inteiro - 404 nas folhas de
  // estilo, pagina sem estilo nenhum. Ja aconteceu duas vezes.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: { unoptimized: true },
};

export default nextConfig;
