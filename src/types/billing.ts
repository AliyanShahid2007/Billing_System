export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Bill {
  id: string;
  customerName: string;
  items: BillItem[];
  total: number;
  discount: number;
  discountAmount: number;
  netTotal: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  lastBillDate: string;
}