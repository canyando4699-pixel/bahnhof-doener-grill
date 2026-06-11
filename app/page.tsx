import Hero from '@/components/sections/Hero';
import Signature from '@/components/sections/Signature';
import Story from '@/components/sections/Story';
import FlappyDoener from '@/components/sections/FlappyDoener';
import Categories from '@/components/sections/Categories';
import Location from '@/components/sections/Location';
import CTABanner from '@/components/sections/CTABanner';
import Preloader from '@/components/ui/Preloader';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function Home() {
  return (
    <main>
      <Preloader />
      <Hero />
      <ScrollReveal>
        <Signature />
      </ScrollReveal>
      <Story />
      <FlappyDoener />
      <ScrollReveal>
        <Categories />
      </ScrollReveal>
      <Location />
      <ScrollReveal>
        <CTABanner />
      </ScrollReveal>
    </main>
  );
}
