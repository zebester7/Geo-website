import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, X, Loader } from 'lucide-react';
import { studentDB, Student } from '@/lib/database';

interface StudentsTabProps {
  userId: string;
  isAdmin: boolean;
}

interface FormData {
  name: string;
  rollNumber: string;
  batch: string;
  department: string;
  status: 'active' | 'inactive' | 'graduated';
}

const defaultForm: FormData = {
  name: '',
  rollNumber: '',
  batch: '',
  department: '',
  status: 'active',
};

export default function StudentsTab({ userId, isAdmin }: StudentsTabProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'graduated'>('all');

  // Subscribe to user's students (or all if admin)
  useEffect(() => {
    if (isAdmin) {
      studentDB.getAllStudents().then(setStudents).catch(console.error);
    } else {
      const unsubscribe = studentDB.subscribeToUserStudents(userId, setStudents);
      return () => unsubscribe();
    }
  }, [userId, isAdmin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
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
    if (!formData.name.trim() || !formData.rollNumber.trim()) {
      setError('Name and roll number are required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // Update existing student
        await studentDB.updateStudent(editingId, formData);
        setSuccess('Student record updated successfully!');
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
        setSuccess('Student record created successfully!');
      }

      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save student record');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;

    setLoading(true);
    try {
      await studentDB.deleteStudent(studentId);
      setSuccess('Student record deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student record');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    if (filterStatus === 'all') return true;
    return student.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'graduated':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-white/10 text-white/60';
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
              {editingId ? 'Edit Student' : 'Add New Student'}
            </CardTitle>
            <button onClick={resetForm} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Student name"
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Roll Number *
                </label>
                <Input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., 2024-001"
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
                  placeholder="e.g., Geology"
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
                    <Plus className="w-4 h-4 mr-2" />
                    Save Record
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

      {/* Filter and Action Bar */}
      {!showForm && students.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            {['all', 'active', 'inactive', 'graduated'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 text-xs font-bold uppercase rounded transition-colors ${
                  filterStatus === status
                    ? 'bg-accent text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      )}

      {/* Students Table */}
      {students.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-12 text-center">
            <p className="text-white/60 text-sm mb-4">No student records yet. Add your first student!</p>
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-accent text-white hover:bg-accent/90 rounded text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 border-white/10 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4">
                  Roll Number
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4">
                  Batch
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4">
                  Department
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-white/60 py-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="py-4 font-bold text-white">{student.name}</TableCell>
                  <TableCell className="py-4 text-white/80">{student.rollNumber}</TableCell>
                  <TableCell className="py-4 text-white/80">{student.batch}</TableCell>
                  <TableCell className="py-4 text-white/80">{student.department}</TableCell>
                  <TableCell className="py-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: students.length, color: 'text-white' },
            { label: 'Active', count: students.filter((s) => s.status === 'active').length, color: 'text-green-400' },
            { label: 'Inactive', count: students.filter((s) => s.status === 'inactive').length, color: 'text-yellow-400' },
            { label: 'Graduated', count: students.filter((s) => s.status === 'graduated').length, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white/5 border border-white/10 rounded text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.count}</div>
              <p className="text-xs uppercase tracking-widest text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
