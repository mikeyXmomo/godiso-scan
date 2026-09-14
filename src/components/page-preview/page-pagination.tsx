import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

type PageItem = number | "ellipsis";

export interface PagePaginationProps {
  numPages: number;
  onPageChange: (page: number) => void;
  page: number;
}

interface PageNumberButtonProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  page: number;
}

function PageNumberButton({
  currentPage,
  onPageChange,
  page,
}: PageNumberButtonProps): React.ReactElement {
  const isActive = page === currentPage;
  const handleClick = useCallback(() => {
    if (!isActive) {
      onPageChange(page);
    }
  }, [isActive, onPageChange, page]);

  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      aria-label={`Buka halaman ${page}`}
      onClick={handleClick}
      size="icon"
      type="button"
      variant={isActive ? "outline" : "ghost"}
    >
      {page}
    </Button>
  );
}

function getPageItems(page: number, numPages: number): PageItem[] {
  if (numPages <= 1) {
    return [1];
  }

  const windowSize = 5;
  const start = Math.max(1, Math.min(page - 2, numPages - windowSize + 1));
  const end = Math.min(numPages, start + windowSize - 1);
  const items: PageItem[] = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) {
      items.push("ellipsis");
    }
  }

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    items.push(currentPage);
  }

  if (end < numPages) {
    if (end < numPages - 1) {
      items.push("ellipsis");
    }
    items.push(numPages);
  }

  return items;
}

export function PagePagination({
  numPages,
  onPageChange,
  page,
}: PagePaginationProps): React.ReactElement {
  const pageItems = getPageItems(page, numPages);
  const canGoPrevious = page > 1;
  const canGoNext = page < numPages;

  const changePage = (nextPage: number): void => {
    if (nextPage < 1 || nextPage > numPages || nextPage === page) {
      return;
    }
    onPageChange(nextPage);
  };

  const handlePrevious = (): void => {
    changePage(page - 1);
  };
  const handleNext = (): void => {
    changePage(page + 1);
  };

  return (
    <Pagination aria-label="Navigasi halaman PDF">
      <PaginationContent>
        <PaginationItem>
          <Button
            aria-label="Halaman sebelumnya"
            disabled={!canGoPrevious}
            onClick={handlePrevious}
            size="default"
            type="button"
            variant="outline"
          >
            <ChevronLeftIcon aria-hidden="true" />
            <span className="max-sm:hidden">Sebelumnya</span>
          </Button>
        </PaginationItem>

        {pageItems.map((item, index) => (
          <PaginationItem
            key={item === "ellipsis" ? `ellipsis-${index}` : `page-${item}`}
          >
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PageNumberButton
                currentPage={page}
                onPageChange={changePage}
                page={item}
              />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            aria-label="Halaman berikutnya"
            disabled={!canGoNext}
            onClick={handleNext}
            size="default"
            type="button"
            variant="outline"
          >
            <span className="max-sm:hidden">Berikutnya</span>
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
