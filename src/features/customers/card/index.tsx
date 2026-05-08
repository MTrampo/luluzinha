"use client"

import { FaWhatsapp } from "react-icons/fa"
import { FaCakeCandles } from "react-icons/fa6"
import { LuFileText } from "react-icons/lu"
import { StandardAvatar } from "@/components/avatar"
import { Button } from "@/components/ui/button"
import { CustomerDetailsSheet } from "./details"
import { CustomerFormatted } from "@/commons/models/customer"

interface CustomerCardProps {
  customer: CustomerFormatted;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="group relative flex gap-4 items-center border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-4 rounded-md cursor-pointer transition-all overflow-hidden">
      <CustomerDetailsSheet customer={customer} className="flex-1 min-w-0">
        <div className="flex gap-4 items-center w-full min-w-0">
          <StandardAvatar size="xl" initials={customer.initials} />

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                {customer.nameFormatted}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {customer.isBirthdayToday && (
                  <FaCakeCandles className="text-pink-500 animate-bounce" size={14} title="Aniversário hoje!" />
                )}
                {customer.hasNotes && (
                  <LuFileText className="text-amber-500" size={14} title="Possui anotações" />
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium truncate">{customer.phoneFormatted}</span>
          </div>
        </div>
      </CustomerDetailsSheet>

      {customer.waLink && (
        <a
          href={customer.waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
          >
            <FaWhatsapp size={22} />
          </Button>
        </a>
      )}
    </div>
  )
}