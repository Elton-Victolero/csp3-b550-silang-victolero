import { useEffect, useState, useContext, useCallback } from 'react';
import UserContext from '../UserContext';
import ProductListUser from "../components/ProductListUser";
import ProductListAdmin from "../components/ProductListAdmin";

export default function Products() {
	const {user} = useContext(UserContext);
	
	const [products, setProducts] = useState([]);
	
	const fetchData = useCallback(() => {
	    let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_URL}/products/all` : `${process.env.REACT_APP_API_URL}/products/active`
	    fetch(fetchUrl, {
	        headers: {
	            Authorization: `Bearer ${localStorage.getItem("token")}`
	        }
	    })
	    .then(res => res.json())
	    .then(data => {
	    	console.log("data:", data)
	        setProducts(data);
	    });
	}, [user.isAdmin]);

	useEffect(() => {
	    fetchData()
	}, [fetchData]);

	return(
	    <>
      {
        user.isAdmin === true
        ?
	        <ProductListAdmin productData={products} fetchData={fetchData} />
	      :
	        <ProductListUser productData={products} />
      }
	    </>
	)
}