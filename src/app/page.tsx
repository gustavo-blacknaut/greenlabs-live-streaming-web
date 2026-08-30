import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import Recursos from '@/components/home/Recursos';
import Compatibilidade from '@/components/home/Compatibilidade';
import Patrocinio from '@/components/home/Patrocinio';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Recursos />
        <Compatibilidade />
        <Patrocinio />
      </main>
      <Footer />
    </>
  );
}
