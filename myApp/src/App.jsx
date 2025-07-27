import RenderBowls from "./HomePage.jsx";
import Contents from "./SpecificBowlContents.jsx";
import "./globalStyles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter basename="/MealBowlApp/docs">
        <Routes>
          <Route path="/" element={<RenderBowls />} />
          <Route path="/contents/:bowlID" element={<Contents />} />
          <Route />
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
