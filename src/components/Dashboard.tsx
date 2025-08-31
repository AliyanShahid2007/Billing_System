import React from 'react';
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { Bill } from '../types/billing';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface DashboardProps {
  bills: Bill[];
}

export function Dashboard({ bills }: DashboardProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const thisMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.createdAt);
    return billDate >= monthStart && billDate <= monthEnd;
  });

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.netTotal, 0);
  const monthlyRevenue = thisMonthBills.reduce((sum, bill) => sum + bill.netTotal, 0);
  const totalCustomers = new Set(bills.map(bill => bill.customerName)).size;
  const totalBills = bills.length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `Rs. ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Monthly Revenue',
      value: `Rs. ${monthlyRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      icon: Users,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Total Bills',
      value: totalBills.toString(),
      icon: FileText,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}