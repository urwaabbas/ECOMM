import jsPDF from "jspdf";

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  paymentMethod?: "stripe" | "cod";
  shippingInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
}

export function generateInvoice(order: Order) {
  const doc = new jsPDF();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;

  const colDesc = margin + 5;
  const colQty = 110;
  const colUnit = 145;
  const colAmount = pageWidth - margin - 3;

  const paymentLine1 = order.paymentMethod === "stripe" ? "Stripe Payment" : "Cash on Delivery";
  const paymentLine2 = order.paymentMethod === "stripe" ? "Online" : "COD";

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(234, 88, 12);
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("HAANLI BAZAAR", margin, 22);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Your trusted online marketplace", margin, 31);
  doc.text("haanlibazaar.vercel.app", margin, 38);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageWidth - margin, 22, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `#${order._id.substring(0, 16).toUpperCase()}`,
    pageWidth - margin,
    31,
    { align: "right" },
  );
  doc.text(
    new Date(order.createdAt).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    pageWidth - margin,
    38,
    { align: "right" },
  );

  doc.setFillColor(249, 250, 251);
  doc.rect(margin, 53, pageWidth - margin * 2, 35, "F");
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.rect(margin, 53, pageWidth - margin * 2, 35);

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", margin + 5, 62);
  doc.text("ORDER STATUS", pageWidth / 2, 62);
  doc.text("PAYMENT METHOD", pageWidth - margin - 5, 62, { align: "right" });

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(order.shippingInfo?.name || "Customer", margin + 5, 70);
  doc.text(order.shippingInfo?.address || "", margin + 5, 76);
  doc.text(
    `${order.shippingInfo?.city || "Pakistan"}${order.shippingInfo?.phone ? " | " + order.shippingInfo.phone : ""}`,
    margin + 5,
    82,
  );

  doc.setTextColor(21, 128, 61);
  doc.setFont("helvetica", "bold");
  doc.text(order.status.toUpperCase(), pageWidth / 2, 70);

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.text(paymentLine1, pageWidth - margin - 5, 70, { align: "right" });
  doc.text(paymentLine2, pageWidth - margin - 5, 76, { align: "right" });

  let y = 100;

  doc.setFillColor(234, 88, 12);
  doc.rect(margin, y, pageWidth - margin * 2, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", colDesc, y + 7);
  doc.text("QTY", colQty, y + 7, { align: "center" });
  doc.text("UNIT PRICE", colUnit, y + 7, { align: "center" });
  doc.text("AMOUNT", colAmount, y + 7, { align: "right" });

  y += 10;

  order.items.forEach((item, index) => {
    const unitPrice = item.price * 278;
    const itemTotal = unitPrice * item.quantity;

    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251);
    }
    doc.rect(margin, y, pageWidth - margin * 2, 12, "F");

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 12, pageWidth - margin, y + 12);

    doc.setTextColor(17, 24, 39);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(item.title.substring(0, 38), colDesc, y + 8);
    doc.text(`${item.quantity}`, colQty, y + 8, { align: "center" });
    doc.text(`PKR ${unitPrice.toLocaleString()}`, colUnit, y + 8, {
      align: "center",
    });
    doc.setFont("helvetica", "bold");
    doc.text(`PKR ${itemTotal.toLocaleString()}`, colAmount, y + 8, {
      align: "right",
    });

    y += 12;
  });

  y += 5;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Subtotal", pageWidth - margin - 50, y);
  doc.setTextColor(17, 24, 39);
  doc.text(
    `PKR ${(order.total * 278).toLocaleString()}`,
    pageWidth - margin - 5,
    y,
    { align: "right" },
  );

  y += 8;
  doc.setTextColor(107, 114, 128);
  doc.text("Shipping", pageWidth - margin - 50, y);
  doc.setTextColor(21, 128, 61);
  doc.setFont("helvetica", "bold");
  doc.text("FREE", pageWidth - margin - 5, y, { align: "right" });

  y += 8;
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text("Tax", pageWidth - margin - 50, y);
  doc.setTextColor(17, 24, 39);
  doc.text("PKR 0", pageWidth - margin - 5, y, { align: "right" });

  y += 5;
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y);

  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("TOTAL", pageWidth - margin - 50, y);
  doc.setTextColor(234, 88, 12);
  doc.setFontSize(12);
  doc.text(
    `PKR ${(order.total * 278).toLocaleString()}`,
    pageWidth - margin - 5,
    y,
    { align: "right" },
  );

  y += 20;

  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, pageWidth - margin * 2, 20, "FD");

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TERMS & CONDITIONS", margin + 5, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "All sales are final. For returns and refunds, please contact support within 7 days of delivery.",
    margin + 5,
    y + 14,
  );

  doc.setFillColor(234, 88, 12);
  doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("HAANLI BAZAAR", margin, pageHeight - 10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for your order!  |  haanlibazaar.vercel.app  |  urwaabbasahssan@gmail.com",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" },
  );
  doc.text("Page 1 of 1", pageWidth - margin, pageHeight - 10, {
    align: "right",
  });

  doc.save(`Haanli-Bazaar-Invoice-${order._id}.pdf`);
}