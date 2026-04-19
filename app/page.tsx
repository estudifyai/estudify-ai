import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import ReadinessSection from "./components/ReadinessSection";
import PricingSection from "./components/PricingSection";
import FAQ from "./components/FAQ";
import WaitlistCTA from "./components/WaitlistCTA";
import Footer from "./components/Footer";
import FadeObserver from "./components/FadeObserver";

export default function Home() {
  return (
    <>
      <FadeObserver />
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ReadinessSection />
        <PricingSection />
        <FAQ />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  );
}
