import React, { useEffect, useState } from 'react';
import { getAllSales, deleteSale } from '../../services/SaleService';
import { getAllSaleItemsBySaleId } from '../../services/SaleItemService';

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

interface SaleItem {
  saleItemId: number;
  saleId: number;
  productName: string;
  barcode: string;
  qty: number;
  price: number;
  totalPrice: number;
  discount: number;
}

const AdminSalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [_loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSaleId, setModalSaleId] = useState<number | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

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

  const handleDeleteClick = (saleId: number) => {
    setSaleToDelete(saleId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (saleToDelete) {
      try {
        await deleteSale(saleToDelete);
        setSales(sales.filter(sale => sale.saleId !== saleToDelete));
        setShowDeleteConfirm(false);
        setSaleToDelete(null);
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  // Method to open modal and fetch sale items
  const handleViewDetails = async (saleId: number) => {
    setModalSaleId(saleId);
    setShowModal(true);
    setItemsLoading(true);
    setItemsError(null);
    try {
      const response = await getAllSaleItemsBySaleId(saleId);
      const items = Array.isArray(response?.saleItemDTOList) ? response.saleItemDTOList : [];
      setSaleItems(items.reverse());
    } catch (err: any) {
      setItemsError(err.message || 'Failed to fetch sale items');
      setSaleItems([]);
    }
    setItemsLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalSaleId(null);
    setSaleItems([]);
    setItemsError(null);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewDetails(sale.saleId)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteClick(sale.saleId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)"
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-black">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this sale? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Items Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)"
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 border border-blue-100 animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-3xl font-bold transition-colors"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Sale #{modalSaleId} Items</h2>
            {itemsLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading items...</p>
              </div>
            ) : itemsError ? (
              <div className="text-center py-8 text-red-500">{itemsError}</div>
            ) : saleItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No items found for this sale.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-blue-100 rounded-lg">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Barcode</th>
                      <th className="p-3 text-left">Qty</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Total Price</th>
                      <th className="p-3 text-left">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleItems.map((item, idx) => (
                      <tr key={item.saleItemId} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3">{item.barcode}</td>
                        <td className="p-3">{item.qty}</td>
                        <td className="p-3">LKR {item.price.toFixed(2)}</td>
                        <td className="p-3">LKR {item.totalPrice.toFixed(2)}</td>
                        <td className="p-3">LKR {item.discount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalesPage;
