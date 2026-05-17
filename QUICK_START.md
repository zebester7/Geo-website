# 🚀 QUICK START GUIDE - Get Running in 5 Minutes

## Step 1: Deploy Firestore Rules (2 min)

### Option A: Firebase CLI
```bash
firebase login
firebase deploy --only firestore:rules
```

### Option B: Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to Firestore Database → Rules tab
3. Copy the entire contents of `firestore.rules` file
4. Click **Publish**

---

## Step 2: Create Your Admin Account (1 min)

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/admin/login`
3. Click "Sign Up" (or use Google)
4. Fill in your details (you'll be "editor" role initially)

### Promote Yourself to Admin

1. Open [Firebase Console](https://console.firebase.google.com)
2. Firestore Database → Collections → **users**
3. Click on your user document (ID = your Firebase UID)
4. Click **Edit** on the `role` field
5. Change value from `"editor"` to `"admin"`
6. Click **Update**
7. Refresh your browser

---

## Step 3: Deploy Firebase Storage Rules (1 min)

1. [Firebase Console](https://console.firebase.google.com)
2. Storage → Rules tab
3. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
    match /projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. Click **Publish**

---

## Step 4: Start Using! (1 min)

✅ Navigate to http://localhost:3000/admin
✅ Complete your profile (upload photo, CV)
✅ Create your first project
✅ Add student records

---

## ✨ What You Can Do Now

### Profile Tab
- Edit name and bio
- Upload profile picture (JPG, PNG, WebP)
- Upload CV (PDF)

### Projects Tab
- Create new projects with images
- Edit or delete your projects
- Add team members
- Set status (draft/published)

### Students Tab
- Add student records
- Track by status (active/inactive/graduated)
- Edit or delete records
- View statistics

---

## 🔑 Important URLs

| Path | Purpose |
|------|---------|
| `/admin/login` | Login/Signup page |
| `/admin` | Main dashboard (protected) |
| `/admin?tab=profile` | Profile management |
| `/admin?tab=projects` | Project management |
| `/admin?tab=students` | Student management |

---

## 🚨 Troubleshooting

**Q: "Permission denied" when uploading files?**
→ Make sure Storage Rules are deployed (Step 3)

**Q: Can't see projects/students?**
→ Reload the page with Ctrl+Shift+R (hard refresh)

**Q: Logout button doesn't work?**
→ Check browser console for errors
→ Make sure you're on /admin path

**Q: Can't access /admin?**
→ You must be logged in
→ Go to `/admin/login` first

---

## 📱 Responsive Design

All components work on:
- ✅ Desktop (full sidebar)
- ✅ Tablet (collapsible sidebar)
- ✅ Mobile (hamburger menu)

---

## 🎯 Admin vs Editor Difference

### Editor Can:
- View/edit own profile
- Manage own projects
- Manage own students

### Admin Can:
- ✨ All of the above PLUS
- ✨ View any project
- ✨ View any student record
- ✨ Manage any user data
- ✨ Delete any records

---

## 🔐 Security Notes

✅ All data is encrypted in transit (HTTPS)
✅ Firestore rules prevent data theft
✅ Files are user-scoped in cloud storage
✅ Passwords are hashed by Firebase Auth

---

## 📞 Need Help?

1. Check the full guide: `ADMIN_CMS_GUIDE.md`
2. Check browser console (F12) for errors
3. Review Firestore rules syntax
4. Check that collections exist in Firestore

---

**You're all set! 🎉 Your Admin Panel is live!**

Next steps:
- Invite colleagues to sign up
- Have them complete their profiles
- Start managing projects and students
