import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import CustomCursor from "@/components/Cursor";

const serviceDetails: Record<string, any> = {
  "field-surveys": {
    title: "Field Surveys",
    category: "Data Acquisition",
    description: "High-precision data acquisition for various geophysical methods.",
    fullDescription: "Our comprehensive field survey services provide high-precision data acquisition using cutting-edge equipment and proven methodologies. We specialize in multiple survey types tailored to your specific exploration or investigation needs.",
    features: [
      "Induced Polarization (IP) Surveys",
      "Gravity & Magnetic Mapping",
      "Electrical Resistivity Tomography",
      "Ground Penetrating Radar (GPR)",
      "Airborne EM Surveys",
      "Marine Seismic Acquisition",
      "Time-domain Electromagnetics",
      "Spectral Analysis & Processing"
    ],
    benefits: [
      "High-resolution subsurface imaging",
      "Rapid deployment and data acquisition",
      "Real-time quality control",
      "Expert interpretation included",
      "Customized survey designs",
      "Full regulatory compliance"
    ],
    applications: [
      "Mineral and groundwater exploration",
      "Environmental site characterization",
      "Engineering geotechnical surveys",
      "Geothermal resource assessment",
      "Archaeological investigations"
    ]
  },
  "advanced-analytics": {
    title: "Advanced Analytics",
    category: "Data Processing",
    description: "Expert processing and interpretation of complex geophysical datasets.",
    fullDescription: "Transform raw geophysical data into actionable insights with our advanced analytics and interpretation services. Our team uses state-of-the-art software and proven methodologies to extract maximum value from your data.",
    features: [
      "2D/3D Seismic Interpretation",
      "GIS Integration & Spatial Analysis",
      "Structural Modeling",
      "Inversion & Forward Modeling",
      "Velocity Model Building",
      "Attribute Analysis & Ant Tracking",
      "Time-Lapse 4D Analysis",
      "Depth Conversion & Well Tie"
    ],
    benefits: [
      "Improved exploration success rates",
      "Reduced drilling risk and costs",
      "Enhanced resource estimation accuracy",
      "Optimized field development plans",
      "Integration of multi-source data",
      "Comprehensive interpretation reports"
    ],
    applications: [
      "Oil & gas exploration and development",
      "Mineral deposit delineation",
      "Hydrocarbon reserve estimation",
      "Geotechnical site characterization",
      "Groundwater resource mapping"
    ]
  },
  "ai-solutions": {
    title: "AI & ML Solutions",
    category: "Innovation",
    description: "Cutting-edge machine learning models for Earth science challenges.",
    fullDescription: "Leverage artificial intelligence and machine learning to solve complex geophysical challenges with unprecedented accuracy and efficiency. Our AI solutions are trained on real-world data and validated through rigorous testing.",
    features: [
      "Automated Lithology Classification",
      "Neural Network Seismic Processing",
      "Predictive Mineral Mapping",
      "Anomaly Detection Algorithms",
      "Deep Learning Image Interpretation",
      "Reinforcement Learning Optimization",
      "Natural Language Processing Reports",
      "Automated Quality Assurance"
    ],
    benefits: [
      "Faster interpretation and reduced costs",
      "Improved accuracy and consistency",
      "Scalable processing of large datasets",
      "Novel pattern recognition capabilities",
      "Continuous model improvement",
      "Reproducible and auditable results"
    ],
    applications: [
      "Automated seismic interpretation",
      "Mineral prospectivity mapping",
      "Fault and fracture prediction",
      "Lithological discrimination",
      "Pressure and pore fluid prediction",
      "Risk assessment and uncertainty quantification"
    ]
  },
  "environmental": {
    title: "Earth Science Projects",
    category: "Environmental",
    description: "Environmental and engineering geophysics for sustainable development.",
    fullDescription: "Address critical environmental and engineering challenges with our specialized geophysics expertise. We combine field measurements, advanced processing, and interpretation to deliver actionable solutions.",
    features: [
      "Hydrogeological Assessments",
      "Environmental Site Characterization",
      "Geotechnical Investigations",
      "Natural Hazard Mapping",
      "Carbon Storage Monitoring",
      "Permafrost & Geohazard Studies",
      "Groundwater Contamination Tracking",
      "Infrastructure Stability Monitoring"
    ],
    benefits: [
      "Regulatory compliance and certification",
      "Risk mitigation and hazard assessment",
      "Sustainability planning support",
      "Cost-effective site characterization",
      "Long-term monitoring solutions",
      "Predictive modeling capabilities"
    ],
    applications: [
      "Brownfield remediation planning",
      "Landfill and waste site investigation",
      "Aquifer and water resource management",
      "Earthquake and tsunami hazard assessment",
      "Climate change impact assessment",
      "Pipeline and infrastructure integrity"
    ]
  }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = serviceDetails[id || ""];

  if (!service) {
    return (
      <>
        <CustomCursor color="#D35400" size={32} trailing={true} />
        <div className="relative min-h-screen">
          <div className="grid-bg absolute inset-0 pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-10 relative z-10">
            <div className="border-x border-white/10 min-h-screen py-20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Service Not Found</h1>
                <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-none py-6 px-8">
                  <Link to="/services">Back to Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomCursor color="#D35400" size={32} trailing={true} />
      <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="border-x border-white/10 min-h-screen py-20">
          {/* Header */}
          <header className="mb-20 px-10">
            <Button asChild variant="outline" className="mb-8 rounded-none border-white/20 uppercase tracking-widest text-[10px] font-bold h-10 px-6">
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
            
            <div className="editorial-label text-accent mb-6">{service.category}</div>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-8">
              {service.title}
            </h1>
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-3xl">
              {service.fullDescription}
            </p>
          </header>

          <div className="px-10 space-y-20">
            {/* Key Features */}
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-12">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {service.features.map((feature: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-6 border border-white/10 bg-white/5 hover:border-accent/50 transition-colors"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-white/80 font-light">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-12">Key Benefits</h2>
              <ul className="space-y-4">
                {service.benefits.map((benefit: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 text-white/70 group cursor-pointer hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </section>

            {/* Applications */}
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-12">Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.applications.map((app: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-8 border border-white/10 bg-gradient-to-br from-white/5 to-white/0 hover:border-accent/50 transition-colors group"
                  >
                    <h3 className="text-white font-bold mb-2 group-hover:text-accent transition-colors">{app}</h3>
                    <div className="h-1 w-0 bg-accent group-hover:w-full transition-all duration-300" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="mt-20 p-12 lg:p-20 border border-white/10 bg-white/5 text-center">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Ready to get started?</h2>
              <p className="text-white/60 font-light mb-12 max-w-2xl mx-auto">
                Contact our team of experts to discuss how {service.title} can address your specific needs.
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-none py-8 px-12 text-xs font-black uppercase tracking-[0.3em]">
                <Link to="/contact">
                  REQUEST CONSULTATION <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
