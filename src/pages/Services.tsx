import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Database, Cpu, Leaf, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const services = [
  {
    id: "field-surveys",
    title: "Field Surveys",
    description: "High-precision data acquisition for various geophysical methods.",
    icon: Globe,
    category: "Data Acquisition",
    fullDescription: "Our comprehensive field survey services provide high-precision data acquisition using cutting-edge equipment and proven methodologies.",
    features: [
      "Induced Polarization (IP) Surveys",
      "Gravity & Magnetic Mapping",
      "Electrical Resistivity Tomography",
      "Ground Penetrating Radar (GPR)",
      "Airborne EM Surveys",
      "Marine Seismic Acquisition"
    ]
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Expert processing and interpretation of complex geophysical datasets.",
    icon: Database,
    category: "Data Processing",
    fullDescription: "Transform raw geophysical data into actionable insights with our advanced analytics and interpretation services.",
    features: [
      "2D/3D Seismic Interpretation",
      "GIS Integration & Spatial Analysis",
      "Structural Modeling",
      "Inversion & Forward Modeling",
      "Velocity Model Building",
      "Attribute Analysis & Ant Tracking"
    ]
  },
  {
    id: "ai-solutions",
    title: "AI & ML Solutions",
    description: "Cutting-edge machine learning models for Earth science challenges.",
    icon: Cpu,
    category: "Innovation",
    fullDescription: "Leverage artificial intelligence and machine learning to solve complex geophysical challenges with unprecedented accuracy.",
    features: [
      "Automated Lithology Classification",
      "Neural Network Seismic Processing",
      "Predictive Mineral Mapping",
      "Anomaly Detection Algorithms",
      "Deep Learning Image Interpretation",
      "Reinforcement Learning Optimization"
    ]
  },
  {
    id: "environmental",
    title: "Earth Science Projects",
    description: "Environmental and engineering geophysics for sustainable development.",
    icon: Leaf,
    category: "Environmental",
    fullDescription: "Address critical environmental and engineering challenges with our specialized geophysics expertise.",
    features: [
      "Hydrogeological Assessments",
      "Environmental Site Characterization",
      "Geotechnical Investigations",
      "Natural Hazard Mapping",
      "Carbon Storage Monitoring",
      "Permafrost & Geohazard Studies"
    ]
  }
];

export default function Services() {
  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="border-x border-white/10 min-h-screen py-20">
          <header className="mb-20 px-10">
            <div className="editorial-label text-accent mb-6">Capabilities</div>
            <h1 className="text-EDITORIAL-HERO text-6xl font-black uppercase tracking-tighter">
              PROFESSIONAL<br />SERVICES
            </h1>
            <p className="mt-8 text-white/60 font-light leading-relaxed max-w-2xl">
              From the field to the cloud, we provide end-to-end geophysical solutions powered by technical expertise and computational innovation.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border-y border-white/10">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-deep-slate p-12 lg:p-16 group hover:bg-white/5 transition-colors duration-500"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="p-4 border border-white/10 bg-white/5 group-hover:border-accent transition-colors">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="editorial-label text-white/20 group-hover:text-white/40 transition-colors">0{index + 1}</div>
                </div>
                
                <div className="editorial-label text-accent mb-4">{service.category}</div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-6 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-10">
                  {service.description}
                </p>

                <div className="space-y-4 mb-12">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-6">Key Capabilities</h4>
                  <ul className="grid gap-4">
                    {service.features.slice(0, 4).map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center space-x-3 text-[11px] uppercase tracking-widest font-bold text-white/70">
                        <ChevronRight className="h-3 w-3 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="w-full bg-white text-deep-slate hover:bg-white/90 rounded-none py-8 text-xs font-black uppercase tracking-[0.3em]">
                  <Link to={`/services/${service.id}`}>
                    Learn More ▸
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <section className="mt-20 px-10">
            <div className="border border-white/10 bg-white/5 p-12 lg:p-20 text-center">
              <h2 className="text-4xl font-black uppercase tracking-tight mb-6">Have a specific project in mind?</h2>
              <p className="text-white/60 font-light mb-12 max-w-xl mx-auto">Our team of experts is ready to help you solve your most complex Earth science challenges with precision and authority.</p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-none py-8 px-12 text-xs font-black uppercase tracking-[0.3em]">
                <Link to="/contact">SCHEDULE A CONSULTATION ▸</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
