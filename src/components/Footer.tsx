import { Globe, Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-deep-slate text-white/60">
      <div className="container mx-auto px-4 lg:px-10 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 border-b border-white/10 pb-20">
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-lg font-extrabold tracking-[0.2em] text-white uppercase">
                TERRA<span className="text-accent">INSIGHTS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed font-light">
              Technical authority in geophysical surveys, data processing, and AI-driven Earth science solutions.
            </p>
            <div className="flex space-x-6">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-accent transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="editorial-label text-white mb-8">Navigation</h3>
            <ul className="space-y-4 text-[11px] uppercase tracking-widest font-bold">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/talent" className="hover:text-accent transition-colors">Talent Portal</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link to="/consultancy" className="hover:text-accent transition-colors">Consultancy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="editorial-label text-white mb-8">Specializations</h3>
            <ul className="space-y-4 text-[11px] uppercase tracking-widest font-bold">
              <li><a href="#" className="hover:text-accent transition-colors">Seismic Surveys</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">GIS Mapping</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">AI Processing</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Thesis Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="editorial-label text-white mb-8">Contact</h3>
            <ul className="space-y-6 text-[11px] uppercase tracking-widest font-bold">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span className="leading-relaxed">123 Geophysics Way, Earth Science City</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>contact@terra-insights.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
          <p>© {new Date().getFullYear()} TERRA INSIGHTS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
