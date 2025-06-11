import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ToggleCourse({ product, fetchProductData }) {
  const notyf = new Notyf();
  const productId = product._id;
  const token = localStorage.getItem("token")

  const archiveToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if(data.success === true) {
        notyf.success(data.message)
        fetchProductData();

      }else {
        notyf.error(data.error)
        fetchProductData();
      }
    })
  }

  const activateToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if(data.success === true) {
        notyf.success(data.message)
        fetchProductData();
      }else{
        notyf.error(data.error)
        fetchProductData();
      }
    })
  }

  return(
    product.isActive
    ?
      <Button variant="danger" size="sm" onClick={() => archiveToggle()}>Archive</Button>
    :
      <Button variant="success" size="sm" onClick={() => activateToggle()}>Activate</Button>
  )
}