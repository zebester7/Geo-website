import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, GraduationCap, CalendarDays, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Consultancy() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    serviceType: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...formData,
        date: Timestamp.fromDate(date),
        status: "pending"
      });
      setIsSuccess(true);
      setFormData({ clientName: "", clientEmail: "", serviceType: "", notes: "" });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "bookings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomCursor color="#D35400" size={32} trailing={true} />
      <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-white/10 min-h-screen">
          
          {/* Main Content */}
          <main className="lg:col-span-7 py-20 lg:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="editorial-label text-accent mb-6">Academic Support</div>
              <h1 className="text-EDITORIAL-HERO text-6xl font-black uppercase tracking-tighter mb-12">
                THESIS<br />ADVISORY
              </h1>
              
              <div className="space-y-16">
                <section>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">Specialized Guidance</h2>
                  <p className="text-white/60 font-light leading-relaxed mb-8 max-w-xl">
                    Our technical advisory team provides high-level support for geophysics research, focusing on seismic interpretation, potential field methods, and computational mineral exploration.
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { title: "Thesis Support", desc: "From topic definition to final peer review." },
                      { title: "Data Processing", desc: "Expert handling of raw field data." },
                      { title: "Software Training", desc: "Master Petrel, Oasis Montaj, and GIS." },
                      { title: "Tuition Services", desc: "One-on-one specialized geophysics tuition." }
                    ].map((item) => (
                      <div key={item.title} className="border border-white/10 p-6 bg-white/5">
                        <h3 className="text-[11px] uppercase tracking-widest font-bold text-accent mb-2">{item.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-6 border-b border-white/10 pb-4">Technical Pillars</h2>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Seismic Stratigraphy",
                      "Potential Field Methods",
                      "Geophysical Inversion",
                      "Subsurface Modeling",
                      "Gravity & Magnetics",
                      "Neural Network Integration"
                    ].map((pillar) => (
                      <li key={pillar} className="flex items-center space-x-3 text-[11px] uppercase tracking-widest font-bold text-white/70">
                        <span className="text-accent">▸</span>
                        <span>{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </motion.div>
          </main>

          {/* Sidebar Booking Form */}
          <aside className="lg:col-span-5 border-l border-white/10 pt-20 lg:pl-10 pb-20">
            <div className="sticky top-32">
              <div className="editorial-label text-white/40 mb-6">Session Scheduler</div>
              <div className="bg-white/5 border border-white/10 p-8">
                {isSuccess ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4">Request Logged</h3>
                    <p className="text-xs text-white/60 mb-8">Your technical advisory session has been requested. We will confirm via email.</p>
                    <Button variant="outline" className="rounded-none border-white/20 uppercase tracking-widest text-[10px] font-bold" onClick={() => setIsSuccess(false)}>
                      Book Another Slot
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-8">
                    <div className="space-y-4">
                      <label className="editorial-label text-white/40">Select Date</label>
                      <div className="bg-white/5 border border-white/10 p-2">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="editorial-label text-white/40">Service Category</label>
                        <Select onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                          <SelectTrigger className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus:ring-0 focus:border-accent uppercase tracking-widest text-[11px]">
                            <SelectValue placeholder="CHOOSE SERVICE" />
                          </SelectTrigger>
                          <SelectContent className="bg-deep-slate border-white/10 rounded-none">
                            <SelectItem value="thesis" className="text-[11px] uppercase tracking-widest">Thesis Advisory</SelectItem>
                            <SelectItem value="tuition" className="text-[11px] uppercase tracking-widest">Specialized Tuition</SelectItem>
                            <SelectItem value="consultancy" className="text-[11px] uppercase tracking-widest">Professional Consultancy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="editorial-label text-white/40">Full Name</label>
                        <Input 
                          placeholder="ENTER NAME" 
                          required 
                          className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus-visible:ring-0 focus-visible:border-accent uppercase tracking-widest text-[11px]"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="editorial-label text-white/40">Email Address</label>
                        <Input 
                          type="email" 
                          placeholder="ENTER EMAIL" 
                          required 
                          className="bg-transparent border-b border-t-0 border-x-0 border-white/10 rounded-none h-12 focus-visible:ring-0 focus-visible:border-accent uppercase tracking-widest text-[11px]"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-white text-deep-slate hover:bg-white/90 rounded-none py-8 text-xs font-black uppercase tracking-[0.3em]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "PROCESSING..." : "REQUEST SLOT ▸"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
