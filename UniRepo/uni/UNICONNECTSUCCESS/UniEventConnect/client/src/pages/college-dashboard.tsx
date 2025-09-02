import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Edit, Trash2, Calendar, Play, Users, LogOut } from "lucide-react";
import Navigation from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event, College } from "@shared/schema";

export default function CollegeDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [college, setCollege] = useState<College | null>(null);

  useEffect(() => {
    const storedCollege = localStorage.getItem("currentCollege");
    if (!storedCollege) {
      setLocation("/college/login");
      return;
    }
    setCollege(JSON.parse(storedCollege));
  }, [setLocation]);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/colleges", college?.id, "events"],
    enabled: !!college,
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("DELETE", `/api/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/colleges", college?.id, "events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("currentCollege");
    setLocation("/");
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: "bg-green-100 text-green-800",
      conference: "bg-blue-100 text-blue-800",
      symposium: "bg-purple-100 text-purple-800",
      cultural: "bg-pink-100 text-pink-800",
      seminar: "bg-indigo-100 text-indigo-800",
      competition: "bg-orange-100 text-orange-800",
      hackathon: "bg-red-100 text-red-800",
      sports: "bg-yellow-100 text-yellow-800",
      social: "bg-teal-100 text-teal-800",
      career: "bg-cyan-100 text-cyan-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      online: "bg-green-100 text-green-800",
      offline: "bg-yellow-100 text-yellow-800",
      hybrid: "bg-blue-100 text-blue-800",
    };
    return colors[mode] || "bg-gray-100 text-gray-800";
  };

  if (!college) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        title="UniConnect"
        subtitle="College Portal"
        user={college.name}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h2>
            <p className="text-gray-600">Create, manage, and promote your campus events</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button 
              onClick={() => setLocation("/college/events")} 
              variant="outline"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Browse All Events
            </Button>
            <Button 
              onClick={() => setLocation("/college/create-event")} 
              className="bg-accent hover:bg-accent/90"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{events.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Events</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {events.filter(event => new Date(event.startDate) >= new Date()).length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Play className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Event Types</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(events.map(event => event.type)).size}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Users className="text-orange-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Events Table */}
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Events</h3>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-4">Create your first event to get started.</p>
                <Button onClick={() => setLocation("/college/create-event")} className="bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEventTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-900">
                          {new Date(event.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getModeColor(event.mode)}>
                            {event.mode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80"
                              onClick={() => setLocation(`/college/edit-event/${event.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteEvent(event.id)}
                              disabled={deleteEventMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
