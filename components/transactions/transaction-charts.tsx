// TransactionCharts.tsx
"use client";

import { RevenueOverviewChart } from "./revenue-overview-chart";
import { TransactionTypesChart } from "./transaction-types-chart";
import { PaymentMethodsChart } from "./payment-methods-chart";

interface TransactionChartsProps {
  transactions: any[];
  dateRange: { from?: Date; to?: Date };
  isLoading?: boolean;
}

export function TransactionCharts({ transactions = [], dateRange = {}, isLoading = false }: TransactionChartsProps) {
  const filteredTransactions = transactions.filter((transaction) => {
    if (!transaction) return false;
    if (dateRange.from && new Date(transaction.date) < dateRange.from) return false;
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(transaction.date) > endDate) return false;
    }
    return true;
  });

  return (
    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2">
      {/* First chart takes full width on large screens */}
      {/* <RevenueOverviewChart
        transactions={filteredTransactions}
        isLoading={isLoading}
        className="md:col-span-2"
      /> */}

      {/* Last two charts share space in a row on large screens */}
      <TransactionTypesChart transactions={filteredTransactions} isLoading={isLoading} />
      <PaymentMethodsChart transactions={filteredTransactions} isLoading={isLoading} />
    </div>
  );
}