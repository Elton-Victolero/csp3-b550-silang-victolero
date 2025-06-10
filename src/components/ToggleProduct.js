import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ToggleCourse({product, fetchData}) {
  const notyf = new Notyf();
  const token = localStorage.getItem("token")

  const productId = product._id;

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
        fetchData();

      }else {
        notyf.error(data.error)
        fetchData();
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
        fetchData();
      }else{
        notyf.error(data.error)
        fetchData();
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