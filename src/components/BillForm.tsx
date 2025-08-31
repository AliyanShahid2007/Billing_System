import React, { useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { BillItem } from '../types/billing';

interface BillFormProps {
  onSubmit: (customerName: string, items: BillItem[], discount: number) => void;
}

export function BillForm({ onSubmit }: BillFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: '', price: 0, quantity: 1, subtotal: 0 }
  ]);
  const [discount, setDiscount] = useState(0);

  const addItem = () => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      quantity: 1,
      subtotal: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'price' || field === 'quantity') {
          updated.subtotal = updated.price * updated.quantity;
        }
        return updated;
      }
      return item;
    }));
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (total * discount) / 100;
  const netTotal = total - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    
    const validItems = items.filter(item => 
      item.name.trim() && item.price > 0 && item.quantity > 0
    );
    
    if (validItems.length === 0) return;
    
    onSubmit(customerName, validItems, discount);
    
    // Reset form
    setCustomerName('');
    setItems([{ id: Date.now().toString(), name: '', price: 0, quantity: 1, subtotal: 0 }]);
    setDiscount(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Generate New Bill</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Items
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-lg">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Rs. {item.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">Rs. {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span className="font-semibold">Rs. {discountAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold text-blue-600">
                <span>Net Total:</span>
                <span>Rs. {netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Generate Bill
        </button>
      </form>
    </div>
  );
}