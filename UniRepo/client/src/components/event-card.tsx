import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
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

  const handleRegistration = () => {
    window.open(event.registrationLink, '_blank');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {event.imageUrl && (
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getEventTypeColor(event.type)}>
            {event.type}
          </Badge>
          <Badge className={getModeColor(event.mode)}>
            {event.mode}
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary h-4 w-4" />
            <span>
              {new Date(event.startDate).toLocaleDateString()}
              {event.endDate && event.endDate !== event.startDate && 
                ` - ${new Date(event.endDate).toLocaleDateString()}`
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-primary h-4 w-4" />
            <span>
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary h-4 w-4" />
            <span>{event.venue}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleRegistration}
          className="w-full"
        >
          Register Now
        </Button>
      </CardContent>
    </Card>
  );
}
