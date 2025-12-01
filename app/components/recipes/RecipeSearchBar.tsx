'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

export interface RecipeSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function RecipeSearchBar({
  onSearch,
  placeholder = 'Search for recipes (e.g., "chicken", "pasta")...',
  debounceMs = 500,
}: RecipeSearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Immediately trigger search on form submit
      onSearch(query);
    },
    [query, onSearch]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      role="search"
      aria-label="Recipe search"
    >
      <div className="relative flex items-center gap-2">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none text-sage-green">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Search Input */}
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 border-sage-green/30 focus:border-sage-green focus:ring-sage-green"
          aria-label="Search recipes"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-charcoal/50 hover:text-charcoal transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        {/* Search Button (visible on larger screens) */}
        <Button
          type="submit"
          className="hidden sm:flex bg-sage-green hover:bg-sage-green/90 text-white"
          aria-label="Search"
        >
          <Search className="h-4 w-4 mr-2" aria-hidden="true" />
          Search
        </Button>
      </div>
    </form>
  );
}
