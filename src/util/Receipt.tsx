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
.receipt { width: 80mm; min-width: 80mm !important; max-width: 80mm !important; background: white; color: #111827; padding: 12px; box-shadow: 0 4px 18px rgba(0,0,0,.1); }
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
.items-head, .item-row { display: grid; grid-template-columns: 1fr 85px; align-items: start; gap: 6px; }
.items-head { font-weight: 600; font-size: 11px; }
.item-row { font-size: 11px; }
.item-name { word-break: break-word; }
.right { text-align: right !important; justify-self: end; }

/***** TOTALS *****/
.totals { font-size: 11px; }
.totals .row { margin-top: 4px; }
.totals .row.bold { font-weight: 700; font-size: 12px; }

.footer { text-align: center; margin-top: 10px; font-size: 11px; color: #6b7280; }
.qr { display: flex; justify-content: center; margin-top: 8px; }

/***** PRINTING *****/
@media print {
  html, body {
    margin: 0;
    padding: 0;
    background: white;
    width: 80mm;             /* force print width to 80mm */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .receipt-root {
    background: white !important;
    padding: 0 !important;
    display: block !important;
  }

  .receipt {
    width: 80mm !important;   /* force receipt width */
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

@page { size: 80mm auto; margin: 0; }
`;

// eslint-disable-next-line react-refresh/only-export-components
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
    onPrintComplete, // restored so callback is invoked after print
  } = props;

  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [itemCount, setItemCount] = useState<number>(0);

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

    setItemCount(sale.saleItems.length);
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
        const receiptEl = document.querySelector('.receipt') as HTMLElement | null;
        if (!receiptEl) return;

        // render full receipt to canvas
        const canvas = await html2canvas(receiptEl, { scale: 2, backgroundColor: '#ffffff' });
        const imgData = canvas.toDataURL('image/png');

        // desired receipt width in mm (thermal roll)
        const pdfWidthMm = 80;

        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;
        const imgHeightMm = (imgHeightPx * pdfWidthMm) / imgWidthPx;

        // Prefer to create a single-page PDF sized to the actual content height (good for thermal roll printers)
        const maxSinglePageMm = 2000; // safety cap (2 meters) to avoid crazy large single page; adjust if needed

        let pdf: any;

        if (imgHeightMm > 0 && imgHeightMm <= maxSinglePageMm) {
          // single-page PDF exactly sized to content
          pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidthMm, imgHeightMm],
          });
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, imgHeightMm);
        } else {
          // Fallback: slice into multiple pages (each page height = pageHeightMm)
          const pageHeightMm = 297; // use ~A4 height slices; thermal printers will print page-by-page
          const pxPerMm = imgHeightPx / ((imgHeightPx * pdfWidthMm) / imgWidthPx); // simplifies to imgWidthPx/pdfWidthMm ? keep safe compute:
          const pxPerMmCorrect = imgHeightPx / imgHeightMm;
          const sliceHeightPx = Math.floor(pageHeightMm * pxPerMmCorrect);

          const pdfFirst = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidthMm, pageHeightMm],
          });
          pdf = pdfFirst;

          let remainingPx = imgHeightPx;
          let offsetY = 0;
          let first = true;

          while (remainingPx > 0) {
            const h = Math.min(sliceHeightPx, remainingPx);
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = imgWidthPx;
            tmpCanvas.height = h;
            const ctx = tmpCanvas.getContext('2d');
            if (!ctx) break;
            ctx.drawImage(canvas, 0, offsetY, imgWidthPx, h, 0, 0, imgWidthPx, h);
            const sliceData = tmpCanvas.toDataURL('image/png');
            const sliceHeightMm = (h * pdfWidthMm) / imgWidthPx;

            if (!first) {
              // add new page with same size
              pdf.addPage([pdfWidthMm, pageHeightMm]);
            }
            pdf.addImage(sliceData, 'PNG', 0, 0, pdfWidthMm, sliceHeightMm);

            first = false;
            offsetY += h;
            remainingPx -= h;
          }
        }

        // produce blob URL and print via hidden iframe
        const blobUrl = pdf.output('bloburl');
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          const win = iframe.contentWindow;
          if (!win) return;
          const removeAndCallback = () => {
            try { document.body.removeChild(iframe); } catch {}
            if (onPrintComplete) onPrintComplete();
          };
          // prefer onafterprint, fallback to timeout
          win.onafterprint = removeAndCallback;
          setTimeout(removeAndCallback, 3000);
          try { win.focus(); win.print(); } catch (e) { removeAndCallback(); }
        };
      }

      const timer = setTimeout(printPDF, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, onPrintComplete]);

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
            {/* <div className="right">Qty</div> */}
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
                    {formatMoney(it.price + (it.discount ?? 0), currency)} × {it.qty}
                    {discount > 0 && (
                      <>
                        <br />
                        Disc: {formatMoney((discount * it.qty), currency)}
                      </>
                    )}
                  </div>
                </div>
                {/* <div className="right">{it.qty}</div> */}
                <div className="right">{formatMoney(base, currency)}</div>
              </div>
            );
          })}

        </div>

        <div className="sep" />

        {/* Totals */}
        <div className="totals mono">
          <div className="row"><span>Orginal Total</span><span>{formatMoney(sale.originalTotal, currency)}</span></div>
          <div className="row"><span>Item Count</span><span>{itemCount}</span></div>
          <div className="row"><span>Item Discounts</span><span>-{formatMoney(sale.itemDiscounts, currency)}</span></div>
          <div className="row"><span>Sub Total</span><span>{formatMoney(sale.subtotal, currency)}</span></div>
          {sale.orderDiscountPercentage > 0 && (
            <>
              <div className="row"><span>Order Discount(%)</span><span>{sale.orderDiscountPercentage} %</span></div>
              <div className="row"><span>Order Discount</span><span>-{formatMoney(sale.orderDiscount, currency)}</span></div>
            </>
          )}
          <div className="sep" />
          <div className="row bold"><span>Grand Total</span><span>{formatMoney(sale.totalAmount, currency)}</span></div>
          <div className="sep" />
          <div className="row"><span>Pay Amount</span><span>{formatMoney(sale.paymentAmount, currency)}</span></div>
          <div className="row"><span>Balance</span><span>{formatMoney(sale.balance, currency)}</span></div>
        </div>

        <div className="footer"><strong>ご購入ありがとうございました！</strong><br />Thank you for your purchase!</div>

        {/* Optional QR/Barcode slot (image source can be injected by parent) */}
        {/* <div className="qr"><img src={qrSrc} alt="QR" width={120} height={120} /></div> */}
      </div>

    </div>
  );
}