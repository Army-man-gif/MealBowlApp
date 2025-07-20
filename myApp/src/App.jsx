import RenderBowls from "./BowlImgRendering";
import Contents from "./SpecificBowlContents.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter basename="/MealBowlApp/Build_files">
        <Routes>
          <Route path="/" element={<RenderBowls />} />
          <Route
            path="/contents"
            element={
              <Contents contents={["Chicken curry", "Legumes", "Fruit"]} />
            }
          />
          <Route />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
