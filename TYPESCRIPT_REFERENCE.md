# 📚 TypeScript Type Reference & Import Guide

## Quick Imports Reference

### Authentication
```typescript
import { useAuth } from '@/lib/AuthContext';
import type { AuthContextType, UserRole } from '@/lib/AuthContext';

// Usage
const { user, userProfile, isAdmin, isEditor, role } = useAuth();
```

### Database Operations
```typescript
import { userDB, projectDB, studentDB } from '@/lib/database';
import type { UserProfile, Project, Student } from '@/lib/database';

// Type usage
const profile: UserProfile = { /* ... */ };
const project: Project = { /* ... */ };
const student: Student = { /* ... */ };
```

### File Uploads
```typescript
import {
  uploadProfilePicture,
  uploadCV,
  uploadProjectImage,
  deleteStorageFile,
  formatFileSize,
  validateImageFile,
  validatePdfFile,
} from '@/lib/fileUpload';
import type { FileUploadResult, FileUploadError } from '@/lib/fileUpload';
```

### Components
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';
```

---

## Type Definitions

### UserProfile
```typescript
interface UserProfile {
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
```

### Project
```typescript
interface Project {
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
```

### Student
```typescript
interface Student {
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
```

### FileUploadResult
```typescript
interface FileUploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
}
```

### FileUploadError
```typescript
interface FileUploadError {
  code: string;
  message: string;
}
```

### AuthContextType
```typescript
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  clearError: () => void;
}
```

### UserRole
```typescript
type UserRole = 'admin' | 'editor' | null;
```

---

## Common Usage Patterns

### Create a User on Signup
```typescript
import { userDB } from '@/lib/database';

const newUserId = 'user-uid-here';
await userDB.createProfile(
  newUserId,
  'email@example.com',
  'Full Name',
  'editor' // or 'admin'
);
```

### Fetch & Subscribe to Profile
```typescript
import { userDB } from '@/lib/database';

// One-time fetch
const profile = await userDB.getProfile('uid-here');

// Real-time subscription
const unsubscribe = userDB.subscribeToProfile('uid-here', (profile) => {
  if (profile) {
    console.log('Profile updated:', profile);
  }
});

// Don't forget to unsubscribe
unsubscribe();
```

### Create & Upload Project
```typescript
import { projectDB } from '@/lib/database';
import { uploadProjectImage } from '@/lib/fileUpload';

const file = /* File object */;
const imageResult = await uploadProjectImage('temp-id', file);

const projectId = await projectDB.createProject(
  'Project Title',
  'Project description',
  userId,
  imageResult.url, // URL from upload
  ['member1', 'member2'],
  'draft'
);
```

### Update Project
```typescript
await projectDB.updateProject('project-id', {
  title: 'New Title',
  status: 'published',
});
```

### Subscribe to User's Projects
```typescript
import { projectDB } from '@/lib/database';

const unsubscribe = projectDB.subscribeToUserProjects(
  userId,
  (projects) => {
    console.log('Projects updated:', projects);
  }
);
```

### Create Student Record
```typescript
import { studentDB } from '@/lib/database';

const studentId = await studentDB.createStudent(
  'Student Name',
  '2024-001',
  '2024-2028',
  'Geology',
  managedByUserId,
  'active'
);
```

### Query Students by Manager
```typescript
const students = await studentDB.getStudentsByManager(userId);
```

### Handle File Validation
```typescript
import { validateImageFile, validatePdfFile } from '@/lib/fileUpload';

const file = event.target.files[0];
const error = validateImageFile(file);

if (error) {
  console.error(error.message);
  // Show error to user
} else {
  // File is valid, proceed with upload
  const result = await uploadProfilePicture(userId, file);
}
```

### Format File Size
```typescript
import { formatFileSize } from '@/lib/fileUpload';

const sizeStr = formatFileSize(5242880); // "5 MB"
```

### Use Protected Route
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboard from './AdminDashboard';

// Require editor or admin role
<ProtectedRoute requiredRole="editor">
  <AdminDashboard />
</ProtectedRoute>

// Require admin role only
<ProtectedRoute requiredRole="admin">
  <AdminOnly />
</ProtectedRoute>
```

### Use Authentication Hook
```typescript
import { useAuth } from '@/lib/AuthContext';

function MyComponent() {
  const { user, loading, isAdmin, role, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Hello, {user.email}</p>
      <p>Role: {role}</p>
      {isAdmin && <p>You are an admin</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Enum Values

### User Role
```typescript
'admin' | 'editor'
```

### Project Status
```typescript
'draft' | 'published'
```

### Student Status
```typescript
'active' | 'inactive' | 'graduated'
```

---

## Common Errors & Solutions

### Error: "Cannot read property 'uid' of undefined"
**Solution**: Check that `userProfile` is not null before accessing properties
```typescript
if (userProfile) {
  const uid = userProfile.uid;
}
```

### Error: "ReferenceError: database is not defined"
**Solution**: Import from correct path
```typescript
import { userDB, projectDB, studentDB } from '@/lib/database';
```

### Error: "File validation failed"
**Solution**: Check file type and size
```typescript
import { validateImageFile } from '@/lib/fileUpload';

const error = validateImageFile(file);
if (error) {
  console.error(error.message);
}
```

### Error: "Permission denied in Firestore"
**Solution**: Check security rules and user role
1. Verify rules are deployed
2. Check user role in Firestore
3. Verify document ownership

---

## Performance Tips

### 1. Unsubscribe from Real-time Listeners
```typescript
useEffect(() => {
  const unsubscribe = projectDB.subscribeToUserProjects(
    userId,
    setProjects
  );
  
  // IMPORTANT: Clean up subscription
  return () => unsubscribe();
}, [userId]);
```

### 2. Use Try/Catch for All Async Operations
```typescript
try {
  await projectDB.createProject(/* ... */);
} catch (err) {
  console.error('Error:', err);
  setError(err.message);
}
```

### 3. Debounce File Uploads
```typescript
const handleFileChange = (file: File) => {
  // Validate before starting upload
  const error = validateImageFile(file);
  if (error) {
    setError(error.message);
    return;
  }
  // Proceed with upload
};
```

---

## Debugging Tips

### Enable Firestore Logs
```typescript
import { enableLogging } from 'firebase/firestore';

if (process.env.NODE_ENV === 'development') {
  enableLogging(true);
}
```

### Log Auth State
```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user);
});
```

### Check Firestore Rules
Use Firebase Console → Firestore → Rules tab
Look for syntax errors or permission issues

---

## Testing Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { userDB } from '@/lib/database';

describe('User Database', () => {
  it('creates a user profile', async () => {
    const uid = 'test-uid-' + Date.now();
    await userDB.createProfile(
      uid,
      'test@example.com',
      'Test User',
      'editor'
    );
    
    const profile = await userDB.getProfile(uid);
    expect(profile).toBeDefined();
    expect(profile?.email).toBe('test@example.com');
  });
});
```

---

## IDE Setup for Better Autocomplete

### VSCode Settings (settings.json)
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### Generate Type Definitions
```bash
tsc --declaration --emitDeclarationOnly
```

---

## API Response Patterns

### Successful Operation
```typescript
const result = await projectDB.createProject(...);
// Returns: project ID (string)
```

### Error Handling
```typescript
try {
  await projectDB.createProject(...);
} catch (error) {
  const message = error.message;
  const code = error.code;
}
```

### Real-time Updates
```typescript
projectDB.subscribeToUserProjects(userId, (projects) => {
  // Called on every update
  // projects is always a fresh array
});
```

---

**Happy coding! 🚀**
