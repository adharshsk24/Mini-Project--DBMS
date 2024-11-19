import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa"; // Import trash icon from react-icons

export default function InvoiceItem({ items, setItems, currency }) {
  const handleChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index][event.target.name] = event.target.value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: "", description: "", price: 0, quantity: 1 },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input
                  type="text"
                  placeholder="Item Name"
                  name="name"
                  value={item.name}
                  onChange={(event) => handleChange(index, event)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={item.description}
                  onChange={(event) => handleChange(index, event)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Price"
                  name="price"
                  value={item.price}
                  onChange={(event) => handleChange(index, event)}
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="number"
                  placeholder="Qty"
                  name="quantity"
                  value={item.quantity}
                  onChange={(event) => handleChange(index, event)}
                  className="form-control"
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                  <FaTrash /> {/* Trash icon */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary mt-2" onClick={handleAddItem}>
        Add Item
      </Button>
    </div>
  );
}
