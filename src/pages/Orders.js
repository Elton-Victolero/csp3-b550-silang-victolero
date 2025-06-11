import { useContext } from 'react';
import UserContext from '../UserContext';
import OrdersUserView from "../components/OrdersUserView";
import OrdersAdminView from "../components/OrdersAdminView";

export default function ProductMain() {
  const {user} = useContext(UserContext);

  return(
      <>
      {
        user.isAdmin === true
        ?
          <OrdersAdminView />
        :
          <OrdersUserView />
      }
      </>
  )
}