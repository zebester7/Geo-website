import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X, Loader, GraduationCap } from 'lucide-react';
import { studentDB, Student } from '@/lib/database';

interface StudentsTabProps {
  userId: string;
  isAdmin: boolean;
}

interface StudentFormData {
  name: string;
  rollNumber: string;
  batch: string;
  department: string;
  status: 'active' | 'inactive' | 'graduated';
}

const defaultStudentForm: StudentFormData = {
  name: '',
  rollNumber: '',
  batch: '',
  department: '',
  status: 'active',
};

export default function StudentsTab({ userId, isAdmin }: StudentsTabProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<StudentFormData>(defaultStudentForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Subscribe to students
  useEffect(() => {
    const unsubscribe = isAdmin
      ? studentDB.subscribeToAllStudents(setStudents)
      : studentDB.subscribeToUserStudents(userId, setStudents);
    return () => unsubscribe();
  }, [userId, isAdmin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(defaultStudentForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditStudent = (student: Student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      batch: student.batch,
      department: student.department,
      status: student.status,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleSaveStudent = async () => {
    if (!formData.name.trim() || !formData.rollNumber.trim() || !formData.department.trim()) {
      setError('Name, roll number, and department are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // Update existing student
        await studentDB.updateStudent(editingId, {
          name: formData.name,
          rollNumber: formData.rollNumber,
          batch: formData.batch,
          department: formData.department,
          status: formData.status,
        });
        setSuccess('Student updated successfully!');
      } else {
        // Create new student
        await studentDB.createStudent(
          formData.name,
          formData.rollNumber,
          formData.batch,
          formData.department,
          userId,
          formData.status
        );
        setSuccess('Student created successfully!');
      }

      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;

    setLoading(true);
    try {
      await studentDB.deleteStudent(studentId);
      setSuccess('Student deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = filter === 'all' 
    ? students 
    : students.filter(s => s.status === filter);

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
              {editingId ? 'Edit Student' : 'Add New Student'}
            </CardTitle>
            <button onClick={resetForm} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Student full name"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Roll Number
              </label>
              <Input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
                placeholder="Student roll number"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Batch
              </label>
              <Input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
                placeholder="e.g., 2024-2028"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                Department
              </label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 text-white"
                placeholder="e.g., Computer Science"
              />
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
                <option value="active" className="bg-deep-slate">Active</option>
                <option value="inactive" className="bg-deep-slate">Inactive</option>
                <option value="graduated" className="bg-deep-slate">Graduated</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSaveStudent}
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
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Save Student
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

      {/* Students List */}
      {students.length === 0 && !showForm ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <p className="text-white/60 text-sm mb-4">No students yet. Add your first student!</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Student
              </Button>
            )}

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'active', 'inactive', 'graduated'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                    filter === status
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Total', value: students.length },
              { label: 'Active', value: students.filter(s => s.status === 'active').length },
              { label: 'Inactive', value: students.filter(s => s.status === 'inactive').length },
              { label: 'Graduated', value: students.filter(s => s.status === 'graduated').length },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/5 border-white/10">
                <CardContent className="py-4 text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Students Table */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-white/60">Name</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-white/60">Roll No.</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-white/60 hidden md:table-cell">Department</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-white/60 hidden md:table-cell">Batch</th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-white/60">Status</th>
                    <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 text-sm font-medium">{student.name}</td>
                      <td className="p-4 text-sm text-white/80">{student.rollNumber}</td>
                      <td className="p-4 text-sm text-white/80 hidden md:table-cell">{student.department}</td>
                      <td className="p-4 text-sm text-white/80 hidden md:table-cell">{student.batch}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                            student.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : student.status === 'inactive'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-2 text-white/60 hover:text-white transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-white/60 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}