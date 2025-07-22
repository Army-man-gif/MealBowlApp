import BowlImage from "./BowlImage.jsx";
import "./HomePage.css?v=5";
import { useState, useRef } from "react";
function RenderBowls() {
  const [contactClicked, setcontactClicked] = useState(false);
  const [loginClicked, setloginClicked] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [enteredUsername, setenteredUsername] = useState("");
  const [enteredPassowrd, setenteredPassowrd] = useState("");
  const [validLogin, setValidLogin] = useState(false);
  const userRef = useRef("");
  const passRef = useRef("");

  function set() {
    const data = { username: enteredUsername, password: enteredPassowrd };
    const dataStringified = JSON.stringify(data);
    localStorage.setItem("Details", dataStringified);
    userRef.current.value = "";
    passRef.current.value = "";
    setloginClicked(false);
  }
  function verify() {
    if (username === enteredUsername && password === enteredPassowrd) {
      userRef.current.value = "";
      passRef.current.value = "";
      setValidLogin(true);
    } else {
      userRef.current.value = "Incorrect details";
      passRef.current.value = "";
      console.log("Username: " + username + " Password: " + password);
      setValidLogin(false);
    }
  }
  function pressed(param) {
    if (param === "contact") {
      setcontactClicked(!contactClicked);
    }
    if (param === "login") {
      setloginClicked(!loginClicked);
      const use = JSON.parse(localStorage.getItem("Details")).username;
      const pass = JSON.parse(localStorage.getItem("Details")).password;
      setusername(use ? use : "");
      setpassword(pass ? pass : "");
    }
  }

  return (
    <>
      <h1 className="center">Tasty and healthy food bowls</h1>
      <h3 className="center caption">
        Fuel your body with delicious healthy food delivered right to you
      </h3>
      <a href="#Bowls" className="center link">
        Explore bowls
      </a>
      <br></br>
      <div className="center">
        <div className="flexedLogin">
          <h2 onClick={() => pressed("login")} className="clickable">
            Login/Sign up
          </h2>
          {loginClicked &&
            (localStorage.getItem("Details") ? (
              <>
                <br></br>
                <label htmlFor="username">Enter username: </label>
                <input
                  ref={userRef}
                  id="username"
                  type="text"
                  onChange={(e) => setenteredUsername(e.target.value)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  ref={passRef}
                  id="password"
                  type="password"
                  onChange={(e) => setenteredPassowrd(e.target.value)}
                />
                <button type="button" onClick={verify}>
                  Login
                </button>
              </>
            ) : (
              <>
                <br></br>
                <label htmlFor="username">Enter username: </label>
                <input
                  ref={userRef}
                  id="username"
                  type="text"
                  onChange={(e) => setenteredUsername(e.target.value)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  ref={passRef}
                  id="password"
                  type="text"
                  onChange={(e) => setenteredPassowrd(e.target.value)}
                />
                <button type="button" onClick={set}>
                  Signup
                </button>
              </>
            ))}
        </div>
        <div className="push">
          <h2 onClick={() => pressed("contact")} className="clickable">
            📞 Contact us{" "}
          </h2>
          {contactClicked && (
            <div className="pushChildAlign">
              <p>Owner: Jyoti Sharma</p>
              <p>Email: gobbledygook@gmail.com</p>
              <p>Phone number: 05406405640606</p>
            </div>
          )}
        </div>
      </div>
      <div id="Bowls" className="flex">
        <BowlImage name="Paneer Power Bowl" />
        <BowlImage css="red" name="Chicken Tikka Macro Bowl" />
        <BowlImage css="blue" name="Soya Chunk High-Protein Bowl" />
        <BowlImage css="green" name="Fish & Veggie Grain Bowl" />
        <BowlImage css="orange" name="Egg Bhurji Nutrition Bowl" />
        <BowlImage css="yellow" name="Rajma Superfood Bowl" />
        <BowlImage css="purple" name="Tofu Stir-Fry Bowl" />
        <BowlImage css="pink" name="Eggless Bhurji & Oats Bowl" />
      </div>
    </>
  );
}

export default RenderBowls;
