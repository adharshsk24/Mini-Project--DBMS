import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function InvoiceModal({ showModal, closeModal, info, total }) {
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Invoice Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>From:</strong> {info.billFrom}</p>
        <p><strong>To:</strong> {info.billTo}</p>
        <p><strong>Total:</strong> {info.currency} {total}</p>
        <p>Details are not final until invoice is generated.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
