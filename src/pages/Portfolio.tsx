import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import CustomCursor from "@/components/Cursor";

const projects = [
  {
    title: "Regional Seismic Interpretation",
    category: "Oil & Gas",
    year: "2024",
    location: "Gulf of Mexico",
    problem: "Identifying potential hydrocarbon traps in a structurally complex offshore basin with poor signal-to-noise ratio.",
    methodology: "Applied advanced post-stack noise reduction and attribute analysis (Coherence, RMS Amplitude) to delineate fault systems and stratigraphic traps.",
    beforeImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "AI-Driven Mineral Mapping",
    category: "Mining",
    year: "2024",
    location: "Australia - Pilbara Region",
    problem: "Traditional mapping techniques were too slow for a 5,000 sq km exploration block in rugged terrain.",
    methodology: "Trained a Convolutional Neural Network (CNN) on multi-spectral satellite imagery and airborne magnetic data to predict copper-gold porphyry signatures.",
    beforeImage: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Groundwater Resource Assessment",
    category: "Environmental",
    year: "2024",
    location: "Sub-Saharan Africa",
    problem: "Locating sustainable aquifers for a drought-stricken agricultural region with high salinity risks.",
    methodology: "Conducted integrated Electrical Resistivity Tomography (ERT) and Transient Electromagnetic (TEM) surveys to map freshwater-saltwater interfaces.",
    beforeImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Deep Marine Seismic Survey",
    category: "Oil & Gas",
    year: "2024",
    location: "North Sea - UK Block",
    problem: "Ultra-deep water exploration with complex velocity models and salt tectonics affecting imaging quality.",
    methodology: "Implemented full waveform inversion (FWI) and reverse time migration (RTM) to create high-resolution velocity models for sub-salt imaging.",
    beforeImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Lithium Deposit Detection",
    category: "Mining",
    year: "2024",
    location: "South America - Atacama Desert",
    problem: "Identifying subsurface lithium-rich brine deposits in a complex evaporite sequence.",
    methodology: "Combined gravity, magnetic, and induced polarization surveys with machine learning classification to map lithium-rich zones with high precision.",
    beforeImage: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Carbon Sequestration Monitoring",
    category: "Environmental",
    year: "2024",
    location: "Middle East - CCS Project",
    problem: "Real-time monitoring of injected CO2 plume migration in deep saline aquifers.",
    methodology: "Time-lapse 4D seismic acquisition with advanced inversion techniques to track CO2 saturation and pressure changes.",
    beforeImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Offshore Geotechnical Survey",
    category: "Engineering",
    year: "2024",
    location: "Southeast Asia - Renewable Energy Zone",
    problem: "Site characterization for offshore wind farm foundations in complex geological settings.",
    methodology: "High-resolution multibeam bathymetry, sub-bottom profiling, and cone penetrometer testing to assess seabed stability.",
    beforeImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Rare Earth Element Exploration",
    category: "Mining",
    year: "2024",
    location: "Canada - Arctic Region",
    problem: "Locating REE deposits beneath thick permafrost and glacial cover.",
    methodology: "Airborne electromagnetics combined with high-sensitivity magnetometry and deep drilling to characterize rare earth mineralization.",
    beforeImage: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=1000",
    afterImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
  }
];

export default function Portfolio() {
  return (
    <>
      <CustomCursor color="#D35400" size={32} trailing={true} />
      <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="border-x border-white/10 min-h-screen py-20">
          <header className="mb-20 px-10">
            <div className="editorial-label text-accent mb-6">Case Studies</div>
            <h1 className="text-EDITORIAL-HERO text-6xl font-black uppercase tracking-tighter">
              PROJECT<br />SHOWCASE
            </h1>
          </header>

          <div className="relative px-10">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ 
                clickable: true,
                renderBullet: (index, className) => {
                  return `<span class="${className} !w-8 !h-1 !rounded-none !bg-white/20 data-[state=active]:!bg-accent"></span>`;
                }
              }}
              autoplay={{ delay: 6000 }}
              className="border border-white/10 bg-white/5"
            >
              {projects.map((project, index) => (
                <SwiperSlide key={index}>
                  <div className="grid lg:grid-cols-12 gap-0">
                    {/* Content Side */}
                    <div className="lg:col-span-5 p-8 lg:p-16 border-r border-white/10 overflow-y-auto max-h-[600px]">
                      <div className="editorial-label text-accent mb-4">{project.category}</div>
                      <div className="flex flex-col gap-2 mb-6 text-xs text-white/50">
                        <span>📍 {project.location}</span>
                        <span>📅 {project.year}</span>
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight mb-8 leading-tight break-words">
                        {project.title}
                      </h2>
                      
                      <div className="space-y-10">
                        <section>
                          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 flex items-center">
                            <ChevronRight className="h-3 w-3 mr-2 text-accent flex-shrink-0" />
                            Problem Statement
                          </h4>
                          <p className="text-xs text-white/60 font-light leading-relaxed">{project.problem}</p>
                        </section>
                        <section>
                          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 flex items-center">
                            <ChevronRight className="h-3 w-3 mr-2 text-accent flex-shrink-0" />
                            Methodology
                          </h4>
                          <p className="text-xs text-white/60 font-light leading-relaxed">{project.methodology}</p>
                        </section>
                      </div>
                    </div>

                    {/* Visual Side */}
                    <div className="lg:col-span-7 relative bg-deep-slate">
                      <div className="grid h-full grid-cols-2 gap-px bg-white/10">
                        <div className="relative group overflow-hidden">
                          <img
                            src={project.beforeImage}
                            alt="Before"
                            className="h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-8 left-8">
                            <span className="editorial-label bg-deep-slate/80 px-3 py-1 text-white">Initial Data</span>
                          </div>
                        </div>
                        <div className="relative group overflow-hidden">
                          <img
                            src={project.afterImage}
                            alt="After"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-8 left-8">
                            <span className="editorial-label bg-accent px-3 py-1 text-white">Processed Results</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="absolute -bottom-20 right-10 flex gap-px bg-white/10 border border-white/10">
              <button className="swiper-button-prev-custom p-6 hover:bg-white/5 transition-colors group">
                <ArrowLeft className="h-5 w-5 text-white/40 group-hover:text-accent" />
              </button>
              <button className="swiper-button-next-custom p-6 hover:bg-white/5 transition-colors group">
                <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
