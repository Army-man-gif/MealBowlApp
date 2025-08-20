import RenderBowls from "./HomePage.jsx";
import Contents from "./SpecificBowlContents.jsx";
import MainCheckout from "./MainCheckout.jsx";
import AdminPage from "./Admin.jsx";

import "./globalStyles.css";
import "./variables.css";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const basename = import.meta.env.DEV ? "/" : "/MealBowlApp/docs";
import { useState } from "react";

function App() {
  async function callCheckoutData() {
    const getAll = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getEverythingForThatUser/",
      {
        credentials: "include",
      },
    );
    const contentType = getAll.headers.get("content-type");
    let getAllresult;
    if (contentType && contentType.includes("application/json")) {
      getAllresult = await getAll.json();
    } else {
      getAllresult = await getAll.text();
    }
    if (
      getAll.ok &&
      getAllresult &&
      !getAllresult.error &&
      Object.keys(getAllresult).length !== 0
    ) {
      sessionStorage.setItem("CheckoutData", JSON.stringify(getAllresult));
    }
  }
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
    if (
      getAll.ok &&
      getAllresult &&
      !getAllresult.error &&
      Object.keys(getAllresult).length !== 0
    ) {
      sessionStorage.setItem("AdminData", JSON.stringify(getAllresult));
    }
    if (
      getPrices.ok &&
      getPricesresult &&
      !getPricesresult.error &&
      Object.keys(getAllresult).length !== 0
    ) {
      sessionStorage.setItem("AdminPriceData", JSON.stringify(getPricesresult));
    }
  }
  const [somethingChangedinLogin, setsomethingChangedinLogin] = useState(0);
  const [reShowSave, setreShowSave] = useState(0);
  async function saveChanges() {
    await callCheckoutData();
    await callAdminData();
  }
  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route
            path="/"
            element={
              <RenderBowls
                somethingChangedinLogin={somethingChangedinLogin}
                setsomethingChangedinLogin={setsomethingChangedinLogin}
                saveChanges={saveChanges}
                reShowSave={reShowSave}
                setreShowSave={setreShowSave}
              />
            }
          />
          <Route
            path="/contents/:bowlID"
            element={
              <Contents
                somethingChangedinLogin={somethingChangedinLogin}
                setsomethingChangedinLogin={setsomethingChangedinLogin}
                saveChanges={saveChanges}
                reShowSave={reShowSave}
                setreShowSave={setreShowSave}
              />
            }
          />
          <Route path="/Admin" element={<AdminPage />} />
          <Route
            path="/checkout"
            element={
              <MainCheckout
                somethingChangedinLogin={somethingChangedinLogin}
                setsomethingChangedinLogin={setsomethingChangedinLogin}
                saveChanges={saveChanges}
                reShowSave={reShowSave}
                setreShowSave={setreShowSave}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
