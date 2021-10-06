import Swal from "sweetalert2";
import { useHistory } from "react-router";

const PaySuccedPage = () => {
  const history = useHistory();
  Swal.fire("付款成功。").then(() => {
    history.push("/");
  });

  return <div></div>;
};

export default PaySuccedPage;
