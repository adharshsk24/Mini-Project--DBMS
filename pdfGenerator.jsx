import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (invoiceData, items, totals) => {
  const doc = new jsPDF();
  
  // Set Times New Roman font and create a border
  doc.setFont("times", "normal");
  doc.rect(10, 10, 190, 277); // Creates a border

  // 'INVOICE' as heading
  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });

  // Company Details
  doc.setFontSize(12);
  doc.text(`From: ${invoiceData.billFrom}`, 14, 30);
  doc.text(`Address: ${invoiceData.billFromAddress}`, 14, 36);
  doc.text(`Email: ${invoiceData.billFromEmail}`, 14, 42);
  doc.text(`GSTIN: ${invoiceData.billFromGSTIN}`, 14, 48);

  // Customer Details
  doc.text(`Bill To: ${invoiceData.billTo}`, 14, 60);
  doc.text(`Address: ${invoiceData.billToAddress}`, 14, 66);
  doc.text(`Email: ${invoiceData.billToEmail}`, 14, 72);
  doc.text(`GSTIN: ${invoiceData.billToGSTIN}`, 14, 78);

  // Product details in a table with green header
  doc.autoTable({
    head: [['Product Name', 'Description', 'Price', 'Quantity', 'Total']],
    body: items.map(item => [
      item.name,
      item.description,
      item.price,
      item.quantity,
      (item.price * item.quantity).toFixed(2)
    ]),
    startY: 90,
    headStyles: { fillColor: [0, 128, 0] }, // Green header
  });

  const yPosition = doc.autoTable.previous.finalY;

  // Total calculations in a tabular format
  doc.text(`Subtotal: ${totals.subTotal}`, 14, yPosition + 10);
  doc.text(`Tax: ${totals.taxAmount}`, 14, yPosition + 16);
  doc.text(`Discount: ${totals.discountAmount}`, 14, yPosition + 22);
  doc.text(`Total: ${totals.total}`, 14, yPosition + 28);

  

  // Digital Signature
  doc.text(`Signature: ___________________`, 14, yPosition + 50);

  doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
};

