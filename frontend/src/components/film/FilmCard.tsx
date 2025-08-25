import { Clock, Calendar, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Film {
  id: number;
  title: string;
  description: string;
  release_year: number;
  length: number;
  rating: string;
  category: string;
  rental_rate: number;
}

interface FilmCardProps {
  film: Film;
  className?: string;
  style?: React.CSSProperties;
}

const FilmCard = ({ film, className, style }: FilmCardProps) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "G": return "bg-success/20 text-success-foreground";
      case "PG": return "bg-primary/20 text-primary-foreground";
      case "PG-13": return "bg-warning/20 text-warning-foreground";
      case "R": return "bg-destructive/20 text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card 
      className={cn("glass hover-scale cursor-pointer group", className)}
      style={style}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {film.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {film.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={getRatingColor(film.rating)}>
            {film.rating}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {film.release_year}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {film.length}m
            </div>
          </div>
          <div className="flex items-center gap-1 text-primary font-medium">
            <DollarSign className="w-3 h-3" />
            {film.rental_rate}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {film.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilmCard;