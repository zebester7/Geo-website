import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { seedDatabase } from "@/lib/seed";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import CustomCursor from "@/components/Cursor";  // ✅ ADD THIS IMPORT

// Counter animation hook
function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); return; }
      setCount(Math.round(current));
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

// Staggered text animation
const heroWords = ["MAPPING", "THE", "DEPTHS"];

export default function Home() {
  const [topScorer, setTopScorer] = useState<any>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const talents = useCountUp(142, 1500, statsVisible);
  const projects = useCountUp(38, 1500, statsVisible);
  const algorithms = useCountUp(12, 1500, statsVisible);

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

  // Intersection observer for stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CustomCursor color="#D35400" size={32} trailing={true} />
      
      <div className="relative min-h-screen overflow-hidden">
        <div className="grid-bg absolute inset-0 pointer-events-none" />
        
        {/* Oil Rig Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1580829343991-feb4c5fb3742?auto=format&fit=crop&q=80&w=1600" 
            alt="Oil Rig"
            className="absolute right-0 top-0 w-full h-full object-cover opacity-15 blur-sm grayscale"
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-deep-slate via-deep-slate/70 to-transparent pointer-events-none"
          />
        </div>

        {/* Animated accent blob */}
        <motion.div
          className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: "#D35400" }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-white/10 min-h-[calc(100vh-80px)]">

            {/* ── Hero Section ── */}
            <main className="lg:col-span-8 flex flex-col justify-center py-20 lg:pr-10">

              {/* Label */}
              <motion.div
                className="editorial-label text-accent mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Department of Geophysics
              </motion.div>

              {/* Hero title — staggered lines */}
              <h1 className="text-editorial-hero mb-8 overflow-hidden">
                {heroWords.map((word, i) => (
                  <motion.span
                    key={word}
                    className="block"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.3 + i * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              {/* Description */}
              <motion.p
                className="max-w-lg text-lg leading-relaxed text-white/60 font-light mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.85 }}
              >
                Technical authority in seismic interpretation, data acquisition,
                and AI-driven subsurface modeling. Empowering the next generation
                of Earth science experts.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.05 }}
                whileHover={{ x: 6 }}
              >
                <Button
                  asChild
                  className="bg-white text-deep-slate hover:bg-white/90 rounded-none px-10 py-7 text-xs font-black uppercase tracking-widest transition-all duration-300"
                >
                  <Link to="/services">Request Survey &rarr;</Link>
                </Button>
              </motion.div>
            </main>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-4 border-l border-white/10 pt-20 lg:pl-10 pb-20">
              <div className="space-y-16">

                {/* Tags widget */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">
                    Talent Portal Filters
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {["Seismic","GIS","Gravity","AI/ML","Magnetic","Neural Networks","Earth Science"].map((tag, i) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
                        whileHover={{ scale: 1.05 }}
                        className={cn(
                          "px-3 py-1.5 text-[10px] uppercase border border-white/10 bg-white/5 cursor-pointer transition-colors duration-200",
                          (tag === "Seismic" || tag === "AI/ML") && "border-accent text-accent"
                        )}
                      >
                        {tag}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Services widget */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.75 }}
                >
                  <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">
                    Core Services
                  </h2>
                  <ul className="space-y-0">
                    {["Field Data Surveys","Subsurface Interpretation","Thesis Advisory","Custom ML Modeling"].map((service, i) => (
                      <motion.li
                        key={service}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.85 + i * 0.1 }}
                        whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.05)" }}
                        className="flex justify-between items-center py-4 border-b border-white/5 group cursor-pointer px-2 transition-colors duration-200"
                      >
                        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                          {service}
                        </span>
                        <motion.span
                          className="text-accent text-xs"
                          whileHover={{ x: 4 }}
                        >
                          ▸
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

              </div>
            </aside>

            {/* ── Footer Spotlight ── */}
            <motion.footer
              ref={footerRef}
              className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 items-center border-t border-white/10 py-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {/* Spotlight card */}
              <motion.div
                className="lg:col-span-5 bg-accent h-full min-h-[160px] flex items-center p-8 gap-6"
                whileHover={{ filter: "brightness(1.08)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 bg-deep-slate rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0 overflow-hidden"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
                >
                  {topScorer?.photoUrl ? (
                    <img src={topScorer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    topScorer?.name?.split(" ").map((n: string) => n[0]).join("") || "EV"
                  )}
                </motion.div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1 font-bold">
                    Top Scorer Spotlight
                  </h3>
                  <h2 className="text-2xl font-black text-white mb-1">
                    {topScorer?.name || "Farmanullah Khan"}
                  </h2>
                  <p className="text-xs text-white/90">
                    GPA {topScorer?.gpa || "3.98"} | Specialization:{" "}
                    {topScorer?.tags?.[0] || "Seismic ML"}
                  </p>
                </div>
              </motion.div>

              {/* Stats — count-up animation */}
              <div className="lg:col-span-7 flex justify-between px-10 py-10 lg:py-0">
                {[
                  { value: talents,    label: "Graduate Talents" },
                  { value: projects,   label: "Global Projects" },
                  { value: algorithms, label: "AI Algorithms" },
                ].map(({ value, label }, i) => (
                  <motion.div
                    key={label}
                    className="text-center lg:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 + i * 0.15 }}
                  >
                    <h4 className="text-4xl font-light text-white mb-1">{value}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.footer>

          </div>
        </div>
      </div>
    </>
  );
}