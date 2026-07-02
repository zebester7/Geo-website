import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Globe, Users, Briefcase, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-deep-slate to-black/95">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="grid-bg w-full h-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-slate via-transparent to-transparent" />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block editorial-label text-accent tracking-[0.3em] mb-6">
              Pioneering Earth Science
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-editorial-hero text-white leading-[0.85] mb-6"
          >
            Technical Authority in
            <span className="block text-accent">Geophysical Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl font-light mb-10 leading-relaxed"
          >
            Advanced geophysical surveys, AI-driven data processing, and innovative 
            Earth science solutions for academia and industry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-6 text-base">
              <Link to="/services">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base">
              <Link to="/talent">
                Talent Portal
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { label: "Projects Completed", value: "150+" },
              { label: "Satisfied Clients", value: "200+" },
              { label: "Industry Partners", value: "50+" },
              { label: "Years Experience", value: "15+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Geophysical Surveys",
      description: "State-of-the-art seismic, magnetic, and gravity surveys for mineral exploration."
    },
    {
      icon: Users,
      title: "Talent Development",
      description: "Training and mentorship programs for aspiring geophysicists and Earth scientists."
    },
    {
      icon: Briefcase,
      title: "Industry Solutions",
      description: "Custom geophysical solutions for mining, oil & gas, and environmental sectors."
    },
    {
      icon: BookOpen,
      title: "Research & Innovation",
      description: "Cutting-edge research in AI-driven data processing and Earth science applications."
    }
  ];

  return (
    <section className="py-24 bg-deep-slate/50 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="text-center mb-16">
          <span className="editorial-label text-accent tracking-[0.3em] block mb-4">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Comprehensive Earth Science
            <span className="block text-accent">Solutions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/20 text-center"
            >
              <div className="inline-flex p-4 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm font-light leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProjectsCarousel />
    </>
  );
}
