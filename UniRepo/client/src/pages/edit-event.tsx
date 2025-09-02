import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CloudUpload, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EventFormData {
  title: string;
  description: string;
  type: string;
  mode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  imageUrl: string;
  videoUrl: string;
  registrationLink: string;
  collegeId: number;
}

export default function EditEvent() {
  const [, setLocation] = useLocation();
  const eventId = window.location.pathname.split('/').pop();
  
  const [formData, setFormData] = useState<EventFormData>({
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
    imageUrl: "",
    videoUrl: "",
    registrationLink: "",
    collegeId: 0
  });

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('currentCollege') || '{}');

  // Fetch event data
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['/api/events', eventId],
    enabled: !!eventId,
    queryFn: () => apiRequest("GET", `/api/events/${eventId}`).then(res => res.json())
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<EventFormData>) =>
      apiRequest("PUT", `/api/events/${eventId}`, data),
    onSuccess: () => {
      toast({
        title: "Event updated successfully!",
        description: "Your event has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/colleges", currentUser.id, "events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ['/api/events', eventId] });
      setLocation("/college/dashboard");
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    },
  });

  // Load event data into form
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "",
        mode: event.mode || "",
        startDate: event.startDate ? event.startDate.split('T')[0] : "",
        endDate: event.endDate ? event.endDate.split('T')[0] : "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        venue: event.venue || "",
        address: event.address || "",
        imageUrl: event.imageUrl || "",
        videoUrl: event.videoUrl || "",
        registrationLink: event.registrationLink || "",
        collegeId: event.collegeId || currentUser.id
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.type || !formData.mode || 
        !formData.startDate || !formData.venue || !formData.registrationLink) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      collegeId: currentUser.id
    };

    updateMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Button onClick={() => setLocation("/college/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const eventTypes = ["workshop", "conference", "symposium", "cultural", "seminar", "competition", "hackathon", "sports", "social", "career"];
  const modes = ["online", "offline", "hybrid"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/college/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-600">Update your event details</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
              <CardTitle className="text-2xl text-gray-900">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., AI Workshop 2024"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Label htmlFor="description">Event Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event, including objectives, target audience, and what participants will learn..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="mode">Event Mode *</Label>
                      <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {modes.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Date & Time */}
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
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
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
                
                {/* Submit Button */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 h-12 text-lg"
                  >
                    {updateMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        Update Event
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/college/dashboard")}
                    className="px-8"
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