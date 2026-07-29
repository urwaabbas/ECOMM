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
}

export function generateInvoice(order: Order) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setFont("helvetica ", "normal");
  doc.text("HAANLI BAZAAR", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Invoice", 105, 30, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  doc.setFontSize(10);
  doc.text(`Order ID : ${order._id}`, 20, 45);
  doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString()}`, 20, 53);
  doc.text(`Status : ${order.status.toUpperCase()}`, 20, 61);

  doc.line(20, 67, 190, 67);

  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, 75);
  doc.text("Qty", 135, 75);
  doc.text("Price", 160, 75);

  doc.line(20, 80, 190, 80);

  doc.setFont("helvetica", "normal");

  let y = 87;

  order.items.forEach((item) => {
    const price = item.price * 278;
    doc.text(item.title.substring(0, 40), 20, y);
    doc.text(`${item.quantity}`, 130, y);
    doc.text(`Pkr ${(price * item.quantity).toLocaleString()}`, 160, y);
    y += 10;
  });

  doc.line(20, y, 190, y);

  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("Total", 130, y);

  doc.text(`Pkr ${(order.total * 278).toLocaleString()}`, 160, y);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);
  doc.text("Thank you For Shopping at Haanli Bazaar!", 105, y + 20, {
    align: "center",
  });
  doc.text("haanlibazaar.vercel.app", 105, y + 28, { align: "center" });

  doc.save(`invoice-${order._id}.pdf`);
}
