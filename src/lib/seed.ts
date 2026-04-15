import { db, OperationType, handleFirestoreError } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const students = [
  {
    name: "Alex Thompson",
    gpa: "3.98",
    tags: ["Seismic", "AI", "Machine Learning"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    bio: "Passionate about applying deep learning to seismic data interpretation.",
    isTopScorer: true,
    graduationDate: "2024-06-15"
  },
  {
    name: "Sarah Chen",
    gpa: "3.85",
    tags: ["GIS", "Gravity", "Magnetic"],
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Expert in integrated geophysical mapping and environmental assessments.",
    isTopScorer: false,
    graduationDate: "2024-06-15"
  }
];

export async function seedDatabase() {
  try {
    const studentsCol = collection(db, "students");
    const snapshot = await getDocs(studentsCol);
    
    if (snapshot.empty) {
      console.log("Seeding students...");
      for (const student of students) {
        await addDoc(studentsCol, student);
      }
      console.log("Seeding complete.");
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students");
  }
}
