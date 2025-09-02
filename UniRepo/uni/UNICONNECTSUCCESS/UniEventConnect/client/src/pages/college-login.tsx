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

export default function CollegeLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: "",
    password: "",
    remember: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { code: string; password: string }) => {
      const response = await apiRequest("POST", "/api/colleges/login", data);
      return response.json();
    },
    onSuccess: (college) => {
      localStorage.setItem("currentCollege", JSON.stringify(college));
      setLocation("/college/dashboard");
      toast({
        title: "Login successful",
        description: `Welcome back, ${college.name}!`
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid university code or password",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    loginMutation.mutate({ code: formData.code, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")} 
            className="text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">College Portal</h2>
          <p className="text-gray-600">Manage and promote your campus events</p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="code">University Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your university code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) => setFormData({ ...formData, remember: !!checked })}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button variant="link" className="text-sm text-primary hover:text-primary/80">
                  Forgot password?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <Button 
                  variant="link" 
                  onClick={() => setLocation("/college/signup")}
                  className="text-accent hover:text-accent/80 p-0"
                >
                  Sign up
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
