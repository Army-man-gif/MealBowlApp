import { useEffect } from "react";
import { setCookie, getCookieFromBrowser } from "./auth.js";

function AdminPage() {
  useEffect(() => {
    const fetchAll = async () => {
      const getAll = await fetch(
        "https://mealbowlapp.onrender.com/databaseTesting/getEverything/",
        {
          credentials: "include",
        },
      );
      const contentType = getAll.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await getAll.json();
      } else {
        result = await getAll.text();
      }
      console.log(result);
    };
    fetchAll();
  }, []);

  return (
    <>
      <div>Hi</div>
    </>
  );
}

export default AdminPage;

/*
<div id="grid"></div>

<script>
const grid = document.getElementById("grid");

// Number of columns
const numCols = 4;

// Option 1: All 1fr
const useDefault = true;

// Option 2: Custom fractions
const customFractions = ["1fr", "2fr", "1fr", "3fr"];

// Decide which to use
const columnFractions = useDefault
  ? Array(numCols).fill("1fr")
  : customFractions;

// Apply CSS Grid
grid.style.display = "grid";
grid.style.gridTemplateColumns = columnFractions.join(" ");
grid.style.gap = "10px"; // optional spacing

// Add some items for demonstration
for (let i = 0; i < numCols; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i + 1}`;
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  grid.appendChild(div);
}
</script>
*/
