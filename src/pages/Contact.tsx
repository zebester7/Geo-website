import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "leads");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-white/10 min-h-screen">
          
          {/* Main Content */}
          <main className="lg:col-span-8 py-20 lg:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="editorial-label text-accent mb-6">Connect With Us</div>
              <h1 className="text-EDITORIAL-HERO text-6xl font-black uppercase tracking-tighter mb-12">
                PROJECT<br />INQUIRY
              </h1>
              
              <div className="bg-white/5 border border-white/10 p-10">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 text-accent">
                      <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Transmission Received</h3>
                    <p className="mt-4 text-white/60 font-light max-w-sm">Our technical team has been notified. We will respond to your inquiry within 24 hours.</p>
                    <Button variant="outline" className="mt-10 rounded-none border-white/20 uppercase tracking-widest text-[10px] font-bold" onClick={() => setIsSuccess(false)}>
                      Send New Message
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="editorial-label text-white/40">Full Name</label>
                        <Input 
                          placeholder="ENTER NAME" 
                          required 
                          className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px]"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="editorial-label text-white/40">Email Address</label>
                        <Input 
                          type="email" 
                          placeholder="ENTER EMAIL" 
                          required 
                          className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px]"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="editorial-label text-white/40">Subject</label>
                      <Input 
                        placeholder="INQUIRY TYPE" 
                        required 
                        className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px]"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="editorial-label text-white/40">Message Payload</label>
                      <Textarea 
                        placeholder="PROVIDE PROJECT DETAILS..." 
                        className="min-h-[150px] bg-transparent border border-white/10 rounded-none focus-visible:ring-0 focus-visible:border-accent transition-colors uppercase tracking-widest text-[11px] p-4" 
                        required 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-white text-deep-slate hover:bg-white/90 rounded-none py-8 text-xs font-black uppercase tracking-[0.3em]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE ▸"}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </main>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 border-l border-white/10 pt-20 lg:pl-10 pb-20">
            <div className="space-y-16">
              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-8">Global Headquarters</h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-accent shrink-0" />
                    <div>
                      <h3 className="text-[11px] uppercase tracking-widest font-bold text-white mb-2">Location</h3>
                      <p className="text-xs text-white/60 font-light leading-relaxed">
                        123 Geophysics Way<br />
                        Earth Science City, ES 45678
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-accent shrink-0" />
                    <div>
                      <h3 className="text-[11px] uppercase tracking-widest font-bold text-white mb-2">Technical Support</h3>
                      <p className="text-xs text-white/60 font-light">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-accent shrink-0" />
                    <div>
                      <h3 className="text-[11px] uppercase tracking-widest font-bold text-white mb-2">Direct Email</h3>
                      <p className="text-xs text-white/60 font-light">contact@terra-insights.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-8">Operational Hours</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest">
                    <span className="text-white/40">Mon — Fri</span>
                    <span className="text-white">08:00 — 18:00</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest">
                    <span className="text-white/40">Sat — Sun</span>
                    <span className="text-white">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
