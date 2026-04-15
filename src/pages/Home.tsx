import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Globe, Users, Briefcase, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { seedDatabase } from "@/lib/seed";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export default function Home() {
  const [topScorer, setTopScorer] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      try {
        const q = query(collection(db, "students"), where("isTopScorer", "==", true), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setTopScorer({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "students");
      }
    };
    init();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-white/10 min-h-[calc(100vh-80px)]">
          
          {/* Hero Section */}
          <main className="lg:col-span-8 flex flex-col justify-center py-20 lg:pr-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="editorial-label text-accent mb-6">Department of Geophysics</div>
              <h1 className="text-editorial-hero mb-8">
                MAPPING<br />THE<br />DEPTHS
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-white/60 font-light mb-10">
                Technical authority in seismic interpretation, data acquisition, and AI-driven subsurface modeling. 
                Empowering the next generation of Earth science experts.
              </p>
              <div>
                <Button asChild className="bg-white text-deep-slate hover:bg-white/90 rounded-none px-10 py-7 text-xs font-black uppercase tracking-widest">
                  <Link to="/services">Request Survey &rarr;</Link>
                </Button>
              </div>
            </motion.div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 border-l border-white/10 pt-20 lg:pl-10 pb-20">
            <div className="space-y-16">
              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">Talent Portal Filters</h2>
                <div className="flex flex-wrap gap-2">
                  {["Seismic", "GIS", "Gravity", "AI/ML", "Magnetic", "Neural Networks", "Earth Science"].map((tag) => (
                    <div 
                      key={tag} 
                      className={cn(
                        "px-3 py-1.5 text-[10px] uppercase border border-white/10 bg-white/5",
                        (tag === "Seismic" || tag === "AI/ML") && "border-accent text-accent"
                      )}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">Core Services</h2>
                <ul className="space-y-0">
                  {[
                    "Field Data Surveys",
                    "Subsurface Interpretation",
                    "Thesis Advisory",
                    "Custom ML Modeling"
                  ].map((service) => (
                    <li key={service} className="flex justify-between items-center py-4 border-b border-white/5 group cursor-pointer hover:bg-white/5 transition-colors px-2">
                      <span className="text-sm font-medium text-white/80 group-hover:text-white">{service}</span>
                      <span className="text-accent text-xs">▸</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Footer Spotlight Area */}
          <footer className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 items-center border-t border-white/10 py-0">
            <div className="lg:col-span-5 bg-accent h-full min-h-[160px] flex items-center p-8 gap-6">
              <div className="w-20 h-20 bg-deep-slate rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 overflow-hidden">
                {topScorer?.photoUrl ? (
                  <img src={topScorer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  topScorer?.name?.split(" ").map((n: string) => n[0]).join("") || "EV"
                )}
              </div>
              <div>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1 font-bold">Top Scorer Spotlight</h3>
                <h2 className="text-2xl font-black text-white mb-1">{topScorer?.name || "Elena M. Vance"}</h2>
                <p className="text-xs text-white/90">GPA {topScorer?.gpa || "3.98"} | Specialization: {topScorer?.tags?.[0] || "Seismic ML"}</p>
              </div>
            </div>
            
            <div className="lg:col-span-7 flex justify-between px-10 py-10 lg:py-0">
              <div className="text-center lg:text-left">
                <h4 className="text-4xl font-light text-white mb-1">142</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Graduate Talents</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-4xl font-light text-white mb-1">38</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Global Projects</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-4xl font-light text-white mb-1">12</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/50">AI Algorithms</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
