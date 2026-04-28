import { Database } from "@/commons/types/database.types";

export type ProcedureInsertPayload = Database['public']['Tables']['procedures']['Insert']
export type ProcedureUpdatePayload = Database['public']['Tables']['procedures']['Update']

//export interface ProcedureCreateBody extends ProcedureInsertPayload {}
