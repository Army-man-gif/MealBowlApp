import BowlImage from "./BowlImage.jsx";
import "./HomePage.css";
import { useState, useRef } from "react";
import bowl2 from "./assets/bowl2.jpg";
import bowl3 from "./assets/bowl3.jpg";
import bowl4 from "./assets/bowl4.jpg";
import bowl5 from "./assets/bowl5.jpg";
import bowl6 from "./assets/bowl6.jpg";
import bowl7 from "./assets/bowl7.jpg";
import bowl8 from "./assets/bowl8.jpg";
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
      <div className="banner">
        <p className="stuff">Tasty and healthy food bowls</p>
        <p className="caption">
          Fuel your body with delicious healthy food delivered right to you
        </p>
      </div>
      <p className="caption captionSecond">
        Do you want to want to be healthy, fit and energetic? Are you dieting
        and struggling to find time to make healthy, balanced <br></br> meals?
        Do you need a nourishing office lunch box? Eating well doesn't have to
        mean bland food. Jyoti's superbowls brings <br></br> you balanced meals,
        with lots of options, all bursting with flavours
      </p>
      <div className="container">
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
                  className="rounded"
                  ref={userRef}
                  id="username"
                  type="text"
                  onChange={(e) => setenteredUsername(e.target.value)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  className="rounded"
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
                  className="rounded"
                  ref={userRef}
                  id="username"
                  type="text"
                  onChange={(e) => setenteredUsername(e.target.value)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  className="rounded"
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
      <a href="#Bowls" className="center link">
        {" "}
        Explore bowls{" "}
      </a>
      <div id="Bowls" className="flex">
        <BowlImage name="Paneer Power Bowl" price="₹ 300" picture={bowl2} />
        <BowlImage
          css="red"
          name="Chicken Tikka Macro Bowl"
          price="₹ 500"
          picture={bowl2}
        />
        <BowlImage
          css="blue"
          name="Soya Chunk High-Protein Bowl"
          price="₹ 200"
          picture={bowl3}
        />
        <BowlImage
          css="green"
          name="Fish & Veggie Grain Bowl"
          price="₹ 300"
          picture={bowl4}
        />
        <BowlImage
          css="orange"
          name="Egg Bhurji Nutrition Bowl"
          price="₹ 700"
          picture={bowl5}
        />
        <BowlImage
          css="yellow"
          name="Rajma Superfood Bowl"
          price="₹ 600"
          picture={bowl6}
        />
        <BowlImage
          css="purple"
          name="Tofu Stir-Fry Bowl"
          price="₹ 400"
          picture={bowl7}
        />
        <BowlImage
          css="pink"
          name="Eggless Bhurji & Oats Bowl"
          price="₹ 800"
          picture={bowl8}
        />
      </div>
    </>
  );
}

export default RenderBowls;
