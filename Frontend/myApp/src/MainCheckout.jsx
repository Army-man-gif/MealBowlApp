import { useState, useEffect } from "react";

function MainCheckout() {
  const [allData, setAllData] = useState([]);
  const [rows, setRows] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);
  async function callCheckoutData() {}
  async function render() {
    let CheckoutData = null;
    const tryToPullCheckoutDataFromLocal = JSON.parse(
      sessionStorage.getItem("CheckoutData"),
    );
    if (Object.keys(tryToPullCheckoutDataFromLocal).length !== 0) {
      CheckoutData = tryToPullCheckoutDataFromLocal;
    }
    if (CheckoutData == null) {
      await callCheckoutData();
    }
    console.log(tryToPullCheckoutDataFromLocal);
    let max = 0;
    const user = Object.keys(CheckoutData)[0];
    for (const key of Object.keys(CheckoutData)) {
      const dict = CheckoutData[key];
      const lengthofDict = Object.keys(dict).length;
      if (lengthofDict > max) {
        max = lengthofDict;
      }
    }
    let renderingData = [];
    setRows(max * 3 + 2);
    const outsideDict = Object.entries(CheckoutData)[0];
    renderingData.push(
      <div key={`User-${outsideDict[0]}-0`}>{outsideDict[0]}</div>,
    );
    Object.entries(outsideDict[1]).forEach(([key2, value2], j) => {
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
          disabled={checkingOut}
          key={`Alter-Order-Confirm-Button-${key2}-${j}`}
          type="button"
        ></button>,
      );
      renderingData.push(
        <div
          key={`Space-${key2}-${j}`}
          style={{ gridColumn: "1 / -1", height: "20px" }}
        ></div>,
      );
    });
    renderingData.push(
      <div key={`BasketPrice-User-${outsideDict[0]}-0`}>
        Basket total: {CheckoutData[outsideDict[0]]["price"]}
      </div>,
    );
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
