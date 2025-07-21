import BowlImage from "./BowlImage.jsx";
import "./BowlImage.css";
import "./HomePage.css";
function RenderBowls() {
  return (
    <>
      <h1 className="center">Tasty and healthy food bowls</h1>
      <h3 className="center caption">
        Fuel your body with delicious healthy food delivered right to you
      </h3>
      <a href="#Bowls" className="center link">
        Explore bowls
      </a>
      <div className="push">
        <h2>Contact us: </h2>
        <div className="pushChildAlign">
          <p>Owner: Jyoti Sharma</p>
          <p>Email: gobbledygook@gmail.com</p>
          <p>Phone number: 05406405640606</p>
        </div>
      </div>
      <div id="Bowls" className="flex">
        <BowlImage css="reSize" />
        <BowlImage css="reSize red" />
        <BowlImage css="reSize blue" />
        <BowlImage css="reSize green" />
      </div>
    </>
  );
}

export default RenderBowls;
