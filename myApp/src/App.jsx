import BowlImage from "./BowlImage.jsx";
import "./BowlImage.css";
function App() {
  return (
    <>
      <div className="flex">
        <BowlImage css="reSize" />
        <BowlImage css="reSize red" />
        <BowlImage css="reSize blue" />
        <BowlImage css="reSize green" />
      </div>
    </>
  );
}

export default App;
