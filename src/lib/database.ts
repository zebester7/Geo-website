import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// ===============================================================
// Type Definitions
// ===============================================================

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor';
  bio: string;
  profilePicUrl: string;
  cvUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  teamMembers: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'draft' | 'published';
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  batch: string;
  department: string;
  status: 'active' | 'inactive' | 'graduated';
  managedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===============================================================
// User Profile Operations
// ===============================================================

export const userDB = {
  /**
   * Create a new user profile (called on signup)
   */
  async createProfile(
    uid: string,
    email: string,
    fullName: string,
    role: 'admin' | 'editor' = 'editor'
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      await setDoc(doc(db, 'users', uid), {
        uid,
        email,
        fullName,
        role,
        bio: '',
        profilePicUrl: '',
        cvUrl: '',
        createdAt: now,
        updatedAt: now,
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  /**
   * Get user profile by UID
   */
  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Subscribe to user profile changes
   */
  subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void) {
    return onSnapshot(
      doc(db, 'users', uid),
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as UserProfile);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error subscribing to profile:', error);
        throw error;
      }
    );
  },

  /**
   * Get all users (admin only - should be called server-side)
   */
  async getAllUsers(role?: 'admin' | 'editor'): Promise<UserProfile[]> {
    try {
      const constraints: QueryConstraint[] = [];
      if (role) {
        constraints.push(where('role', '==', role));
      }
      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(db, 'users'), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};

// ===============================================================
// Project Operations
// ===============================================================

export const projectDB = {
  /**
   * Create a new project
   */
  async createProject(
    title: string,
    description: string,
    createdBy: string,
    imageUrl: string = '',
    teamMembers: string[] = [],
    status: 'draft' | 'published' = 'draft'
  ): Promise<string> {
    try {
      const docRef = doc(collection(db, 'projects'));
      const now = Timestamp.now();

      await setDoc(docRef, {
        title,
        description,
        imageUrl,
        teamMembers,
        createdBy,
        status,
        createdAt: now,
        updatedAt: now,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  /**
   * Get a project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    try {
      const docSnap = await getDoc(doc(db, 'projects', id));
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Project) : null;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  /**
   * Get projects created by a user (with optional status filter)
   */
  async getProjectsByUser(
    userId: string,
    status?: 'draft' | 'published'
  ): Promise<Project[]> {
    try {
      const constraints: QueryConstraint[] = [where('createdBy', '==', userId)];
      if (status) {
        constraints.push(where('status', '==', status));
      }
      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(collection(db, 'projects'), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Project));
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  },

  /**
   * Get all published projects
   */
  async getPublishedProjects(limitCount: number = 100): Promise<Project[]> {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Project));
    } catch (error) {
      console.error('Error fetching published projects:', error);
      throw error;
    }
  },

  /**
   * Update a project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  /**
   * Subscribe to user's projects
   */
  subscribeToUserProjects(
    userId: string,
    callback: (projects: Project[]) => void
  ) {
    const q = query(
      collection(db, 'projects'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Project));
        callback(projects);
      },
      (error) => {
        console.error('Error subscribing to projects:', error);
        throw error;
      }
    );
  },
};

// ===============================================================
// Student Operations
// ===============================================================

export const studentDB = {
  /**
   * Create a new student record
   */
  async createStudent(
    name: string,
    rollNumber: string,
    batch: string,
    department: string,
    managedBy: string,
    status: 'active' | 'inactive' | 'graduated' = 'active'
  ): Promise<string> {
    try {
      const docRef = doc(collection(db, 'students'));
      const now = Timestamp.now();

      await setDoc(docRef, {
        name,
        rollNumber,
        batch,
        department,
        status,
        managedBy,
        createdAt: now,
        updatedAt: now,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  /**
   * Get a student by ID
   */
  async getStudent(id: string): Promise<Student | null> {
    try {
      const docSnap = await getDoc(doc(db, 'students', id));
      return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Student) : null;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  /**
   * Get students managed by a user
   */
  async getStudentsByManager(userId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, 'students'),
        where('managedBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Student));
    } catch (error) {
      console.error('Error fetching user students:', error);
      throw error;
    }
  },

  /**
   * Get all students (admin only)
   */
  async getAllStudents(): Promise<Student[]> {
    try {
      const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Student));
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw error;
    }
  },

  /**
   * Update a student record
   */
  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      await updateDoc(doc(db, 'students', id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  /**
   * Delete a student record
   */
  async deleteStudent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  /**
   * Subscribe to manager's students
   */
  subscribeToUserStudents(
    userId: string,
    callback: (students: Student[]) => void
  ) {
    const q = query(
      collection(db, 'students'),
      where('managedBy', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const students = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Student));
        callback(students);
      },
      (error) => {
        console.error('Error subscribing to students:', error);
        throw error;
      }
    );
  },
};
