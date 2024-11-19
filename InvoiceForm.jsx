import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import { generatePDF } from "./pdf/pdfGenerator";
import InvoiceItem from "./reusable/InvoiceItem";
import "./InvoiceForm.css";


export default function InvoiceForm() {
  const [invoiceData, setInvoiceData] = useState({
    currency: "₹",
    invoiceNumber: 1,
    billTo: "",
    billToAddress: "",
    billToEmail: "",
    billToGSTIN: "",
    billFrom: "",
    billFromAddress: "",
    billFromEmail: "",
    billFromGSTIN: "",
    notes: "",
    taxRate: 8,
    discountRate: 15,
  });

  const [items, setItems] = useState([
    { id: 1, name: "", description: "", quantity: 1, price: 0 },
  ]);

  const [totals, setTotals] = useState({
    subTotal: 0.0,
    taxAmount: 0.0,
    discountAmount: 0.0,
    total: 0.0,
  });

  const [showModal, setShowModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get("/api/invoice");
      setInvoiceData(response.data.invoiceData);
      setItems(response.data.items);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  // Update totals whenever items, tax, or discount changes
  useEffect(() => {
    const calculateTotals = () => {
      const subTotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
      const taxAmount = (subTotal * invoiceData.taxRate) / 100;
      const discountAmount = (subTotal * invoiceData.discountRate) / 100;
      const total = subTotal + taxAmount - discountAmount;

      setTotals({
        subTotal: subTotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        total: total.toFixed(2),
      });
    };
    calculateTotals();
  }, [items, invoiceData.taxRate, invoiceData.discountRate]);

  // Input change handler
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevData) => ({ ...prevData, [name]: value }));
  };

  // CRUD Operations
  const addItem = () => {
    const newItem = { id: Date.now(), name: "", description: "", quantity: 1, price: 0 };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const deleteItem = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  const handleSaveInvoice = async () => {
    try {
      await axios.post("/api/invoice", { invoiceData, items });
      alert("Invoice saved successfully!");
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handleGeneratePDF = () => {
    generatePDF(invoiceData, items, totals);
  };

  const handleShare = () => {
    const invoiceDetails = `Invoice Number: ${invoiceData.invoiceNumber}\nTotal: ${totals.total} ${invoiceData.currency}\nBill To: ${invoiceData.billTo}\nBill From: ${invoiceData.billFrom}`;
    
    // Email share
    const emailBody = encodeURIComponent(invoiceDetails);
    const emailSubject = encodeURIComponent("Invoice Details");
    const emailLink = `mailto:${invoiceData.billToEmail}?subject=${emailSubject}&body=${emailBody}`;

    // WhatsApp share
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(invoiceDetails)}`;

    // Facebook share
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;

    // Open the share links
    window.open(emailLink, "_self"); // Open mail client
    window.open(whatsappLink, "_blank"); // Open WhatsApp
    window.open(facebookLink, "_blank"); // Open Facebook
  };

  return (
    <Container className="invoice-container">
      <h1 className="text-center mb-4">Invoice Generator</h1>
      <Form onSubmit={(e) => e.preventDefault()} style={{ width: "100%", maxWidth: "900px" }}>
        <Row>
          <Col md={8} lg={9}>
            <div className="mb-3">
              <span className="fw-bold">Current Date: </span>
              <span className="current-date">{new Date().toLocaleDateString()}</span>
              <span className="fw-bold ms-4">Invoice Number: </span>
              <span className="current-date">{invoiceData.invoiceNumber}</span>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Customer Details:</Form.Label>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Name"
                    value={invoiceData.billTo}
                    type="text"
                    name="billTo"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Email"
                    value={invoiceData.billToEmail}
                    type="email"
                    name="billToEmail"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Address"
                    value={invoiceData.billToAddress}
                    type="text"
                    name="billToAddress"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter GSTIN"
                    value={invoiceData.billToGSTIN}
                    type="text"
                    name="billToGSTIN"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill From:</Form.Label>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Company Name"
                    value={invoiceData.billFrom}
                    type="text"
                    name="billFrom"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Email"
                    value={invoiceData.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter Address"
                    value={invoiceData.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Control
                    placeholder="Enter GSTIN"
                    value={invoiceData.billFromGSTIN}
                    type="text"
                    name="billFromGSTIN"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Product Details Table */}
            <InvoiceItem items={items} setItems={setItems} addItem={addItem} updateItem={updateItem} deleteItem={deleteItem} currency={invoiceData.currency} />

            <hr className="my-4" />
          </Col>

          <Col md={4} lg={3}>
            <div className="text-center">
              <Button variant="primary" onClick={handleGeneratePDF} className="d-block w-100 my-2">
                Generate PDF
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(true)} className="d-block w-100 my-2">
                Review Invoice
              </Button>
              <Button variant="success" onClick={handleShare} className="d-block w-100 my-2">
                Share Invoice
              </Button>
              <Button variant="info" onClick={handleSaveInvoice} className="d-block w-100 my-2">
                Save Invoice
              </Button>
              <hr />
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  value={invoiceData.currency}
                  onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value })}
                >
                  <option>₹</option>
                  <option>$</option>
                  <option>€</option>
                  <option>£</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount Rate (%):</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={invoiceData.discountRate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, discountRate: parseFloat(e.target.value) || 0 })}
                />
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax Rate (%):</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={invoiceData.taxRate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, taxRate: parseFloat(e.target.value) || 0 })}
                />
              </Form.Group>
              <hr />
              <div className="text-center">
                <div className="my-2">
                  <strong>Sub Total:</strong> {totals.subTotal} {invoiceData.currency}
                </div>
                <div className="my-2">
                  <strong>Tax:</strong> {totals.taxAmount} {invoiceData.currency}
                </div>
                <div className="my-2">
                  <strong>Discount:</strong> -{totals.discountAmount} {invoiceData.currency}
                </div>
                <div className="my-2">
                  <strong>Total:</strong> {totals.total} {invoiceData.currency}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Review Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <strong>Invoice Number:</strong> {invoiceData.invoiceNumber}
              <hr />
              {items.map((item) => (
                <div key={item.id}>
                  <p>{item.name} (x{item.quantity}) - {item.price * item.quantity} {invoiceData.currency}</p>
                </div>
              ))}
              <hr />
              <p><strong>Total Amount:</strong> {totals.total} {invoiceData.currency}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </Container>
  );
}
