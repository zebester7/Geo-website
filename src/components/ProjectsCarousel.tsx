import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample project data - replace with your actual data
const projectsData = [
  {
    id: 1,
    title: "Seismic Survey - Gulf of Mexico",
    category: "Geophysical Survey",
    description: "High-resolution 3D seismic imaging for offshore oil exploration.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    link: "/portfolio/1"
  },
  {
    id: 2,
    title: "AI-Driven Mineral Prediction",
    category: "Machine Learning",
    description: "Machine learning models for mineral deposit prediction in remote areas.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    link: "/portfolio/2"
  },
  {
    id: 3,
    title: "GIS Mapping - Urban Planning",
    category: "GIS & Mapping",
    description: "Comprehensive GIS mapping for sustainable urban development projects.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop",
    link: "/portfolio/3"
  },
  {
    id: 4,
    title: "Thesis Support - Geophysics",
    category: "Academic Support",
    description: "Technical assistance and data analysis for geophysics thesis projects.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    link: "/portfolio/4"
  },
  {
    id: 5,
    title: "Environmental Impact Assessment",
    category: "Environmental",
    description: "Geophysical surveys for environmental impact assessment studies.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
    link: "/portfolio/5"
  },
  {
    id: 6,
    title: "Deep Earth Tomography",
    category: "Advanced Analytics",
    description: "3D tomography imaging for deep earth structure analysis.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    link: "/portfolio/6"
  }
];

export function ProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(carouselRef, { once: false, amount: 0.2 });

  // Duplicate projects for infinite scroll effect
  const extendedProjects = [...projectsData, ...projectsData, ...projectsData];
  const itemsToShow = 3;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && !isHovering) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projectsData.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering]);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  const getVisibleProjects = () => {
    const start = currentIndex;
    const end = start + itemsToShow;
    return extendedProjects.slice(start, end);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <section 
      ref={carouselRef}
      className="relative py-24 bg-gradient-to-b from-deep-slate to-black/95 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid-bg w-full h-full" />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="editorial-label text-accent tracking-[0.3em] block mb-4">
            Featured Projects
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Our <span className="text-accent">Latest Work</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg font-light">
            Showcasing innovative solutions in geophysical surveys, data processing, 
            and AI-driven Earth science.
          </p>
        </motion.div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-all duration-300 -ml-4 lg:-ml-6 hover:scale-110"
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-3 rounded-full transition-all duration-300 -mr-4 lg:-mr-6 hover:scale-110"
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Projects Grid */}
          <motion.div
            animate={controls}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {getVisibleProjects().map((project, index) => (
              <motion.div
                key={`${project.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded">
                      {project.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <a
                      href={project.link}
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-4 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <ExternalLink className="w-6 h-6 text-white" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm font-light line-clamp-2">
                    {project.description}
                  </p>
                  <div className="pt-3 flex items-center justify-between border-t border-white/10">
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                      View Project →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {projectsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                index === currentIndex 
                  ? "w-12 bg-accent" 
                  : "w-6 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-Play Indicator */}
        <div className="text-center mt-6">
          <span className="text-xs text-white/30 uppercase tracking-[0.3em]">
            {isAutoPlaying ? "● Auto-scrolling" : "▸ Manual navigation"}
          </span>
        </div>
      </div>
    </section>
  );
}
