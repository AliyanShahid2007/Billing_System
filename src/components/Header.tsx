import React from 'react';
import { BookOpen, Download, Upload } from 'lucide-react';
import { DatabaseService } from '../utils/database';

interface HeaderProps {
  onDataImported: () => void;
}

export function Header({ onDataImported }: HeaderProps) {
  const handleExport = () => {
    const data = DatabaseService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (DatabaseService.importData(result)) {
          alert('Data imported successfully!');
          onDataImported();
        } else {
          alert('Failed to import data. Please check the file format.');
        }
      } catch {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <header className="bg-white shadow-lg rounded-xl mb-8 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">KYN-Billing</h1>
            <p className="text-gray-600">Complete Billing Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
