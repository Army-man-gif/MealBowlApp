import { useEffect, useState } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";

function AdminPage() {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  let getAllresult = null;
  let getPricesresult = null;
  async function callAdminData() {
    const getAll = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getEverything/",
      {
        credentials: "include",
      },
    );
    const getPrices = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getPrices/",
      {
        credentials: "include",
      },
    );
    const contentType = getAll.headers.get("content-type");
    const contentType2 = getPrices.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      getAllresult = await getAll.json();
    } else {
      getAllresult = await getAll.text();
    }
    if (contentType2 && contentType2.includes("application/json")) {
      getPricesresult = await getPrices.json();
    } else {
      getPricesresult = await getPrices.text();
    }
    sessionStorage.setItem("AdminData", JSON.stringify(getAllresult));
    sessionStorage.setItem("AdminPriceData", JSON.stringify(getPricesresult));
  }
  async function render() {
    const tryToPullAdminDataFromLocal = JSON.parse(
      sessionStorage.getItem("AdminData"),
    );
    const tryToPullPriceDataFromLocal = JSON.parse(
      sessionStorage.getItem("AdminPriceData"),
    );
    if (Object.keys(tryToPullAdminDataFromLocal).length !== 0) {
      getAllresult = tryToPullAdminDataFromLocal;
    }
    if (Object.keys(tryToPullPriceDataFromLocal).length !== 0) {
      getPricesresult = tryToPullPriceDataFromLocal;
    }
    if (getAllresult == null || getPricesresult == null) {
      await callAdminData();
    }
    let max = 0;
    const users = Object.keys(getAllresult).length;
    for (const key of Object.keys(getAllresult)) {
      const dict = getAllresult[key];
      const lengthofDict = Object.keys(dict).length;
      if (lengthofDict > max) {
        max = lengthofDict;
      }
    }
    let renderingData = [];
    setRows(max * 3 + users);
    Object.entries(getAllresult).forEach(([key, value], i) => {
      renderingData.push(<div key={`User-${key}-${i}`}>{key}</div>);
      Object.entries(value).forEach(([key2, value2], j) => {
        renderingData.push(
          <div
            style={{ gridColumn: "1", position: "relative", left: "50%" }}
            key={`BowlName-${key}-${key2}-${j}`}
          >
            {key2}
          </div>,
        );
        renderingData.push(
          <div
            style={{ gridColumn: "1", position: "relative", left: "50%" }}
            key={`NoOfBowls-${key}-${key2}-${j}`}
          >
            Number of bowls: {value2["NumberofBowls"]}
          </div>,
        );
        renderingData.push(
          <div
            style={{ gridColumn: "1", position: "relative", left: "50%" }}
            key={`Price-${key}-${key2}-${j}`}
          >
            Price of this part of the order: {value2["Price"]}
          </div>,
        );
        renderingData.push(
          <div
            key={`Space-${key}-${key2}-${j}`}
            style={{
              gridColumn: "1 / -1",
              height: "20px",
              position: "relative",
              left: "50%",
            }}
          ></div>,
        );
      });
      renderingData.push(
        <div key={`BasketPrice-User-${key}-${i}`}>
          Basket total: {getPricesresult[key]["price"]}
        </div>,
      );
      if (i !== Object.keys(getAllresult).length - 1) {
        renderingData.push(
          <hr
            key={`HorizontalLine-${key}-${i}`}
            style={{
              gridColumn: "1 / -1", // remove this line and put width: x% for non full screen line
              border: "none",
              borderTop: "1px solid red",
              height: "1px",
              margin: "10px 0",
            }}
          />,
        );
      }
    });
    setAllData(renderingData);
  }
  useEffect(() => {
    render();
  }, []);

  return (
    <>
      <div
        id="grid"
        style={{
          display: "grid",
          gridTemplateRows: Array(rows).fill("1fr").join(" "),
          gridTemplateColumns: "1fr 3fr",
          rowGap: "50px",
        }}
      >
        {allData}
      </div>
    </>
  );
}

export default AdminPage;
