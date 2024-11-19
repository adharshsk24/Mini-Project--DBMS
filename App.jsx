import React, { useState } from "react";
import './App.css';
import { Container } from "react-bootstrap";
import InvoiceForm from './components/InvoiceForm';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App d-flex flex-column align-items-center justify-content-center">
      <Container>
        <InvoiceForm />
      </Container>
    </div>
  );
}

export default App;