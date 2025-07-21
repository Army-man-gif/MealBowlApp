import "./BowlImage.css";
import { Link } from "react-router-dom";
function BowlImage(props) {
  const color = props.css ? { color: props.css } : {};
  return (
    <Link to="/contents" className={"bowl item reSize"} style={color}>
      𓎩
    </Link>
  );
}

export default BowlImage;
