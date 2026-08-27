"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EstablishmentFormatted, OpeningHours } from "@/commons/models/establishment"
import { ESTABLISHMENT_DEFAULT_HOURS } from "@/commons/constants/establishment"
import { getEstablishmentLiveStatus } from "@/commons/utils/helper"
import { InfoTab } from "./tabs/info-tab"
import { HoursTab } from "./tabs/hours-tab"
import { BlocksTab } from "./tabs/blocks-tab"

interface EstablishmentDashboardProps {
  establishment: EstablishmentFormatted
}

export default function EstablishmentDashboard({ establishment }: EstablishmentDashboardProps) {
  const [activeTab, setActiveTab] = useState("info")

  const [hours, setHours] = useState<OpeningHours>(
    (establishment.openingHours as OpeningHours) || ESTABLISHMENT_DEFAULT_HOURS
  )

  const status = getEstablishmentLiveStatus(hours)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <h2 className="text-purple-900 leading-tight tracking-tight">
            Gestão do Estabelecimento
          </h2>
          {status.isOpen ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {status.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 border border-gray-150 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              {status.label}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Personalize as informações do seu espaço digital, organize seus horários de funcionamento e gerencie seus bloqueios.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList variant="line" className="w-full justify-start border-b border-purple-100/60 bg-transparent p-0 gap-6 rounded-none mb-6">
          <TabsTrigger value="info" className="px-1 pb-3 pt-2 font-semibold bg-transparent rounded-none data-[state=active]:bg-transparent">
            Informações
          </TabsTrigger>
          <TabsTrigger value="hours" className="px-1 pb-3 pt-2 font-semibold bg-transparent rounded-none data-[state=active]:bg-transparent">
            Horário de Funcionamento
          </TabsTrigger>
          <TabsTrigger value="blocks" className="px-1 pb-3 pt-2 font-semibold bg-transparent rounded-none data-[state=active]:bg-transparent">
            Meus Bloqueios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <InfoTab establishment={establishment} />
        </TabsContent>

        <TabsContent value="hours">
          <HoursTab
            establishmentId={establishment.id}
            hours={hours}
            setHours={setHours}
          />
        </TabsContent>

        <TabsContent value="blocks" className="space-y-4">
          <BlocksTab establishmentId={establishment.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
