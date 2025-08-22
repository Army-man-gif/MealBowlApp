import { useState, useEffect, useRef } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";
import React from "react";
import { data } from "react-router-dom";
function MainCheckout({
  saveChanges,
  reShowSave,
  setreShowSave,
  text,
  setText,
}) {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [cur, setCur] = useState({});
  const [userData, setUserData] = useState({});
  const [empty, setEmpty] = useState(false);
  const [CheckoutData, setCheckoutData] = useState({});
  const [trackPrice, setTrackPrice] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  async function saveClicked() {
    if (!isMounted.current) return;
    setText("Syncing changes");
    console.log("Syncing changes");
    await saveChanges();

    if (!isMounted.current) return;
    console.log("Synced changes");
    setText("Synced changes");
    setreShowSave(false);
  }

  useEffect(() => {
    if (reShowSave) {
      (async () => {
        await saveClicked();
      })();
    }
  }, [reShowSave]);
  function updateCur(e) {
    let { name, value } = e.target;
    setCur((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function update(changedValue, originalValue, bowlPrice, bowlName) {
    const dataToChange = JSON.parse(sessionStorage.getItem("CheckoutData"));
    const dataToChange2 = JSON.parse(sessionStorage.getItem("AdminData"));
    const dataToChange3 = JSON.parse(sessionStorage.getItem("AdminPriceData"));

    const userKey = Object.keys(dataToChange)[0];
    changedValue = Number(changedValue ?? 0);
    originalValue = Number(originalValue ?? 0);
    console.log(
      "Changed value: ",
      changedValue,
      "Original value: ",
      originalValue,
      "Bowl price: ",
      bowlPrice,
      "Bowl name: ",
      bowlName,
    );
    console.log(changedValue > originalValue);
    console.log(0 < changedValue < originalValue);
    console.log(changedValue === 0);
    setreShowSave((prev) => prev + 1);
    setCheckingOut(true);
    let totalData;
    if (changedValue === 0) {
      delete dataToChange[userKey][bowlName];
      delete dataToChange2[userKey][bowlName];
      delete dataToChange3[userKey];
      sessionStorage.setItem("CheckoutData", JSON.stringify(dataToChange));
      sessionStorage.setItem("AdminData", JSON.stringify(dataToChange2));
      sessionStorage.setItem("AdminPriceData", JSON.stringify(dataToChange3));

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
      setreShowSave(true);
    }
    if (changedValue > originalValue) {
      dataToChange[userKey][bowlName]["NumberofBowls"] = changedValue;
      dataToChange2[userKey][bowlName]["NumberofBowls"] = changedValue;
      dataToChange3[userKey]["price"] =
        parseFloat(changedValue) * parseFloat(bowlPrice);
      sessionStorage.setItem("CheckoutData", JSON.stringify(dataToChange));
      sessionStorage.setItem("AdminData", JSON.stringify(dataToChange2));
      sessionStorage.setItem("AdminPriceData", JSON.stringify(dataToChange3));

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
      setreShowSave(true);
    } else if (0 < changedValue < originalValue) {
      dataToChange[userKey][bowlName]["NumberofBowls"] = changedValue;
      dataToChange2[userKey][bowlName]["NumberofBowls"] = changedValue;
      dataToChange3[userKey]["price"] =
        parseFloat(changedValue) * parseFloat(bowlPrice);
      sessionStorage.setItem("CheckoutData", JSON.stringify(dataToChange));
      sessionStorage.setItem("AdminData", JSON.stringify(dataToChange2));
      sessionStorage.setItem("AdminPriceData", JSON.stringify(dataToChange3));
      sessionStorage.setItem("CheckoutData", JSON.stringify(dataToChange));
      console.log(changedValue - originalValue);
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
      setreShowSave(true);
    }
    setCheckingOut(false);
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
  useEffect(() => {
    let emptyLocal = false;
    let tryToPullCheckoutDataFromLocal = null;
    setEmpty(false);
    async function fetchData() {
      try {
        tryToPullCheckoutDataFromLocal =
          JSON.parse(sessionStorage.getItem("CheckoutData")) ?? {};
        if (
          tryToPullCheckoutDataFromLocal &&
          Object.keys(tryToPullCheckoutDataFromLocal).length !== 0
        ) {
          setCheckoutData(tryToPullCheckoutDataFromLocal);
        } else {
          emptyLocal = true;
          setEmpty(true);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      if (!emptyLocal) {
        let max = 0;
        for (const key of Object.keys(tryToPullCheckoutDataFromLocal)) {
          const dict = tryToPullCheckoutDataFromLocal[key];
          const lengthofDict = Object.keys(dict).length;
          if (lengthofDict > max) {
            max = lengthofDict;
          }
        }
        setRows(max * 3 + 2);
        const usernameKey = localStorage
          .getItem("MostRecentLogin")
          .replace("User-", "");
        const userDataLocal = tryToPullCheckoutDataFromLocal[usernameKey];
        setUserData(userDataLocal);
        const initialCur = {};
        Object.entries(userDataLocal).forEach(([key2, value2]) => {
          if (key2 !== "TotalPrice") {
            initialCur[key2] = value2["NumberofBowls"];
            console.log(initialCur[key2]);
          } else {
            setTrackPrice(value2);
          }
        });
        setCur(initialCur);
      } else {
        setCur({});
      }
    }
    fetchData();
  }, [reShowSave]);
  return (
    <>
      {reShowSave && <div className="syncText">{text}</div>}
      {!empty && (
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

          {Object.entries(userData).map(([key2, value2]) =>
            key2 !== "TotalPrice" ? (
              <React.Fragment key={key2}>
                <div style={{ gridColumn: "1" }}>{key2}</div>
                <div style={{ gridColumn: "2" }}>
                  Number of bowls: {cur[key2] ?? ""}
                </div>
                <div style={{ gridColumn: "3" }}>
                  Price of this part of the order: {value2["Price"]}
                </div>

                {/* ✅ Now input stays in sync */}
                <input
                  onChange={(e) => updateCur(e)}
                  //disabled={checkingOut}
                  name={key2}
                  hidden={false}
                  disabled={checkingOut}
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
                  hidden={false}
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
          <div>Basket total: {trackPrice ?? userData["TotalPrice"]}</div>
        </div>
      )}
    </>
  );
}

export default MainCheckout;
