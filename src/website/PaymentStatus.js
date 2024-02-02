import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { emptyCart } from "../redux/slice/CartSlice";
import { Link } from "react-router-dom";

function PaymentStatus() {
  const tranId = useParams().Ids;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let txnId = tranId;
  let OrderData = localStorage.getItem("ORDER_DATA");
  let ProdcutData = JSON.parse(OrderData);
  let dasts = [{ txnId, ProdcutData }];
  console.log(dasts);
  let user = JSON.parse(ProdcutData.userData);
  useEffect(() => {
    const CheckStatus = async () => {
      const response = await fetch(
        `http://localhost:8000/api/users/status/${txnId}`
        // {
        //   method: "post",
        //   body: JSON.stringify({ txnId }),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      const result = await response.json();
      if (result.status === 200) {
        const responses = await fetch(
          "https://krushimitr.in/api/users/place-order",
          {
            method: "post",
            body: JSON.stringify({
              data: ProdcutData,
              userId: ProdcutData.userId,
              userMobile: user.mobile,
              userName: user.name,
              success: result.success,
              message: result.message,
              transactionData: result.data,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const getCat = await responses.json();
        if (getCat.status === 201) {
          dispatch(emptyCart([]));
          alert(getCat.result);
          navigate("/users/user-orders");
        } else {
          alert(getCat.result);
        }
      } else {
        const responses = await fetch(
          "https://krushimitr.in/api/users/payment_transaction_data",
          {
            method: "post",
            body: JSON.stringify({
              userId: ProdcutData.userId,
              userMobile: user.mobile,
              userName: user.name,
              success: result.success,
              message: result.message,
              transactionData: result.data,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const getCat = await responses.json();
        if (getCat.status === 201) {
          alert("Data Saved");
          navigate("/checkout");
        } else {
          alert(getCat.result);
        }
      }
    };
    CheckStatus();
  }, [ProdcutData, dispatch, navigate, txnId, user.mobile, user.name]);

  return (
    <div className="ProgressView">
      <h1>Your Transaction in Progress</h1>
      <Progress done="100" />
      <Link to={"/users/user-orders"} className="btn btn-primary">
        Order Page
      </Link>
    </div>
  );
}

const Progress = ({ done }) => {
  const [style, setStyle] = React.useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${done}%`,
    };

    setStyle(newStyle);
  }, 200);

  return (
    <div className="progress">
      <div className="progress-done" style={style}>
        {done}%
      </div>
    </div>
  );
};

export default PaymentStatus;
