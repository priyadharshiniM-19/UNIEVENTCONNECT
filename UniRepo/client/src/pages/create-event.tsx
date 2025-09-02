import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ArrowLeft, CloudUpload, Video, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import type { College } from "@shared/schema";

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [college, setCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    mode: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    address: "",
    registrationLink: "",
    imageUrl: "",
    videoUrl: ""
  });

  useEffect(() => {
    const storedCollege = localStorage.getItem("currentCollege");
    if (!storedCollege) {
      setLocation("/college/login");
      return;
    }
    setCollege(JSON.parse(storedCollege));
  }, [setLocation]);

  const createEventMutation = useMutation({
    mutationFn: async (data: typeof formData & { collegeId: number }) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate multiple queries to refresh all event lists
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/colleges", college?.id, "events"] });
      toast({
        title: "Event created successfully",
        description: "Your event has been created and is now visible to students"
      });
      setLocation("/college/dashboard");
    },
    onError: () => {
      toast({
        title: "Failed to create event",
        description: "Please check all fields and try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.type || !formData.mode || 
        !formData.startDate || !formData.startTime || !formData.venue || !formData.registrationLink) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!college) return;

    createEventMutation.mutate({
      ...formData,
      collegeId: college.id
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentCollege");
    setLocation("/");
  };

  if (!college) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        title="Create Event"
        onBackClick={() => setLocation("/college/dashboard")}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Information</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter event title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your event..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Event Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="symposium">Symposium</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="hackathon">Hackathon</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="mode">Mode *</Label>
                      <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Date and Time */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Date & Time</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Location</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="venue">Venue/Platform *</Label>
                      <Input
                        id="venue"
                        type="text"
                        placeholder="e.g., Main Auditorium or Zoom Link"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Full address (if offline)"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Media Upload */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Media</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="imageUpload">Event Image</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Check file size (10MB limit)
                              if (file.size > 10 * 1024 * 1024) {
                                toast({
                                  title: "File too large",
                                  description: "Please select an image smaller than 10MB",
                                  variant: "destructive"
                                });
                                return;
                              }
                              
                              // Check file type
                              if (!file.type.startsWith('image/')) {
                                toast({
                                  title: "Invalid file type",
                                  description: "Please select an image file",
                                  variant: "destructive"
                                });
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setFormData({ ...formData, imageUrl: e.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="imageUpload" className="cursor-pointer">
                          <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-sm text-gray-600">Click to upload event image</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </label>
                        {formData.imageUrl && (
                          <div className="mt-4">
                            <img src={formData.imageUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                            <Button 
                              type="button"
                              variant="outline" 
                              size="sm"
                              onClick={() => setFormData({ ...formData, imageUrl: "" })}
                              className="mt-2"
                            >
                              Remove Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="videoUrl">Event Video URL (Optional)</Label>
                      <Input
                        id="videoUrl"
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Registration */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Registration</h3>
                  
                  <div>
                    <Label htmlFor="registrationLink">Registration Link *</Label>
                    <Input
                      id="registrationLink"
                      type="url"
                      placeholder="https://example.com/register"
                      value={formData.registrationLink}
                      onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">Provide the link where students can register for the event</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-accent hover:bg-accent/90 flex-1 sm:flex-none"
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/college/dashboard")}
                    className="flex-1 sm:flex-none"
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
