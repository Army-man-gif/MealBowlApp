import "./BowlImage.css";
import { Link } from "react-router-dom";
function BowlImage(props) {
  return (
    <Link to="/contents" className={`bowl item reSize ${props.css}`}>
      𓎩
    </Link>
  );
}

export default BowlImage;
