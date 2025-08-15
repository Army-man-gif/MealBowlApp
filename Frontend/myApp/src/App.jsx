import RenderBowls from "./HomePage.jsx";
import Contents from "./SpecificBowlContents.jsx";
import AdminPage from "./Admin.jsx";
import "./globalStyles.css";
import "./variables.css";
import { LoginContext } from "./LoginContext";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const basename = import.meta.env.DEV ? "/" : "/MealBowlApp/docs";

function App() {
  const [registerData, setRegisterData] = useState({});
  return (
    <>
      <LoginContext.Provider value={{ registerData, setRegisterData }}>
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<RenderBowls />} />
            <Route path="/contents/:bowlID" element={<Contents />} />
            <Route path="/Admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
