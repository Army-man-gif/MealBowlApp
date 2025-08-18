import { useState, useEffect } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";
import React from "react";
function MainCheckout({ somethingChanged, setsomethingChanged }) {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cur, setCur] = useState({});
  const [userData, setUserData] = useState({});
  let getAllresult = null;
  let CheckoutData = null;
  function updateCur(e) {
    let { name, value } = e.target;
    setCur((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function update(changedValue, originalValue, bowlPrice, bowlName) {
    setCheckingOut(true);
    changedValue = Number(changedValue ?? 0);
    originalValue = Number(originalValue ?? 0);
    let totalData;
    if (changedValue > originalValue) {
      totalData = {
        numberofBowls: changedValue - originalValue,
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
    } else if (changedValue > 0 && changedValue < originalValue) {
      totalData = {
        numberofBowls: changedValue - originalValue,
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
      totalData = {
        numberofBowls: originalValue,
        bowlName: bowlName,
        bowlTotal: bowlPrice,
      };
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/updateBasketForDeletedOrder/",
        totalData,
      );
      await add(
        "https://mealbowlapp.onrender.com/databaseTesting/deleteOrder/",
        totalData,
      );
      setsomethingChanged((prev) => prev + 1);
    }
    setCheckingOut(true);
  }
  async function add(url, data) {
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
    sessionStorage.setItem("CheckoutData", JSON.stringify(getAllresult) ?? "");
  }
  useEffect(() => {
    async function fetchData() {
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
      setRows(max * 3 + 2);
      const usernameKey = Object.keys(CheckoutData)[0];
      const userData = CheckoutData[usernameKey];
      setUserData(userData);
      const initialCur = {};
      Object.entries(userData).forEach(([key2, value2]) => {
        if (key2 !== "TotalPrice") {
          initialCur[key2] = value2["NumberofBowls"];
        }
      });
      setCur(initialCur);
    }
    fetchData();
  }, []);
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
        {/* Show username */}
        {Object.keys(userData).length > 0 && (
          <div>{Object.keys(CheckoutData ?? {})[0]}</div>
        )}

        {Object.entries(userData).map(([key2, value2], j) =>
          key2 !== "TotalPrice" ? (
            <React.Fragment key={key2}>
              <div style={{ gridColumn: "1" }}>{key2}</div>
              <div style={{ gridColumn: "2" }}>
                Number of bowls: {value2["NumberofBowls"]}
              </div>
              <div style={{ gridColumn: "3" }}>
                Price of this part of the order: {value2["Price"]}
              </div>

              {/* ✅ Now input stays in sync */}
              <input
                onChange={updateCur}
                //disabled={checkingOut}
                name={key2}
                hidden={true}
                disabled={true}
                type="number"
                value={cur[key2] ?? ""}
                placeholder="Change your order quantity"
                style={{ gridColumn: "1 / 2" }}
              />

              <button
                onClick={() =>
                  update(
                    cur[key2] ?? "",
                    value2["NumberofBowls"],
                    value2["Price"] / value2["NumberofBowls"],
                    key2,
                  )
                }
                hidden={true}
                disabled={checkingOut}
                type="button"
                style={{ gridColumn: "2 / 3" }}
              >
                Click to confirm
              </button>

              <div style={{ gridColumn: "1 / -1", height: "20px" }}></div>
            </React.Fragment>
          ) : null,
        )}
        {"TotalPrice" in userData && (
          <div>Basket total: {userData["TotalPrice"]}</div>
        )}
      </div>
    </>
  );
}

export default MainCheckout;
