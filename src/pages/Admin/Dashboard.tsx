import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Users,
  Briefcase,
  BookOpen,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'motion/react';
import ProfileTab from './admin-tabs/ProfileTab';
import ProjectsTab from './admin-tabs/ProjectsTab';
import StudentsTab from './admin-tabs/StudentsTab';

export default function AdminDashboard() {
  const { user, userProfile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-deep-slate">
      {/* Background grid */}
      <div className="grid-bg absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed md:relative md:translate-x-0 h-screen w-64 bg-white/5 border-r border-white/10 backdrop-blur-sm"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-black uppercase tracking-tighter">CMS</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Admin Portal</p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              {userProfile.profilePicUrl ? (
                <img
                  src={userProfile.profilePicUrl}
                  alt={userProfile.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold uppercase text-white/60">
                    {userProfile.fullName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{userProfile.fullName}</p>
                <p className="text-xs text-white/40 truncate">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                {userProfile.role}
              </span>
              {isAdmin && (
                <span className="text-[10px] font-bold bg-accent/20 text-accent px-2 py-1 rounded uppercase">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'profile'
                  ? 'bg-accent/20 text-accent'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'projects'
                  ? 'bg-accent/20 text-accent'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'students'
                  ? 'bg-accent/20 text-accent'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Students</span>
            </button>
          </nav>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full mb-2 rounded border-white/20 text-white/60 hover:text-white uppercase text-xs font-bold tracking-wider h-10"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded uppercase text-xs font-bold tracking-wider h-10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden sticky top-0 z-20 bg-deep-slate/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black uppercase tracking-tighter">Dashboard</h1>
            <div className="w-6" />
          </div>

          {/* Header */}
          <div className="border-b border-white/10 px-4 md:px-10 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="editorial-label text-accent mb-2">Management</div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                  {activeTab === 'profile' && 'Your Profile'}
                  {activeTab === 'projects' && 'Portfolio Projects'}
                  {activeTab === 'students' && 'Student Records'}
                </h2>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="container mx-auto px-4 md:px-10 py-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && <ProfileTab userProfile={userProfile} />}

            {/* Projects Tab */}
            {activeTab === 'projects' && <ProjectsTab userId={user?.uid || ''} />}

            {/* Students Tab */}
            {activeTab === 'students' && <StudentsTab userId={user?.uid || ''} isAdmin={isAdmin} />}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-5"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
