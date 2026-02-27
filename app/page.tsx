import Hero from '@/components/sections/Hero';
import InfoStrip from '@/components/sections/InfoStrip';
import PizzaSection from '@/components/sections/PizzaSection';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollReveal>
        <InfoStrip />
      </ScrollReveal>
      <ScrollReveal>
        <PizzaSection />
      </ScrollReveal>
    </main>
  );
}
