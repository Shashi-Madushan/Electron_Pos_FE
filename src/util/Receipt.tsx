import { useEffect, useMemo, useState } from "react";
import type { User } from "../types/User";
import { getUserById } from "../services/UserService";
import type { Customer } from "../types/Customer";
import { getCustomerById } from "../services/CustomerService";
import { getProductById } from "../services/ProductService";
import type { Product } from "../types/Product";
import type { BusinessInfo, Currency, Sale } from "../types/Sale";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const styles = `
/* Center on screen */
.receipt-root { display: flex; justify-content: center; padding: 16px; background: #f3f4f6; min-height: 50vh; }

/***** RECEIPT *****/
.receipt { width: 80mm; background: white; color: #111827; padding: 12px; box-shadow: 0 4px 18px rgba(0,0,0,.1); }
.receipt * { box-sizing: border-box; }

.header { text-align: center; }
.header .title { font-weight: 700; font-size: 16px; }
.header .sub { font-size: 11px; line-height: 1.25; color: #4b5563; }

.meta { margin-top: 8px; font-size: 11px; }
.row { display: flex; justify-content: space-between; gap: 8px; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
.sep { border-top: 1px dashed #d1d5db; margin: 8px 0; }

/***** ITEMS *****/
.items { margin-top: 8px; }
.items-head, .item-row { display: grid; grid-template-columns: 1fr 36px 68px; align-items: start; gap: 6px; }
.items-head { font-weight: 600; font-size: 11px; }
.item-row { font-size: 11px; }
.item-name { word-break: break-word; }
.right { text-align: right; }

/***** TOTALS *****/
.totals { font-size: 11px; }
.totals .row { margin-top: 4px; }
.totals .row.bold { font-weight: 700; font-size: 12px; }

.footer { text-align: center; margin-top: 10px; font-size: 11px; color: #6b7280; }
.qr { display: flex; justify-content: center; margin-top: 8px; }

/***** PRINTING *****/
@media print {
  // body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  // .no-print { display: none !important; }
  // .receipt-root { background: white; padding: 0; }
  // .receipt { width: 78mm; box-shadow: none; padding: 10px; }
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    width: 72mm;             /* force print width */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .receipt-root {
    background: white !important;
    padding: 0 !important;
    display: block !important;
  }

  .receipt {
    width: 72mm !important;   /* force receipt width */
    box-shadow: none !important;
    page-break-inside: avoid;
  }

  .item-row {
    page-break-inside: avoid; /* prevent splitting items */
  }

  .no-print {
    display: none !important;
  }
}

@page { size: 78mm auto; margin: 0; }
`;

export const formatMoney = (value: number, currency: Currency = "LKR"): string => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    // Fallback if currency code unsupported on some devices
    return `${currency} ${value.toFixed(2)}`;
  }
};

export interface ReceiptProps {
    business: BusinessInfo;
    sale: Sale;
    currency?: Currency;
    autoPrint?: boolean; // Add this prop
    onPrintComplete?: () => void; // Add this prop
}

export default function Receipt(props: ReceiptProps) {
  const {
    business,
    sale,
    currency = "LKR",
    autoPrint = false,
    onPrintComplete
  } = props;

  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    // Fetch user data or any other side effects
    const loadData = async () => {
      try {
        // Load user and customer data
        const userData = await getUserById(sale.userId);
        console.log("User Data:", userData);
        setUser(userData.userDTO);

        if (sale.customerId !== 0) {
          const customerData = await getCustomerById(sale.customerId);
          console.log("Customer Data:", customerData);
          setCustomer(customerData.customerDTO);
        }

        // Load product data for each item
        const productPromises = sale.saleItems.map(async (item) => {
          const product = await getProductById(item.productId);
          console.log("Product Data:", product);
          return [item.productId, product.productDTO];
        });

        const productResults = await Promise.all(productPromises);
        const productMap = Object.fromEntries(productResults);
        setProducts(productMap);
      } catch (error) {
        console.error("Error loading receipt data:", error);
      }
    };

    loadData();
    console.log("Sale Data:", sale);
  }, []);

  const date = sale.date || new Date();

  const dateStr = useMemo(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }, [date]);

  useEffect(() => {
    if (autoPrint) {
      async function printPDF() {
        const receiptElement = document.querySelector('.receipt') as HTMLElement;
        if (!receiptElement) return;

        const canvas = await html2canvas(receiptElement, { 
          scale: 2,
          backgroundColor: '#ffffff' // force pure white background
        });
        const imgData = canvas.toDataURL('image/png');

        const pdfWidth = 78; // mm
        const pdfHeight = canvas.height * pdfWidth / canvas.width;
        const pdf = new jsPDF({
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        });

        pdf.setDrawColor(200, 200, 200);  // light gray border
        pdf.setLineWidth(0.2);
        pdf.rect(0.5, 0.5, pdfWidth - 1, pdfHeight - 1);

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // tell PDF to auto-print
        (pdf as any).autoPrint();

        // make a Blob URL
        const pdfBlob = pdf.output('bloburl').toString();

        // create hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfBlob;
        document.body.appendChild(iframe);

        // wait until loaded, then print and remove
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      }

      const timer = setTimeout(printPDF, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <div id="receipt-root" className="receipt-root">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="receipt" role="document" aria-label="Sales receipt 80mm">
        {/* Header */}
        <div className="header">
          <div className="title">{business.name}</div>
          {business.address && <div className="sub">{business.address}</div>}
          {(business.phone) && (
            <div className="sub">
              {business.phone ? `Tel: ${business.phone}` : ""}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="meta mono">
          <div className="row"><span>Invoice</span><span>#{sale.saleId}</span></div>
          <div className="row"><span>Date</span><span>{dateStr}</span></div>
          <div className="row"><span>Cashier</span><span>{user?.userName}</span></div>
          {customer && (
            <>
              <div className="row"><span>Customer</span><span>{customer.customerName ?? "Walk-in"}</span></div>
              {customer.phone && <div className="row"><span>Phone</span><span>{customer.phone}</span></div>}
            </>
          )}
        </div>

        <div className="sep" />

        {/* Items */}
        <div className="items">
          <div className="items-head mono">
            <div>Item</div>
            <div className="right">Qty</div>
            <div className="right">Total</div>
          </div>
          <div className="sep" />
            {sale.saleItems.map((it) => {
            const product = products[it.productId]; // fetched product
            const base = it.qty * it.price; // qty * price
            const discount = it.discount ?? 0;

            return (
                <div className="item-row mono" key={it.saleItemId}>
                <div className="item-name">
                    <div>{product?.productName || `Product ${it.productId}`}</div>
                    <div style={{ color: "#6b7280", fontSize: 10 }}>
                    {formatMoney(it.price, currency)} × {it.qty}
                    {discount > 0 && <> · Disc: {formatMoney(discount, currency)}</>}
                    </div>
                </div>
                <div className="right">{it.qty}</div>
                <div className="right">{formatMoney(base, currency)}</div>
                </div>
            );
            })}

        </div>

        <div className="sep" />

        {/* Totals */}
        <div className="totals mono">
          <div className="row"><span>Orginal Total</span><span>{formatMoney(sale.originalTotal, currency)}</span></div>
          <div className="row"><span>Item Discounts</span><span>-{formatMoney(sale.itemDiscounts, currency)}</span></div>
          <div className="row"><span>Sub Total</span><span>{formatMoney(sale.subtotal, currency)}</span></div>
          {sale.orderDiscountPercentage > 0 && (
            <>
              <div className="row"><span>Order Discount(%)</span><span>{sale.orderDiscountPercentage} %</span></div>
              <div className="row"><span>Order Discount</span><span>-{formatMoney(sale.orderDiscount, currency)}</span></div>
            </>
          )}
          <div className="row bold"><span>Grand Total</span><span>{formatMoney(sale.totalAmount, currency)}</span></div>
        </div>

        <div className="footer"><strong>ご購入ありがとうございました！</strong><br />Thank you for your purchase!</div>

        {/* Optional QR/Barcode slot (image source can be injected by parent) */}
        {/* <div className="qr"><img src={qrSrc} alt="QR" width={120} height={120} /></div> */}
      </div>

    </div>
  );
}