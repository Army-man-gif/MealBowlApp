import RenderBowls from "./HomePage.jsx";
import Contents from "./SpecificBowlContents.jsx";
import AdminPage from "./Admin.jsx";
import "./globalStyles.css";
import "./variables.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const basename = import.meta.env.DEV ? "/" : "/MealBowlApp/docs";
function App() {
  return (
    <>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<RenderBowls />} />
          <Route path="/contents/:bowlID" element={<Contents />} />
          <Route path="/Admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

/*
Banner in space between login/sinup buton and contact us buttons and bowls
Different pics for different bowls
Background of veggies
Delivery system 
Basket system
Admin page
Use layout of sites mum said to get my design better
*/
