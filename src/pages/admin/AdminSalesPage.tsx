import React, { useEffect, useState } from 'react';
import { getAllSales } from '../../services/SaleService';

interface Sale {
  saleId: number;
  saleDate: string;
  totalAmount: number;
  totalDiscount: number;
  paymentMethod: string;
  userId: number;
  customerId: number | null;
  saleItems: null;
}

const AdminSalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [_loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await getAllSales();
      setSales(response.saleDTOList || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map(sale => (
              <tr key={sale.saleId}>
                <td className="px-6 py-4 whitespace-nowrap">#{sale.saleId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.saleDate).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">LKR {sale.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">LKR {sale.totalDiscount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap">#{sale.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesPage;
