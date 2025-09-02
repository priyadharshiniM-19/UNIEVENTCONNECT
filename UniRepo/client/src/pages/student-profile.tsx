import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import type { Student } from "@shared/schema";

export default function StudentProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    collegeName: "",
    location: ""
  });

  useEffect(() => {
    const storedStudent = localStorage.getItem("currentStudent");
    if (!storedStudent) {
      setLocation("/student/login");
      return;
    }
    const studentData = JSON.parse(storedStudent);
    setStudent(studentData);
    setFormData({
      name: studentData.name,
      email: studentData.email,
      collegeName: studentData.collegeName,
      location: studentData.location
    });
  }, [setLocation]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("PUT", `/api/students/${student!.id}`, data);
      return response.json();
    },
    onSuccess: (updatedStudent) => {
      localStorage.setItem("currentStudent", JSON.stringify(updatedStudent));
      setStudent(updatedStudent);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.collegeName || !formData.location) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentStudent");
    setLocation("/");
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        title="Profile"
        onBackClick={() => setLocation("/student/dashboard")}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="text-primary h-12 w-12" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-gray-600">{student.regNumber}</p>
                  <p className="text-primary">{student.email}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">College:</span>
                  <p className="font-semibold">{student.collegeName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-semibold">{student.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Edit Profile Form */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input
                      id="regNumber"
                      type="text"
                      value={student.regNumber}
                      disabled
                      className="mt-2 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="collegeName">College Name</Label>
                    <Input
                      id="collegeName"
                      type="text"
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation("/student/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
