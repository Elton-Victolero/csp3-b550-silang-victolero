import { useContext, useState, useEffect } from 'react';
import UserContext from "../UserContext";
import { Button } from 'react-bootstrap';

import ProductListAdmin from "../components/ProductListAdmin";
import OrdersAdminView from "../components/OrdersAdminView";
import AddProduct from "../components/AddProduct";

export default function AdminDashboard() {
  const { products, fetchProductData } = useContext(UserContext);
  const [ productView, setProductView ] = useState(true);

  const toggleView = () => {
    if(productView === true){
      setProductView(false);
    }else{
      setProductView(true);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return(
    <>
      <h1 className="text-center my-4">Admin Dashboard</h1>
      <div className="text-center mb-4">
        <AddProduct fetchProductData={fetchProductData} />
        {productView === true
        ?
          <Button variant="primary" className="mx-2" onClick={toggleView}>View User Orders</Button>
        :
          <Button variant="primary" className="mx-2" onClick={toggleView}>View Products</Button>
        }
      </div>
      {productView === true
      ?
        <ProductListAdmin products={products} fetchProductData={fetchProductData} />
      :
        <OrdersAdminView />
      }
    </>
  )
}