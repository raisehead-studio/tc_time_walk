import Swal from "sweetalert2";
import { useHistory } from "react-router";

const PayFailPage = () => {
  const history = useHistory();
  Swal.fire("您的付款發生問題，請聯絡客服人員。").then(() => {
    history.push("/");
  });

  return <div></div>;
};

export default PayFailPage;
