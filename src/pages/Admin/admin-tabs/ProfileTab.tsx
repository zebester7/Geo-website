import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, Loader } from 'lucide-react';
import { UserProfile, userDB } from '@/lib/database';
import {
  uploadProfilePicture,
  uploadCV,
  deleteStorageFile,
  formatFileSize,
} from '@/lib/fileUpload';

interface ProfileTabProps {
  userProfile: UserProfile;
}

export default function ProfileTab({ userProfile }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    bio: userProfile.bio,
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState(userProfile.profilePicUrl);
  const [cvFileName, setCvFileName] = useState(
    userProfile.cvUrl ? 'CV uploaded' : 'No CV uploaded'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload profile picture if changed
      let newProfilePicUrl = userProfile.profilePicUrl;
      if (profilePic) {
        const result = await uploadProfilePicture(userProfile.uid, profilePic);
        newProfilePicUrl = result.url;
      }

      // Upload CV if provided
      let newCvUrl = userProfile.cvUrl;
      if (cvFile) {
        // Delete old CV if it exists
        if (userProfile.cvUrl) {
          await deleteStorageFile(userProfile.cvUrl);
        }
        const result = await uploadCV(userProfile.uid, cvFile);
        newCvUrl = result.url;
      }

      // Update profile in Firestore
      await userDB.updateProfile(userProfile.uid, {
        fullName: formData.fullName,
        bio: formData.bio,
        profilePicUrl: newProfilePicUrl,
        cvUrl: newCvUrl,
      });

      setSuccess('Profile updated successfully!');
      setProfilePic(null);
      setCvFile(null);

      // Reset form after delay
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      {/* Profile Picture */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white/40 text-sm">No image</span>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Choose Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
                />
              </div>
              <p className="text-xs text-white/40">
                Supported: JPEG, PNG, WebP (Max 5MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleTextChange}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleTextChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-accent"
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* CV Upload */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Curriculum Vitae (CV)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-white/60 mb-4">
              Current status: <span className="text-accent font-bold">{cvFileName}</span>
            </p>
            {userProfile.cvUrl && (
              <a
                href={userProfile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-4 px-4 py-2 bg-accent/20 text-accent rounded text-sm font-bold hover:bg-accent/30 transition"
              >
                Download Current CV
              </a>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
              Upload New CV (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleCvChange}
              className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
            />
          </div>
          <p className="text-xs text-white/40">
            Only PDF files supported (Max 5MB)
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={loading || (!profilePic && !cvFile && formData === { fullName: userProfile.fullName, bio: userProfile.bio })}
          className="bg-accent text-white hover:bg-accent/90 rounded uppercase text-xs font-bold tracking-wider h-10 px-6 flex items-center gap-2"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
