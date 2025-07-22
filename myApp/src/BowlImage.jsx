import "./BowlImage.css";
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
          <img src="assets/bowl.png" alt="𓎩" width="200" height="200"></img>
        </Link>
        <p className="bowlText">{props.name}</p>
      </div>
    </>
  );
}

export default BowlImage;

//
