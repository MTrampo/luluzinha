"use client"

import { useCallback } from "react";
import { SearchInput } from "../../../components/inputs/search";
import { CustomerFormatted } from "@/commons/models/customer";
import { PaginatedResponse } from "@/commons/models/pagination";
import { getCustomersPaginatedAction } from "@/actions/customer";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { CustomerCard } from "./card";
import Header from "@/components/header/dashboard";
import { CustomerFeedbackSearchNotFound } from "./feedback";
import { NewCustomerButton } from "./new-customer-button";
import { CustomerCardSkeleton } from "@/components/skeletons/customer-skeleton";
import { ConnectionErrorRetry } from "@/components/feedback/connection-error";

type CustomersProps = {
  initialData: PaginatedResponse<CustomerFormatted>;
  searchTerm?: string;
}

export default function Customers({ initialData, searchTerm = "" }: CustomersProps) {
  const fetcher = useCallback(
    async (nextPage: number) => {
      const response = await getCustomersPaginatedAction({
        page: nextPage,
        pageSize: 12,
        search: searchTerm,
      });

      if (response.status === 200 && response.data) {
        return response.data;
      }
      return null;
    },
    [searchTerm]
  );

  const {
    items: customers,
    isLoadingMore,
    hasMore,
    hasError,
    loadMore,
    sentinelRef,
  } = useInfiniteScroll<CustomerFormatted>({
    initialData,
    fetcher,
  });

  return (
    <>
      <Header title="Poderosas" />
      <div className="main-content">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-purple-900 leading-tight tracking-tight text-lg sm:text-xl font-bold">
                Suas Poderosas
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium hidden min-[480px]:block">
                Acompanhe e cuide das clientes do seu espaço.
              </p>
            </div>

            <NewCustomerButton />
          </div>

          <div className="w-full">
            <SearchInput placeholder="Buscar Poderosa por nome ou celular..." />
          </div>
        </div>

        {customers.length === 0 ? (
          <CustomerFeedbackSearchNotFound />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}

              {isLoadingMore && <CustomerCardSkeleton count={4} />}
            </div>

            {/* Sentinela invisível de rolagem */}
            {hasMore && !hasError && (
              <div ref={sentinelRef} className="h-6 w-full" />
            )}

            {/* Tratamento de oscilação de rede */}
            {hasError && (
              <div className="mt-2">
                <ConnectionErrorRetry
                  onRetry={loadMore}
                  message="Não foi possível carregar mais Poderosas."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

