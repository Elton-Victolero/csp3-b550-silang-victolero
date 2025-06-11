import {useState} from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function UpdateProduct({product, fetchData}) {
  const notyf = new Notyf();

	const productId = product._id;
	const [productName, setProductName] = useState(product.name);
	const [productDescription, setProductDescription] = useState(product.description);
	const [productPrice, setProductPrice] = useState(product.price);

	const [showEdit, setShowEdit] = useState(false);

	const openEdit = () => {
	    setShowEdit(true)
	    setProductName(product.name)
	    setProductDescription(product.description)
	    setProductPrice(product.price)
	}

	const closeEdit = () => {
	    setShowEdit(false);
	    setProductName("")
	    setProductDescription("")
	    setProductPrice(0)
	}

	const editProduct = (e, productId) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/update`, {
			method: "PATCH",
			headers: {
				"Content-Type" : "application/json",
				Authorization : `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify({
				name : productName,
				description : productDescription,
				price : productPrice
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log("data:", data)
			if(data.success === true) {
			  notyf.success(data.message)
			  closeEdit();
			  fetchData();
			}else{
			  notyf.error(data.error)
			  closeEdit();
			  fetchData();
			}
		})
	}

	return(
    <>
    <Button variant="primary" size="sm" onClick={() => openEdit()}> Edit </Button>

    <Modal show={showEdit} onHide={closeEdit}>
      <Form onSubmit={e => editProduct(e, productId)}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              value={productName} 
              onChange={e => setProductName(e.target.value)} 
              required/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control 
              type="text" 
              value={productDescription} 
              onChange={e => setProductDescription(e.target.value)} 
              required/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type="number" 
              value={productPrice}
              onChange={e => setProductPrice(e.target.value)} 
              required/>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeEdit}>Close</Button>
          <Button variant="primary" type="submit">Submit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
    </>
	)
}