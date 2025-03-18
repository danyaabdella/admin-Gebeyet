"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TransactionDetailsDialog } from "@/components/transactions/transaction-details-dialog";

interface Transaction {
  _id: string;
  transactionId: string;
  date: string;
  type: string;
  customer?: { name?: string };
  amount: number;
  status: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case "processing":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return "Purchase";
      case "refund":
        return "Refund";
      case "withdrawal":
        return "Withdrawal";
      case "deposit":
        return "Deposit";
      case "fee":
        return "Platform Fee";
      default:
        return type;
    }
  };

  return (
    <>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center">
              <span className="hidden md:block">Transaction</span> ID
            </div>
          </TableHead>
          <TableHead className="hidden md:block">
            <div className="flex items-center">Date</div>
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <div className="flex items-center">Type</div>
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <div className="flex items-center">Customer</div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">Amount</div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">Status</div>
          </TableHead>
          <TableHead className="text-right">
            <div className="flex justify-end">Actions</div>
          </TableHead>
        </TableRow>
      </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No transactions found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow
                key={transaction._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                <TableCell className="md:hidden">{formatDate(transaction.date)}</TableCell>
                <TableCell className="hidden md:block">{formatDate(transaction.date)}</TableCell>
                <TableCell className="hidden md:block">{getTypeLabel(transaction.type)}</TableCell>
                <TableCell className="hidden md:block">{transaction.customer?.name || "N/A"}</TableCell>
                <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTransaction(transaction);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedTransaction && (
        <TransactionDetailsDialog
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
}
