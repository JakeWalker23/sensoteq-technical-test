import { useState, useEffect, useRef } from "react";
import { Search, Filter, Loader2, Film as FilmIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FilmCard from "@/components/film/FilmCard";

type UIFilm = {
  id: number;
  title: string;
  description: string | null;
  rental_rate: number;        // FilmCard shows price
  release_year?: number;
  length?: number;
  rating?: string;
  category?: string;
};

const categories = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller"];
const API = import.meta.env.VITE_API_BASE || "http://localhost:3000/";

export default function FilmsSection() {
  const [films, setFilms] = useState<UIFilm[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Action"); // default fetch
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function startRequest() {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    return ac.signal;
  }

  // Map BE → UI for the category endpoint
  function mapCategoryRow(row: { film_id: number; title: string; description: string | null; rental_rate: number }): UIFilm {
    return {
      id: row.film_id,
      title: row.title,
      description: row.description,
      rental_rate: Number(row.rental_rate) ?? 0,
      category: selectedCategory || undefined,
    };
  }

  // Map BE → UI for the search endpoint
  function mapSearchRow(row: {
    film_id: number; title: string; length: number | null; language: string; categories: string[]; rental_rate?: number; description?: string | null;
  }): UIFilm {
    return {
      id: row.film_id,
      title: row.title,
      description: row.description ?? null,
      rental_rate: Number(row.rental_rate ?? 0),
      length: row.length ?? undefined,
      category: row.categories?.[0],
    };
  }

  async function fetchByCategory(category: string) {
    const signal = startRequest();
    try {
      const r = await fetch(`${API}/films?category_name=${encodeURIComponent(category)}&limit=50`, { signal });
      const text = await r.text();
      const json = text ? JSON.parse(text) : [];
      if (!r.ok) throw new Error(json?.error ?? "Request failed");
      setFilms((json as any[]).map(mapCategoryRow));
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchByTitle(title: string) {
    const signal = startRequest();
    try {
      const params = new URLSearchParams({ title, limit: "50", offset: "0" });
      const r = await fetch(`${API}/films/search?${params.toString()}`, { signal });
      const text = await r.text();
      const json = text ? JSON.parse(text) : { count: 0, results: [] };
      if (!r.ok) throw new Error(json?.error ?? "Request failed");
      setFilms((json.results as any[]).map(mapSearchRow));
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => {
    const t = searchTitle.trim();
    if (!t) return;
    setSelectedCategory("");
    void fetchByTitle(t);
  };

  const handleCategoryFilter = (category: string) => {
    if (category === "all") {
      setSelectedCategory("");
      setFilms([]);
      return;
    }
    setSelectedCategory(category);
    setSearchTitle("");
    void fetchByCategory(category);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // initial load
  useEffect(() => {
    if (selectedCategory) void fetchByCategory(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilmIcon className="w-5 h-5 text-primary" />
            Film Management
          </CardTitle>
          <CardDescription>Search films by title or filter by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search films by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading || !searchTitle.trim()} className="min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter("all")}
              className="flex items-center gap-2"
            >
              <Filter className="w-3 h-3" />
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="glass border-red-500/30">
          <CardContent className="text-red-500 py-4">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="glass animate-pulse">
              <CardContent className="p-6">
                <div className="loading-pulse h-6 mb-3" />
                <div className="loading-pulse h-4 mb-2" />
                <div className="loading-pulse h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {films.map((film, index) => (
            <FilmCard
              key={film.id}
              film={film}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {films.length === 0 && !loading && !error && (
        <Card className="glass text-center py-12">
          <CardContent>
            <FilmIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No films found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
