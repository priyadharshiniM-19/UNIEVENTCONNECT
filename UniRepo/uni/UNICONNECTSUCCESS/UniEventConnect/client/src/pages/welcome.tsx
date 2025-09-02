import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { GraduationCap, University, Calendar, Search, Link } from "lucide-react";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden hero-pattern">
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
            Uni<span className="text-accent">Connect</span>
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto leading-relaxed">
            Bridge the gap between universities and students
          </p>
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
            Never miss an event, opportunity, or moment that matters in your academic journey
          </p>
        </div>
        
        {/* Login Options */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center max-w-lg mx-auto mb-20">
          <Button 
            onClick={() => setLocation("/student/login")} 
            className="w-full md:w-auto bg-white text-primary hover:bg-gray-100 px-10 py-5 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            size="lg"
          >
            <GraduationCap className="mr-3 h-6 w-6" />
            Student Portal
          </Button>
          <Button 
            onClick={() => setLocation("/college/login")} 
            className="w-full md:w-auto bg-accent text-white hover:bg-accent/90 px-10 py-5 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            size="lg"
          >
            <University className="mr-3 h-6 w-6" />
            College Portal
          </Button>
        </div>
        
        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Event Discovery</h3>
              <p className="text-blue-100 leading-relaxed">Find workshops, conferences, symposiums, and cultural events happening across universities</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Filtering</h3>
              <p className="text-blue-100 leading-relaxed">Advanced search and filter options by date, location, event type, and mode</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Link className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Registration</h3>
              <p className="text-blue-100 leading-relaxed">Seamless one-click registration process for all events that interest you</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
