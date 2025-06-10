import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';

import UpdateProduct from "../components/UpdateProduct";
import ToggleProduct from "../components/ToggleProduct";

export default function ProductListAdmin({productData, fetchData}) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const productList = productData.map(product => {
      return (
        <tr key={product._id}>
          <td>{product._id}</td>
          <td>{product.name}</td>
          <td>{product.description}</td>
          <td>{product.price}</td>
          <td className={`text-center ${product.isActive ? "text-success" : "text-danger"}`}>
            {product.isActive ? "Available" : "Unavailable"}
          </td>
          <td className="text-center">
            <UpdateProduct product={product} fetchData={fetchData} />
            <ToggleProduct product={product} fetchData={fetchData} />
          </td>
        </tr>
        )
    })
    setProducts(productList)
  }, [productData, fetchData])

  return(
    <>
    <h1 className="text-center my-4">Admin Dashboard</h1>
    <Table striped bordered hover responsive>
      <thead>
        <tr className="text-center">
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Availability</th>
          <th colSpan="2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products}
      </tbody>
    </Table>    
    </>
  )
}