import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Search, Filter, ArrowLeft, LogOut } from "lucide-react";
import Navigation from "@/components/navigation";
import EventCard from "@/components/event-card";
import FilterModal from "@/components/ui/filter-modal";
import type { Event, College } from "@shared/schema";

export default function CollegeEvents() {
  const [, setLocation] = useLocation();
  const [college, setCollege] = useState<College | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<{
    type?: string[];
    mode?: string[];
    location?: string;
    date?: string;
  }>({});

  useEffect(() => {
    const storedCollege = localStorage.getItem("currentCollege");
    if (!storedCollege) {
      setLocation("/college/login");
      return;
    }
    setCollege(JSON.parse(storedCollege));
  }, [setLocation]);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: !!college,
  });

  const handleLogout = () => {
    localStorage.removeItem("currentCollege");
    setLocation("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query key change
  };

  if (!college) return null;

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.venue.toLowerCase().includes(searchLower) ||
        event.type.toLowerCase().includes(searchLower) ||
        (event.address && event.address.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(event.type)) return false;
    }

    // Mode filter
    if (filters.mode && filters.mode.length > 0) {
      if (!filters.mode.includes(event.mode)) return false;
    }

    // Location filter
    if (filters.location && filters.location.trim()) {
      const locationLower = filters.location.toLowerCase().trim();
      const matchesLocation = 
        event.venue.toLowerCase().includes(locationLower) ||
        (event.address && event.address.toLowerCase().includes(locationLower));
      if (!matchesLocation) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        title="All Events"
        onBackClick={() => setLocation("/college/dashboard")}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Campus Events</h2>
          <p className="text-gray-600 mb-6">Browse events from all colleges and universities</p>
          
          {/* Search and Filter Bar */}
          <Card className="mb-6 shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search events, colleges, or venues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-primary rounded-xl"
                    />
                  </form>
                </div>
                
                {/* Quick Filters */}
                <div className="flex gap-3 items-center flex-wrap">
                  <Button 
                    type="button"
                    onClick={() => setFilters({ type: ["workshop"] })}
                    variant={filters.type?.includes("workshop") ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    Workshop
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setFilters({ type: ["conference"] })}
                    variant={filters.type?.includes("conference") ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    Conference
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setFilters({ mode: ["online"] })}
                    variant={filters.mode?.includes("online") ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    Online
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setShowFilterModal(true)}
                    variant="outline"
                    className="h-10 px-4 border-2 border-gray-200 hover:border-primary rounded-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.location && (
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Location: {filters.location}
                  <button onClick={() => setFilters({ ...filters, location: undefined })}>
                    ×
                  </button>
                </span>
              )}
              {filters.date && (
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Date: {filters.date}
                  <button onClick={() => setFilters({ ...filters, date: undefined })}>
                    ×
                  </button>
                </span>
              )}
              {filters.type && filters.type.length > 0 && (
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Types: {filters.type.join(', ')}
                  <button onClick={() => setFilters({ ...filters, type: undefined })}>
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Events Grid */}
        {isLoading ? (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-20 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find events.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        
        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>
        )}
      </div>

      <FilterModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}