import BowlStyles from "./BowlImage.module.css";
import { Link } from "react-router-dom";
function BowlImage(props) {
  const color = props.css ? { color: props.css } : {};
  const bowlID = props.name
    .split("")
    .map((char) => (char === " " ? "-" : char))
    .join("");
  return (
    <>
      <div className={BowlStyles.item}>
        <Link
          to={`/contents/${bowlID}`}
          style={color}
          className={`${BowlStyles.bowl} ${BowlStyles.reSize}`}
        >
          <img
            src={props.picture}
            alt="𓎩"
            className={BowlStyles.bowlImageDimensions}
          ></img>
        </Link>
        <p className={BowlStyles.bowlText}>
          {props.name}
          <br></br>
          Price: {props.price}
        </p>
      </div>
    </>
  );
}

export default BowlImage;

//
