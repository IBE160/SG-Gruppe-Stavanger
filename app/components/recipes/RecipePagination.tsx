'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RecipePaginationProps {
  currentPage: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export function RecipePagination({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
}: RecipePaginationProps) {
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Calculate page range to display
  const getPageRange = () => {
    const range: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className={cn(
          'border-sage-green/30 text-charcoal',
          hasPrevious && 'hover:bg-sage-green/10 hover:border-sage-green',
          !hasPrevious && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {/* First page if not in range */}
        {pageRange[0] > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="border-sage-green/30 text-charcoal hover:bg-sage-green/10 hover:border-sage-green min-w-[2.5rem]"
              aria-label="Go to page 1"
            >
              1
            </Button>
            {pageRange[0] > 2 && (
              <span className="px-2 text-charcoal/50">...</span>
            )}
          </>
        )}

        {/* Page range */}
        {pageRange.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[2.5rem]',
              page === currentPage
                ? 'bg-sage-green hover:bg-sage-green/90 text-white'
                : 'border-sage-green/30 text-charcoal hover:bg-sage-green/10 hover:border-sage-green'
            )}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}

        {/* Last page if not in range */}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span className="px-2 text-charcoal/50">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="border-sage-green/30 text-charcoal hover:bg-sage-green/10 hover:border-sage-green min-w-[2.5rem]"
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={cn(
          'border-sage-green/30 text-charcoal',
          hasNext && 'hover:bg-sage-green/10 hover:border-sage-green',
          !hasNext && 'opacity-50 cursor-not-allowed'
        )}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
      </Button>

      {/* Results info */}
      <div className="ml-4 text-sm text-charcoal/70 hidden sm:block">
        Page {currentPage} of {totalPages} ({totalResults} total)
      </div>
    </div>
  );
}
