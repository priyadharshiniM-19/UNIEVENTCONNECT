import { Button } from "@/components/ui/button";
import { ArrowLeft, User, LogOut } from "lucide-react";

interface NavigationProps {
  title: string;
  subtitle?: string;
  user?: string;
  onBackClick?: () => void;
  onProfileClick?: () => void;
  onLogout: () => void;
}

export default function Navigation({ 
  title, 
  subtitle, 
  user, 
  onBackClick, 
  onProfileClick, 
  onLogout 
}: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {onBackClick && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBackClick}
                className="text-primary hover:text-primary/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary">{title}</h1>
              {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && onProfileClick && (
              <Button 
                variant="ghost" 
                onClick={onProfileClick}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <User className="h-5 w-5" />
                <span>{user}</span>
              </Button>
            )}
            {user && !onProfileClick && (
              <span className="text-gray-600">{user}</span>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
