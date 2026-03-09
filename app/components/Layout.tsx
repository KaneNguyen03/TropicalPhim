
import { Suspense } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Suspense fallback={
        <header className="sticky top-0 z-50 w-full h-16 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur" />
      }>
        <Header />
      </Suspense>
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}