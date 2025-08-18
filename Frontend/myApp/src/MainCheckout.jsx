import { useState, useEffect, useRef } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";

function MainCheckout({ somethingChanged, setsomethingChanged }) {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderData, setorderData] = useState({});
  const intialRun = useRef(true);
  const [cur, setCur] = useState("");
  let getAllresult = null;
  let CheckoutData = null;
  async function update(changedValue, originalValue, bowlPrice, bowlName) {
    if (changedValue === originalValue) {
      return;
    } else if (changedValue > bowlPrice) {
      const totalData = {
        numberofBowls: changedValue,
        bowlName: bowlName,
        bowlTotal: bowlPrice,
      };
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateOrder/",
        totalData,
      );
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateBasket/",
        totalData,
      );
      setsomethingChanged((prev) => prev + 1);
    } else if (changedValue > 0 && changedValue < bowlPrice) {
      const totalData = {
        numberofBowls: -changedValue,
        bowlName: bowlName,
        bowlTotal: bowlPrice,
      };
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateOrder/",
        totalData,
      );
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateBasket/",
        totalData,
      );
      setsomethingChanged((prev) => prev + 1);
    } else if (changedValue === 0) {
      const totalData = {
        bowlName: bowlName,
      };
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/deleteOrder/",
        totalData,
      );
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateBasketForDeletedOrder/",
        totalData,
      );
      setsomethingChanged((prev) => prev + 1);
    } else {
      return;
    }
  }
  async function add(url, data) {
    console.log(data);
    setCheckingOut(true);
    let response;
    let CSRFToken = await getCookieFromBrowser("csrftoken");
    if (!CSRFToken) {
      await setCookie();
      CSRFToken = await getCookieFromBrowser("csrftoken");
    }
    try {
      const sendData = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": CSRFToken,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const contentType = sendData.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        response = await sendData.json();
      } else {
        response = await sendData.text();
      }
      if (sendData.ok) {
        console.log("Server responded with: ", response);
      } else {
        console.log("Server threw an error", response);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    setCheckingOut(false);
    return response;
  }
  async function callCheckoutData() {
    const getAll = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getEverythingForThatUser/",
      {
        credentials: "include",
      },
    );
    const contentType = getAll.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      getAllresult = await getAll.json();
    } else {
      getAllresult = await getAll.text();
    }
    sessionStorage.setItem("CheckoutData", JSON.stringify(getAllresult));
  }
  async function render() {
    try {
      const tryToPullCheckoutDataFromLocal = JSON.parse(
        sessionStorage.getItem("CheckoutData"),
      );
      if (Object.keys(tryToPullCheckoutDataFromLocal).length !== 0) {
        CheckoutData = tryToPullCheckoutDataFromLocal;
      }
    } catch {
      if (CheckoutData == null) {
        await callCheckoutData();
      }
    }
    let max = 0;
    for (const key of Object.keys(CheckoutData)) {
      const dict = CheckoutData[key];
      const lengthofDict = Object.keys(dict).length;
      if (lengthofDict > max) {
        max = lengthofDict;
      }
    }
    let renderingData = [];
    setRows(max * 3 + 2);
    const keys = Object.keys(CheckoutData);
    const usernameKey = Object.keys(CheckoutData)[0];
    const userData = CheckoutData[usernameKey];
    const priceData = userData["TotalPrice"];
    console.log(
      "keys: ",
      keys,
      "usernameKey: ",
      usernameKey,
      "userData: ",
      userData,
      "priceData",
      priceData,
    );

    renderingData.push(<div key={`User-${usernameKey}-0`}>{usernameKey}</div>);
    Object.entries(userData).forEach(([key2, value2], j) => {
      if (j < Object.keys(userData).length - 1) {
        renderingData.push(
          <div style={{ gridColumn: "1" }} key={`BowlName-${key2}-${j}`}>
            {key2}
          </div>,
        );
        renderingData.push(
          <div style={{ gridColumn: "2" }} key={`NoOfBowls-${key2}-${j}`}>
            Number of bowls: {value2["NumberofBowls"]}
          </div>,
        );
        renderingData.push(
          <div style={{ gridColumn: "3" }} key={`Price-${key2}-${j}`}>
            Price of this part of the order: {value2["Price"]}
          </div>,
        );
        renderingData.push(
          <input
            onChange={(e) => setCur(e.target.value)}
            disabled={checkingOut}
            key={`Alter-Order-${key2}-${j}`}
            type="number"
            value={value2["NumberofBowls"]}
            placeholder="Change your order quantity"
            style={{ gridColumn: "1 / 2" }}
          ></input>,
        );
        renderingData.push(
          <button
            onClick={() =>
              update(cur, value2["NumberofBowls"], value2["Price"], key2)
            }
            disabled={checkingOut}
            key={`Alter-Order-Confirm-Button-${key2}-${j}`}
            type="button"
            style={{ gridColumn: "2 / 3" }}
          >
            Click to confirm
          </button>,
        );
        renderingData.push(
          <div
            key={`Space-${key2}-${j}`}
            style={{ gridColumn: "1 / -1", height: "20px" }}
          ></div>,
        );
      }
    });
    console.log(priceData);
    renderingData.push(
      <div key={`BasketPrice-User-${usernameKey}-0`}>
        Basket total: {priceData}
      </div>,
    );
    setAllData(renderingData);
  }
  useEffect(() => {
    if (intialRun.current) {
      intialRun.current = false;
      render();
    }
  });
  return (
    <>
      <div
        id="grid"
        style={{
          display: "grid",
          gridTemplateRows: Array(rows).fill("1fr").join(" "),
          gridTemplateColumns: "1fr 1fr 1fr",
          rowGap: "50px",
        }}
      >
        {allData}
      </div>
    </>
  );
}

export default MainCheckout;
