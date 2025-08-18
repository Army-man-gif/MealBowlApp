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
  const [somethingChanged, setsomethingChanged] = useState(0);

  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route
            path="/"
            element={
              <RenderBowls
                somethingChanged={somethingChanged}
                setsomethingChanged={setsomethingChanged}
              />
            }
          />
          <Route
            path="/contents/:bowlID"
            element={
              <Contents
                somethingChanged={somethingChanged}
                setsomethingChanged={setsomethingChanged}
              />
            }
          />
          <Route path="/Admin" element={<AdminPage />} />
          <Route path="/checkout" element={<MainCheckout />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
