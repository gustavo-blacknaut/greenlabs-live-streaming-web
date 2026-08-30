// Flat config direto, sem o FlatCompat.
//
// O shim existe para configs no formato antigo, e o eslint-config-next 16 ja
// exporta flat nativo. Passar por ele nao so era desnecessario como quebrava:
// o ESLint 10 tenta serializar a config para validar e o plugin do React tem
// referencia circular - "Converting circular structure to JSON", sem uma linha
// sobre o codigo do projeto.
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
