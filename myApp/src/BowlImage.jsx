import "./BowlImage.css";
import { Link } from "react-router-dom";
function BowlImage(props) {
  const color = props.css ? { color: props.css } : {};
  return (
    <>
      <div className={"item"}>
        <Link to="/contents" style={color} className="bowl reSize">
          𓎩
        </Link>
        <p className="bowlText">{props.name}</p>
      </div>
    </>
  );
}

export default BowlImage;
