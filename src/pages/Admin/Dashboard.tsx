import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Star,
  BarChart3,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { db, OperationType, handleFirestoreError } from "@/lib/firebase";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, "students"), (s) => 
      setStudents(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (e) => handleFirestoreError(e, OperationType.LIST, "students")
    );

    const unsubLeads = onSnapshot(collection(db, "leads"), (s) => 
      setLeads(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (e) => handleFirestoreError(e, OperationType.LIST, "leads")
    );

    const unsubBookings = onSnapshot(collection(db, "bookings"), (s) => 
      setBookings(s.docs.map(d => ({ id: d.id, ...d.data() }))),
      (e) => handleFirestoreError(e, OperationType.LIST, "bookings")
    );

    return () => {
      unsubStudents();
      unsubLeads();
      unsubBookings();
    };
  }, []);

  const handleDelete = async (coll: string, id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, coll, id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, coll);
      }
    }
  };

  const toggleTopScorer = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "students", id), { isTopScorer: !current });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, "students");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="border-x border-white/10 min-h-screen py-20">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 px-10">
            <div>
              <div className="editorial-label text-accent mb-2">Management Console</div>
              <h1 className="text-5xl font-black uppercase tracking-tighter">DASHBOARD</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="rounded-none border-white/20 uppercase tracking-widest text-[10px] font-bold h-12 px-8"
            >
              <LogOut className="mr-2 h-4 w-4" />
              EXIT PORTAL
            </Button>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-y border-white/10 mb-16">
            {[
              { label: "Total Students", value: students.length, icon: Users },
              { label: "Contact Leads", value: leads.length, icon: Mail },
              { label: "Consultancy", value: bookings.length, icon: Briefcase },
              { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: BarChart3 }
            ].map((stat) => (
              <div key={stat.label} className="bg-deep-slate p-10">
                <stat.icon className="h-5 w-5 text-accent mb-6" />
                <h4 className="text-4xl font-light text-white mb-1">{stat.value}</h4>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="px-10">
            <Tabs defaultValue="students" className="space-y-12">
              <TabsList className="bg-white/5 border border-white/10 rounded-none h-14 p-1 gap-1">
                <TabsTrigger value="students" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-deep-slate uppercase tracking-widest text-[10px] font-bold px-8 h-full">Students</TabsTrigger>
                <TabsTrigger value="leads" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-deep-slate uppercase tracking-widest text-[10px] font-bold px-8 h-full">Inquiries</TabsTrigger>
                <TabsTrigger value="portfolio" className="rounded-none data-[state=active]:bg-white data-[state=active]:text-deep-slate uppercase tracking-widest text-[10px] font-bold px-8 h-full">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Student Records</h2>
                  <Button className="bg-white text-deep-slate hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Record
                  </Button>
                </div>
                <div className="border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="editorial-label text-white py-6">Name</TableHead>
                        <TableHead className="editorial-label text-white py-6">GPA</TableHead>
                        <TableHead className="editorial-label text-white py-6">Tags</TableHead>
                        <TableHead className="editorial-label text-white py-6">Status</TableHead>
                        <TableHead className="editorial-label text-white py-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} className="border-white/10 hover:bg-white/5 transition-colors">
                          <TableCell className="font-bold uppercase tracking-tight text-sm py-6">{student.name}</TableCell>
                          <TableCell className="text-accent font-black">{student.gpa}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {student.tags?.map((t: string) => (
                                <span key={t} className="px-2 py-1 text-[8px] uppercase tracking-widest border border-white/10 bg-white/5">{t}</span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <button 
                              onClick={() => toggleTopScorer(student.id, student.isTopScorer)}
                              className={cn(
                                "px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold border transition-all",
                                student.isTopScorer ? "border-accent bg-accent text-white" : "border-white/10 text-white/40"
                              )}
                            >
                              {student.isTopScorer ? "Featured" : "Regular"}
                            </button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-4">
                              <button className="text-white/40 hover:text-white"><Edit className="h-4 w-4" /></button>
                              <button 
                                onClick={() => handleDelete("students", student.id)}
                                className="text-white/40 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="leads" className="space-y-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Recent Inquiries</h2>
                <div className="border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="editorial-label text-white py-6">Client</TableHead>
                        <TableHead className="editorial-label text-white py-6">Subject</TableHead>
                        <TableHead className="editorial-label text-white py-6">Category</TableHead>
                        <TableHead className="editorial-label text-white py-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...leads, ...bookings].map((item) => (
                        <TableRow key={item.id} className="border-white/10 hover:bg-white/5 transition-colors">
                          <TableCell className="py-6">
                            <div className="font-bold uppercase tracking-tight text-sm">{item.name || item.clientName}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{item.email || item.clientEmail}</div>
                          </TableCell>
                          <TableCell className="text-xs text-white/60 font-light">{item.subject || item.serviceType}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-[9px] uppercase tracking-widest border border-white/10 bg-white/5">
                              {item.subject ? "Lead" : "Booking"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <button 
                              onClick={() => handleDelete(item.subject ? "leads" : "bookings", item.id)}
                              className="text-white/40 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Project Portfolio</h2>
                  <Button className="bg-white text-deep-slate hover:bg-white/90 rounded-none uppercase tracking-widest text-[10px] font-bold h-10 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </div>
                <div className="grid gap-px bg-white/10 border border-white/10 md:grid-cols-2">
                  {[
                    { title: "Regional Seismic Interpretation", category: "Oil & Gas" },
                    { title: "AI-Driven Mineral Mapping", category: "Mining" },
                  ].map((project, i) => (
                    <div key={i} className="bg-deep-slate p-8 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight mb-1">{project.title}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-accent font-bold">{project.category}</p>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-white/40 hover:text-white"><Edit className="h-4 w-4" /></button>
                        <button className="text-white/40 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
