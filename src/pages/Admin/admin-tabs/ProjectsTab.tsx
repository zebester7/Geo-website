import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X, Loader, Upload } from 'lucide-react';
import { projectDB, Project } from '@/lib/database';
import { uploadProjectImage, deleteStorageFile } from '@/lib/fileUpload';

interface ProjectsTabProps {
  userId: string;
}

interface FormData {
  title: string;
  description: string;
  teamMembers: string[];
  status: 'draft' | 'published';
}

const defaultForm: FormData = {
  title: '',
  description: '',
  teamMembers: [],
  status: 'draft',
};

export default function ProjectsTab({ userId }: ProjectsTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Subscribe to user's projects
  useEffect(() => {
    const unsubscribe = projectDB.subscribeToUserProjects(userId, setProjects);
    return () => unsubscribe();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTeamMember = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !formData.teamMembers.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          teamMembers: [...prev.teamMembers, value],
        }));
        (e.target as HTMLInputElement).value = '';
      }
      e.preventDefault();
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m !== member),
    }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setProjectImage(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditProject = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      teamMembers: project.teamMembers,
      status: project.status,
    });
    setImagePreview(project.imageUrl);
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSaveProject = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = imagePreview || '';

      // Upload new image if provided
      if (projectImage) {
        // For new projects or updating image
        if (editingId) {
          const editingProject = projects.find((p) => p.id === editingId);
          if (editingProject?.imageUrl) {
            await deleteStorageFile(editingProject.imageUrl);
          }
        }

        // Create a temporary project ID for new projects
        const projectId = editingId || 'temp-' + Date.now();
        const result = await uploadProjectImage(projectId, projectImage);
        imageUrl = result.url;
      }

      if (editingId) {
        // Update existing project
        await projectDB.updateProject(editingId, {
          title: formData.title,
          description: formData.description,
          imageUrl,
          teamMembers: formData.teamMembers,
          status: formData.status,
        });
        setSuccess('Project updated successfully!');
      } else {
        // Create new project
        const projectId = await projectDB.createProject(
          formData.title,
          formData.description,
          userId,
          imageUrl,
          formData.teamMembers,
          formData.status
        );
        setSuccess('Project created successfully!');
      }

      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const project = projects.find((p) => p.id === projectId);
      if (project?.imageUrl) {
        await deleteStorageFile(project.imageUrl);
      }
      await projectDB.deleteProject(projectId);
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
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

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </CardTitle>
            <button onClick={resetForm} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Project Image */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Project Image
              </label>
              <div className="flex gap-4">
                {imagePreview && (
                  <div className="w-24 h-24 rounded border border-white/10 overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
                  />
                  <p className="text-xs text-white/40 mt-2">JPEG, PNG, WebP (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Title
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Project title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                placeholder="Project description"
              />
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Team Members (Press Enter to add)
              </label>
              <Input
                type="text"
                onKeyDown={handleAddTeamMember}
                className="bg-white/5 border-white/10 text-white mb-2"
                placeholder="Add team member"
              />
              <div className="flex flex-wrap gap-2">
                {formData.teamMembers.map((member) => (
                  <span
                    key={member}
                    className="px-3 py-1 bg-accent/20 text-accent rounded text-xs font-bold flex items-center gap-2"
                  >
                    {member}
                    <button
                      onClick={() => handleRemoveTeamMember(member)}
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
              >
                <option value="draft" className="bg-deep-slate">Draft</option>
                <option value="published" className="bg-deep-slate">Published</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSaveProject}
                disabled={loading}
                className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Save Project
                  </>
                )}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-white/20 text-white/60 rounded text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {projects.length === 0 && !showForm ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <p className="text-white/60 text-sm mb-4">No projects yet. Create your first one!</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white/5 border-white/10 overflow-hidden">
                {project.imageUrl && (
                  <div className="h-40 bg-white/5 overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-2">{project.description}</p>
                  </div>

                  {project.teamMembers.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-white/40 mb-1">Team:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.teamMembers.map((member) => (
                          <span
                            key={member}
                            className="px-2 py-1 bg-white/10 text-white/80 rounded text-xs"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                        project.status === 'published'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {project.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 text-white/60 hover:text-white transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-white/60 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
