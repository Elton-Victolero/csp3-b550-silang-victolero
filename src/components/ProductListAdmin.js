import { useEffect } from 'react';
import { Table } from 'react-bootstrap';

import UpdateProduct from "../components/UpdateProduct";
import ToggleProduct from "../components/ToggleProduct";

export default function AdminDashboard({ products, fetchProductData }) {
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const productList = products.map(product => (
    <tr key={product._id}>
      <td className="d-none d-lg-table-cell">{product._id}</td>
      <td>{product.name}</td>
      <td className="d-none d-lg-table-cell">{product.description}</td>
      <td className="d-none d-lg-table-cell">{product.price}</td>
      <td className={`text-center ${product.isActive ? "text-success" : "text-danger"}`}>
        {product.isActive ? "Available" : "Unavailable"}
      </td>
      <td className="text-center">
        <UpdateProduct product={product} fetchProductData={fetchProductData} />
      </td>
      <td className="text-center">
        <ToggleProduct product={product} fetchProductData={fetchProductData} />
      </td>
    </tr>
  ));

  return(
    <>
      <Table striped bordered hover responsive className="align-middle">
        <thead>
          <tr className="text-center">
            <th className="d-none d-lg-table-cell">ID</th>
            <th>Name</th>
            <th className="d-none d-lg-table-cell">Description</th>
            <th className="d-none d-lg-table-cell">Price</th>
            <th>Status</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList}
        </tbody>
      </Table>    
    </>
  )
}