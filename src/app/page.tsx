import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <HorizonHeroSection />
      </main>
    </div>
  );
}
