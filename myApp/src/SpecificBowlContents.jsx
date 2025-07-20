import "./Specific.css";
function Contents(props) {
  return (
    <>
      {props.contents.map((value, index) => (
        <p className="moveAndAdjust">{value}</p>
      ))}
    </>
  );
}

export default Contents;
