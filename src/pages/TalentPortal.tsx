import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, FileText, Download, Eye, Upload, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, Timestamp } from "firebase/firestore";

const allTags = ["Seismic", "GIS", "Gravity", "Magnetic", "Machine Learning", "AI"];

export default function TalentPortal() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [cvName, setCvName] = useState("");
  const [cvEmail, setCvEmail] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");

  useEffect(() => {
    const studentsCol = collection(db, "students");
    const unsubscribe = onSnapshot(studentsCol, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "students");
    });

    return () => unsubscribe();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCVUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !cvName || !cvEmail) {
      alert("Please fill all fields and select a file");
      return;
    }

    setUploadStatus("uploading");
    try {
      // In production, upload file to Firebase Storage
      // For now, store metadata in Firestore
      await addDoc(collection(db, "cv-submissions"), {
        name: cvName,
        email: cvEmail,
        fileName: cvFile.name,
        fileSize: cvFile.size,
        submittedAt: Timestamp.now(),
        status: "pending"
      });
      
      setUploadStatus("success");
      setTimeout(() => {
        setCvName("");
        setCvEmail("");
        setCvFile(null);
        setShowCVUpload(false);
        setUploadStatus("idle");
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "cv-submissions");
      setUploadStatus("idle");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => student.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

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
              <div className="editorial-label text-accent mb-6">Talent Acquisition</div>
              <h1 className="text-EDITORIAL-HERO text-6xl font-black uppercase tracking-tighter mb-12">
                GRADUATE<br />PORTFOLIO
              </h1>

              {/* CV Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 p-8 border border-accent/30 bg-accent/5"
              >
                {!showCVUpload ? (
                  <Button 
                    onClick={() => setShowCVUpload(true)}
                    className="w-full bg-accent hover:bg-accent/90 text-white rounded-none py-6 text-xs font-black uppercase tracking-[0.3em]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Your CV
                  </Button>
                ) : (
                  <form onSubmit={handleCVUpload} className="space-y-4">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Submit Your CV</h3>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={cvName}
                      onChange={(e) => setCvName(e.target.value)}
                      className="rounded-none bg-white/5 border-white/10"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={cvEmail}
                      onChange={(e) => setCvEmail(e.target.value)}
                      className="rounded-none bg-white/5 border-white/10"
                      required
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="cv-file"
                        required
                      />
                      <label htmlFor="cv-file" className="block p-3 border-2 border-dashed border-white/20 cursor-pointer hover:border-accent transition-colors text-center">
                        <FileText className="h-5 w-5 mx-auto mb-2 text-accent" />
                        <span className="text-sm text-white/60">{cvFile ? cvFile.name : "Select PDF or DOC"}</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        type="button"
                        onClick={() => {
                          setShowCVUpload(false);
                          setCvFile(null);
                        }}
                        variant="outline"
                        className="rounded-none"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={uploadStatus === "uploading"}
                        className="rounded-none bg-accent hover:bg-accent/90"
                      >
                        {uploadStatus === "uploading" && "Uploading..."}
                        {uploadStatus === "success" && <CheckCircle className="mr-2 h-4 w-4" />}
                        {uploadStatus === "idle" && "Upload"}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
              
              <div className="grid gap-8 sm:grid-cols-2">
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    layout
                    className="group border border-white/10 bg-white/5 overflow-hidden"
                  >
                    <div className="aspect-[4/3] overflow-hidden border-b border-white/10">
                      <img
                        src={student.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"}
                        alt={student.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black uppercase tracking-tight">{student.name}</h3>
                        <span className="text-accent font-bold text-sm">GPA {student.gpa}</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed mb-6 line-clamp-2 font-light">
                        {student.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {student.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 text-[9px] uppercase tracking-widest border border-white/10 bg-white/5 text-white/70">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-white/10">
                        <button className="bg-deep-slate py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-deep-slate transition-colors">
                          View CV
                        </button>
                        <button className="bg-deep-slate py-4 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-deep-slate transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredStudents.length === 0 && !loading && (
                <div className="py-20 text-center border border-dashed border-white/10">
                  <p className="text-white/40 uppercase tracking-widest text-xs">No matching profiles found</p>
                  <Button variant="link" onClick={() => { setSearch(""); setSelectedTags([]); }} className="text-accent mt-4">
                    Reset all filters
                  </Button>
                </div>
              )}
            </motion.div>
          </main>

          {/* Sidebar Filters */}
          <aside className="lg:col-span-4 border-l border-white/10 pt-20 lg:pl-10 pb-20">
            <div className="sticky top-32 space-y-16">
              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">Search Database</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <Input
                    placeholder="ENTER NAME..."
                    className="bg-white/5 border-white/10 rounded-none pl-10 text-[11px] uppercase tracking-widest h-12 focus-visible:ring-accent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="portal-widget">
                <h2 className="text-[12px] uppercase tracking-[0.15em] font-bold text-white/40 mb-6">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-2 text-[10px] uppercase tracking-widest border transition-all",
                        selectedTags.includes(tag) 
                          ? "border-accent bg-accent text-white" 
                          : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button 
                    onClick={() => setSelectedTags([])}
                    className="mt-6 text-[10px] uppercase tracking-widest text-accent font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
