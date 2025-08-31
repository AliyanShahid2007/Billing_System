import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import { Bill } from '../types/billing';
import { PDFGenerator } from '../utils/pdfGenerator';

interface SuccessAlertProps {
  bill: Bill;
  onClose: () => void;
}

export function SuccessAlert({ bill, onClose }: SuccessAlertProps) {
  const handleDownload = () => {
    PDFGenerator.generateInvoice(bill);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">Bill Generated Successfully!</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice #:</span>
                <span className="font-semibold">#{bill.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">{bill.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">Rs. {bill.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-red-600">Rs. {bill.discountAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-600 font-semibold">Net Total:</span>
                <span className="font-bold text-emerald-600 text-lg">Rs. {bill.netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}