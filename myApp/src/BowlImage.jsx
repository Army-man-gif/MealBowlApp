import "./BowlImage.css";
import picture from "./assets/bowl.png";
import { Link } from "react-router-dom";
function BowlImage(props) {
  const color = props.css ? { color: props.css } : {};
  const bowlID = props.name
    .split("")
    .map((char) => (char === " " ? "-" : char))
    .join("");
  return (
    <>
      <div className={"item"}>
        <Link to={`/contents/${bowlID}`} style={color} className="bowl reSize">
          <img src={picture} alt="𓎩" className="bowlImageDimensions"></img>
        </Link>
        <p className="bowlText">
          {props.name}
          <br></br>
          "Price: "{props.price}
        </p>
      </div>
    </>
  );
}

export default BowlImage;

//
