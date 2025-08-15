import { useEffect, useState } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";

function AdminPage() {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  async function render() {
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
    let getAllresult;
    let getPricesresult;
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
          <div style={{ gridColumn: "1" }} key={`BowlName-${key2}-${j}`}>
            {key2}
          </div>,
        );
        renderingData.push(
          <div style={{ gridColumn: "1" }} key={`NoOfBowls-${key2}-${j}`}>
            Number of bowls: {value2["NumberofBowls"]}
          </div>,
        );
        renderingData.push(
          <div style={{ gridColumn: "1" }} key={`Price-${key2}-${j}`}>
            Price of this part of the order: {value2["Price"]}
          </div>,
        );
        renderingData.push(
          <div
            key={`Space-${key2}-${j}`}
            style={{ gridColumn: "1 / -1", height: "20px" }}
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
    /*
    const grid = document.getElementById("grid");

    // Number of columns
    const numRows = 4;

    // Option 1: All 1fr
    const useDefault = false;

    // Option 2: Custom fractions
    const customFractions = ["1fr", "2fr", "1fr", "3fr"];

    // Decide which to use
    const rowFractions = useDefault
      ? Array(numRows).fill("1fr")
      : customFractions;

    // Apply CSS Grid
    grid.style.display = "grid";
    grid.style.gridTemplateRows = rowFractions.join(" ");
    grid.style.rowGap = "50px";

    // Add some items for demonstration
    for (let i = 0; i < numRows*2; i++) {
      const div = document.createElement("div");
      div.textContent = `Item ${i + 1}`;
      div.style.border = "1px solid black";
      div.style.padding = "10px";
      grid.appendChild(div);
    }
    */
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
