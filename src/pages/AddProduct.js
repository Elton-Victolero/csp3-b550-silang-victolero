import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function AddProduct() {

	const navigate = useNavigate();
	const { user } = useContext(UserContext);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");

	function createProduct(e) {
		e.preventDefault();

		let token = localStorage.getItem('token');

		fetch(`${process.env.REACT_APP_API_URL}/products/`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {

			if (data.message === "Product already exists") {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Product already exists.'
				});
			} else if (data && data._id) {
				setName("");
				setDescription("");
				setPrice(0);

				Swal.fire({
					icon: 'success',
					title: 'Product Created!',
					text: 'Product creation successful.'
				}).then(() => {
					navigate("/productList");
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Something went wrong.'
				});
			}
		})

	}

	return (
		(user.isAdmin === true)
			?
			<>
				<h1 className="my-5 text-center">Add Product</h1>
				<Form onSubmit={e => createProduct(e)}>
					<Form.Group>
						<Form.Label>Name:</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Name"
							required
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Description:</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Description"
							required
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Price:</Form.Label>
						<Form.Control
							type="number"
							placeholder="Enter Price"
							required
							value={price}
							onChange={e => setPrice(e.target.value)}
						/>
					</Form.Group>
					<Button variant="primary" type="submit" className="my-5">Submit</Button>
				</Form>
			</>
			:
			<Navigate to="/productList" />
	)
}
