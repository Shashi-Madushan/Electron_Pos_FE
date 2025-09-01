import { useState } from "react";
import ReceiptModal from "../components/ReceiptModal";

export function ReceiptDemoPage() {
const saleData = {
    saleId: 1001,
    date: new Date("2025-09-01T10:15:00"), // extra field in your interface
    saleDate: "2025-09-01T10:15:00",
    totalAmount: 12500,
    totalDiscount: 1500,
    paymentMethod: "CASH",
    userId: 1,
    customerId: 0,
    saleItems: [
      {
        saleItemId: 1,
        saleId: 1001,
        productId: 1,
        qty: 2,
        price: 3500,
        discount: 500,
      },
      {
        saleItemId: 2,
        saleId: 1001,
        productId: 2,
        qty: 1,
        price: 5000,
        discount: 1000,
      },
    ],
  };

const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div>
      {!showReceipt && (
        <button onClick={() => setShowReceipt(true)}>Show Receipt</button>
      )}
  
      <ReceiptModal 
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        sale={saleData}
      />
    </div>
  );
}
