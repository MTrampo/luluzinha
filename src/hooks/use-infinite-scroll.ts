'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { PaginatedResponse } from "@/commons/models/pagination";

type UseInfiniteScrollOptions<T> = {
  initialData?: PaginatedResponse<T> | null;
  fetcher: (nextPage: number) => Promise<PaginatedResponse<T> | null>;
  disabled?: boolean;
};

export function useInfiniteScroll<T>({
  initialData,
  fetcher,
  disabled = false,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData?.items || []);
  const [page, setPage] = useState<number>(initialData?.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(initialData?.hasMore ?? false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const isFetchingRef = useRef<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Sincroniza se os dados iniciais do SSR mudarem (ex: usuário realizou uma nova busca)
  useEffect(() => {
    if (initialData) {
      setItems(initialData.items || []);
      setPage(initialData.page || 1);
      setHasMore(initialData.hasMore ?? false);
      setHasError(false);
    }
  }, [initialData]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || disabled || isLoadingMore) {
      return;
    }

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    setHasError(false);

    try {
      const nextPage = page + 1;
      const response = await fetcher(nextPage);

      if (response && response.items) {
        setItems((prev) => [...prev, ...response.items]);
        setPage(response.page);
        setHasMore(response.hasMore);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [disabled, fetcher, hasMore, isLoadingMore, page]);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore || disabled || hasError) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetchingRef.current && hasMore) {
            loadMore();
          }
        },
        {
          rootMargin: "200px",
          threshold: 0.1,
        }
      );

      observerRef.current.observe(node);
    },
    [disabled, hasError, hasMore, loadMore]
  );

  return {
    items,
    setItems,
    isLoadingMore,
    hasMore,
    hasError,
    loadMore,
    sentinelRef,
  };
}
