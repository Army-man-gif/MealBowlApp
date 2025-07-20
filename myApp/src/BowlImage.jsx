import "./BowlImage.css";
import { Link } from "react-router-dom";
function BowlImage(props) {
  return (
    <Link to="/contents" className={`bowl ${props.css}`}>
      🥣
    </Link>
  );
}

export default BowlImage;
//𓎩
