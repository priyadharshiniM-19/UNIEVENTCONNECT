import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Calendar } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    type?: string[];
    mode?: string[];
    location?: string;
    date?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterModal({ open, onOpenChange, filters, onFiltersChange }: FilterModalProps) {
  const eventTypes = ["workshop", "conference", "symposium", "cultural", "seminar", "competition", "hackathon", "sports", "social", "career"];
  const modes = ["online", "offline", "hybrid"];
  const dateOptions = [
    { value: "any", label: "Any Date" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "custom", label: "Custom Date" }
  ];

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.type || [];
    if (checked) {
      onFiltersChange({ ...filters, type: [...currentTypes, type] });
    } else {
      onFiltersChange({ ...filters, type: currentTypes.filter(t => t !== type) });
    }
  };

  const handleModeChange = (mode: string, checked: boolean) => {
    const currentModes = filters.mode || [];
    if (checked) {
      onFiltersChange({ ...filters, mode: [...currentModes, mode] });
    } else {
      onFiltersChange({ ...filters, mode: currentModes.filter(m => m !== mode) });
    }
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const handleApplyFilters = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filter Events
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Event Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.type?.includes(type) || false}
                    onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-gray-600 capitalize text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Date</Label>
            <Select 
              value={filters.date || "any"} 
              onValueChange={(value) => onFiltersChange({ ...filters, date: value === "any" ? undefined : value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {filters.date === "custom" && (
              <div className="mt-3 space-y-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                />
              </div>
            )}
          </div>
          
          {/* Mode */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Mode</Label>
            <div className="space-y-2">
              {modes.map((mode) => (
                <div key={mode} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mode-${mode}`}
                    checked={filters.mode?.includes(mode) || false}
                    onCheckedChange={(checked) => handleModeChange(mode, !!checked)}
                  />
                  <Label htmlFor={`mode-${mode}`} className="text-gray-600 capitalize">
                    {mode}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter city or college name"
              value={filters.location || ""}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
            />
          </div>
        </div>
        
        {/* Modal Actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters} variant="outline">
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
