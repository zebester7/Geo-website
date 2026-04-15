import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Globe, Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login();
      navigate("/admin");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md border border-white/10 bg-white/5 p-10"
      >
        <div className="editorial-label text-accent mb-6 text-center">Security Gateway</div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-10 text-center">
          ADMIN<br />ACCESS
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="editorial-label text-white/40">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
              <Input
                type="email"
                placeholder="ENTER EMAIL"
                className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 pl-8 focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="editorial-label text-white/40">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 pl-8 focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {error && <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold text-center">{error}</p>}

          <Button type="submit" className="w-full bg-white text-deep-slate hover:bg-white/90 rounded-none py-8 text-xs font-black uppercase tracking-[0.3em]">
            AUTHORIZE ACCESS ▸
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
