import { useContext, useEffect } from 'react';
import UserContext from "../UserContext";
import { Table } from 'react-bootstrap';

import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import ToggleProduct from "../components/ToggleProduct";

export default function AdminDashboard() {
  const { products, fetchProductData } = useContext(UserContext);

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
    <h1 className="text-center my-4">Admin Dashboard</h1>
    <AddProduct fetchProductData={fetchProductData} />
    <Table striped bordered hover responsive size="sm" className="align-middle">
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