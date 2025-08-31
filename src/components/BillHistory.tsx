import React, { useState } from 'react';
import { Search, Download, Trash2, FileText, Calendar } from 'lucide-react';
import { Bill } from '../types/billing';
import { DatabaseService } from '../utils/database';
import { PDFGenerator } from '../utils/pdfGenerator';
import { format } from 'date-fns';

interface BillHistoryProps {
  bills: Bill[];
  onBillDeleted: () => void;
}

export function BillHistory({ bills, onBillDeleted }: BillHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = searchQuery 
    ? DatabaseService.searchBills(searchQuery)
    : bills;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      DatabaseService.deleteBill(id);
      onBillDeleted();
    }
  };

  const handleDownload = (bill: Bill) => {
    PDFGenerator.generateInvoice(bill);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-800">Billing History</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No bills found</p>
          <p className="text-sm">Generate your first bill to see it here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                <th className="px-4 py-3 text-left font-semibold">Invoice #</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Items</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
                <th className="px-4 py-3 text-right font-semibold">Discount</th>
                <th className="px-4 py-3 text-right font-semibold">Net Total</th>
                <th className="px-4 py-3 text-center font-semibold">Date</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, index) => (
                <tr key={bill.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3 font-mono text-sm">
                    #{bill.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {bill.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                    <div className="truncate">
                      {bill.items.map(item => item.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    Rs. {bill.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 font-semibold">
                    Rs. {bill.discountAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600">
                    Rs. {bill.netTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {format(new Date(bill.createdAt), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDownload(bill)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                        title="Delete Bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}