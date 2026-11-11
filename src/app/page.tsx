import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Pillars from "@/components/landing/Pillars";
import DailyModel from "@/components/landing/DailyModel";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Pillars />
      <DailyModel />
      <FinalCta />
      <Footer />
    </main>
  );
}
