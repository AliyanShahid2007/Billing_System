import { Bill, Customer } from '../types/billing';

// Local storage keys
const BILLS_KEY = 'billing_system_bills';
const CUSTOMERS_KEY = 'billing_system_customers';

export class DatabaseService {
  static getBills(): Bill[] {
    const bills = localStorage.getItem(BILLS_KEY);
    return bills ? JSON.parse(bills) : [];
  }

  static saveBill(bill: Bill): void {
    const bills = this.getBills();
    bills.unshift(bill); // Add to beginning for newest first
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }

  static deleteBill(id: string): void {
    const bills = this.getBills().filter(bill => bill.id !== id);
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }

  static getCustomers(): Customer[] {
    const customers = localStorage.getItem(CUSTOMERS_KEY);
    return customers ? JSON.parse(customers) : [];
  }

  static saveCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  static searchBills(query: string): Bill[] {
    const bills = this.getBills();
    if (!query) return bills;
    
    return bills.filter(bill => 
      bill.customerName.toLowerCase().includes(query.toLowerCase()) ||
      bill.items.some(item => item.name.toLowerCase().includes(query.toLowerCase()))
    );
  }

  static exportData(): string {
    const data = {
      bills: this.getBills(),
      customers: this.getCustomers(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.bills) localStorage.setItem(BILLS_KEY, JSON.stringify(data.bills));
      if (data.customers) localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(data.customers));
      return true;
    } catch {
      return false;
    }
  }
}