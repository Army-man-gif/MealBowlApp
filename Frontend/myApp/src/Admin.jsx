import { useEffect } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";

function AdminPage() {
  async function render() {
    const getAll = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getEverything/",
      {
        credentials: "include",
      },
    );
    const getPrice = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getPrice/",
      {
        credentials: "include",
      },
    );
    const contentType = getAll.headers.get("content-type");
    const contentType2 = getPrice.headers.get("content-type");
    let getAllresult;
    let getPriceresult;
    if (contentType && contentType.includes("application/json")) {
      getAllresult = await getAll.json();
    } else {
      getAllresult = await getAll.text();
    }
    if (contentType2 && contentType2.includes("application/json")) {
      getPriceresult = await getPrice.json();
    } else {
      getPriceresult = await getPrice.text();
    }
    let max = 0;
    for (const key of Object.keys(getAllresult)) {
      const dict = getAllresult[key];
      const lengthofDict = Object.keys(dict).length;
      if (lengthofDict > max) {
        max = lengthofDict;
      }
    }
    console.log(getPriceresult.price);
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
    for (let i = 0; i < numRows; i++) {
      const div = document.createElement("div");
      div.textContent = `Item ${i + 1}`;
      div.style.border = "1px solid black";
      div.style.padding = "10px";
      grid.appendChild(div);
    }
  }
  useEffect(() => {
    render();
  }, []);

  return (
    <>
      <div id="grid"></div>
    </>
  );
}

export default AdminPage;
