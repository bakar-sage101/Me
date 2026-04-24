import { HorizonHeroSection } from "@/components/ui/horizon-hero-section";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <HorizonHeroSection />
        

      </main>

      <footer className="py-12 border-t border-border">
        <div className="container px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PORTFOLIO. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Twitter</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
