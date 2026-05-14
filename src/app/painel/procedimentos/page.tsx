import { getProceduresAction } from "@/actions/procedure";
import { ProcedureFormatted } from "@/commons/models/procedure";
import Procedures from "@/features/dashboard/procedures";
import { ProcedureFeedbackEmpty, ProcedureFeedbackError } from "@/features/procedures/feaadback";

type ProceduresPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function ProceduresPage(props: ProceduresPageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q?.toLowerCase() || "";

  let procedures: ProcedureFormatted[] = [];
  let errorMessage: string | null = null;

  const response = await getProceduresAction();

  if (response.status === 200) {
    procedures = response.data || [];
    if (q) {
      procedures = procedures.filter(proc =>
        proc.name.toLowerCase().includes(q)
      );
    }
  } else {
    errorMessage = response.message;
  }

  if (errorMessage) return <ProcedureFeedbackError message={errorMessage} />
  if (procedures.length === 0 && !q) return <ProcedureFeedbackEmpty />

  return <Procedures procedures={procedures} />
}