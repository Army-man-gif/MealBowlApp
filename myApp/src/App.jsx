import Bowl from "./Bowl.jsx";
import "./Bowl.css";
function App() {
  return (
    <>
      <div className="flex">
        <Bowl css="reSize" />
        <Bowl css="reSize red" />
        <Bowl css="reSize blue" />
        <Bowl css="reSize green" />
      </div>
    </>
  );
}

export default App;
