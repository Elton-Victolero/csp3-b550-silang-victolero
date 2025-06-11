import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddProduct({ fetchProductData }) {
  const notyf = new Notyf();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const clearFields = () => {
    setName("");
    setDescription("");
    setPrice("");
  }

  const openAdd = () => {
    clearFields();
    setShowAdd(true);
  };

  const closeAdd = () => {
    setShowAdd(false);
    clearFields();
  };

  const createProduct = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/products/`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, description, price })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Product already exists") {
        notyf.error("Product already exists.");
      } else if (data && data._id) {
        notyf.success("Product created successfully!");
        closeAdd();
        fetchProductData();
      } else {
        notyf.error("Something went wrong.");
      }
    });
  };

  return (
    <>
      <div className="text-center my-4">
        <Button variant="primary" onClick={openAdd}>Add Product</Button>
      </div>

      <Modal show={showAdd} onHide={closeAdd}>
        <Form onSubmit={createProduct}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={closeAdd}>Close</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
