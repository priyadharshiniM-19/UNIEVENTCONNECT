import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CollegeSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; code: string; email: string; location: string; password: string }) => {
      const response = await apiRequest("POST", "/api/colleges/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials"
      });
      setLocation("/college/login");
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.code || !formData.email || !formData.location || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms of service",
        variant: "destructive"
      });
      return;
    }

    const { confirmPassword, agreeTerms, ...submitData } = formData;
    signupMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/college/login")} 
            className="text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Register College</h2>
          <p className="text-gray-600">Connect with students and promote your events</p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">University Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Stanford University"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="code">University Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="STAN2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Official Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Stanford, CA, USA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: !!checked })}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I confirm that I am an authorized representative of this institution and agree to the{" "}
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                    Terms of Service
                  </Button>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90" 
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
