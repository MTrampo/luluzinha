import Header from "@/components/header/dashboard";
import { Transaction } from "@/features/finance/history";
import { Overview } from "@/features/finance/overview";

export default async function CashRegister() {
  return (
    <>
      <Header title="Caixa"/>
      <div className="main-content">
        <Overview/>
        <h4>Últimos lançamentos</h4>
        <div className="border rounded-xl">
          <Transaction/>
          <Transaction/>
          <Transaction/>
          <Transaction/>
        </div>
      </div>
    </>
  )
}