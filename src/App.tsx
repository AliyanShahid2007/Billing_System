import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BillForm } from './components/BillForm';
import { BillHistory } from './components/BillHistory';
import { SuccessAlert } from './components/SuccessAlert';
import { DatabaseService } from './utils/database';
import { Bill, BillItem } from './types/billing';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastGeneratedBill, setLastGeneratedBill] = useState<Bill | null>(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    setBills(DatabaseService.getBills());
  };

  const handleBillSubmit = (customerName: string, items: BillItem[], discount: number) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = (total * discount) / 100;
    const netTotal = total - discountAmount;

    const newBill: Bill = {
      id: uuidv4(),
      customerName,
      items,
      total,
      discount,
      discountAmount,
      netTotal,
      createdAt: new Date().toISOString()
    };

    DatabaseService.saveBill(newBill);
    setLastGeneratedBill(newBill);
    setShowSuccess(true);
    loadBills();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setLastGeneratedBill(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header onDataImported={loadBills} />
        <Dashboard bills={bills} />
        <BillForm onSubmit={handleBillSubmit} />
        <BillHistory bills={bills} onBillDeleted={loadBills} />
        
        {showSuccess && lastGeneratedBill && (
          <SuccessAlert 
            bill={lastGeneratedBill} 
            onClose={handleSuccessClose} 
          />
        )}
      </div>
    </div>
  );
}

export default App;