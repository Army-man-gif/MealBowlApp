function Contents(props) {
  return (
    <>
      {props.contents.map((value, index) => (
        <p>{value}</p>
      ))}
    </>
  );
}

export default Contents;
