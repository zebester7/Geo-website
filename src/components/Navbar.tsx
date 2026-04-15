import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, Users, Briefcase, BookOpen, Mail, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { name: "Home", path: "/", icon: Globe },
  { name: "Talent Portal", path: "/talent", icon: Users },
  { name: "Services", path: "/services", icon: Briefcase },
  { name: "Portfolio", path: "/portfolio", icon: BookOpen },
  { name: "Consultancy", path: "/consultancy", icon: BookOpen },
  { name: "Contact", path: "/contact", icon: Mail },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-10">
        <Link to="/" className="flex items-center">
          <span className="text-lg font-extrabold tracking-[0.2em] text-white uppercase">
            TERRA<span className="text-accent">INSIGHTS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-[11px] font-bold uppercase tracking-widest transition-all hover:text-accent",
                location.pathname === item.path 
                  ? "text-accent border-b-2 border-accent pb-1" 
                  : "text-white/70"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            to="/admin" 
            className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-background md:hidden"
          >
            <div className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-accent",
                    location.pathname === item.path ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
