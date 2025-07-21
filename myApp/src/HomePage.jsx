import BowlImage from "./BowlImage.jsx";
import "./HomePage.css";
import { useState } from "react";
function RenderBowls() {
  const [clicked, setClicked] = useState(false);
  function pressed() {
    setClicked(!clicked);
  }
  return (
    <>
      <h1 className="center">Tasty and healthy food bowls</h1>
      <h3 className="center caption">
        Fuel your body with delicious healthy food delivered right to you
      </h3>
      <a href="#Bowls" className="center link">
        Explore bowls
      </a>
      <br></br>
      <div className="push">
        <h2 onClick={pressed} className="clickable">
          Contact us:{" "}
        </h2>
        {clicked && (
          <div className="pushChildAlign">
            <p>Owner: Jyoti Sharma</p>
            <p>Email: gobbledygook@gmail.com</p>
            <p>Phone number: 05406405640606</p>
          </div>
        )}
      </div>
      <div id="Bowls" className="flex">
        <BowlImage />
        <BowlImage css="red" />
        <BowlImage css="blue" />
        <BowlImage css="green" />
      </div>
    </>
  );
}

export default RenderBowls;
