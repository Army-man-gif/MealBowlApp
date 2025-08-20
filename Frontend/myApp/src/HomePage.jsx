import BowlImage from "./BowlImage.jsx";
import HomepageStyles from "./HomePage.module.css";
import { useState, useEffect, useRef } from "react";
import React from "react";
import bowl from "./assets/bowl.png";
import bowl3 from "./assets/Paneer power bowl.jpg";
import bowl4 from "./assets/bowl4.jpg";
import bowl5 from "./assets/bowl5.jpg";
import bowl6 from "./assets/bowl6.jpg";
import bowl7 from "./assets/bowl7.jpg";
import bowl8 from "./assets/Rajma-Chickpea superfood bowl.jpg";
import logo from "./assets/logo.png";

import { setCookie, getCookieFromBrowser } from "./auth.js";
import { Link } from "react-router-dom";
let intialRun = true;
function RenderBowls({ setsomethingChangedinLogin, saveChanges, reShowSave }) {
  const [contactClicked, setcontactClicked] = useState(false);
  const [loginClicked, setloginClicked] = useState(false);
  const [DontSkipLogin, setDontSkipLogin] = useState(false);
  const [processing, setprocessing] = useState(false);
  const [registerData, setRegisterData] = useState({});
  const [cookieSet, setCookieSet] = useState(false);
  const [save, setSave] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("Save all changes");
  const [manualLogout, setManualLogout] = useState(false);
  const isMounted = useRef(false);

  function updateRegisterData(e, inputField) {
    if (inputField) {
      let { name, value } = e.target;
      setRegisterData((fillIn) => ({
        ...fillIn,
        [name]: value,
      }));
    } else {
      setRegisterData((fillIn) => ({
        ...fillIn,
        [e.name]: e.value,
      }));
    }
  }
  async function SendData(url, data = {}) {
    let response;
    let dataToUse;
    if (Object.keys(registerData).length !== 0) {
      dataToUse = registerData;
    } else {
      if (Object.keys(data).length !== 0) {
        dataToUse = data;
      }
    }
    console.log(dataToUse);
    let CSRFToken = await getCookieFromBrowser("csrftoken");
    if (!CSRFToken) {
      await setCookie();
      CSRFToken = await getCookieFromBrowser("csrftoken");
    }
    try {
      const sendData = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": CSRFToken,
        },
        credentials: "include",
        body: JSON.stringify(dataToUse),
      });
      const contentType = sendData.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        response = await sendData.json();
      } else {
        response = await sendData.text();
      }
      if (sendData.ok) {
        console.log("Server responded with: ", response);
        updateRegisterData({ name: "username", value: "" }, false);
        updateRegisterData({ name: "email", value: "" }, false);
        updateRegisterData({ name: "password", value: "" }, false);
        setloginClicked(false);
        sessionStorage.setItem("Logged-In", true);
      } else {
        console.log("Server threw an error", response);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    return response;
  }
  async function register() {
    setprocessing(true);
    const make = await SendData(
      "https://mealbowlapp.onrender.com/databaseTesting/createUser/",
    );
    if (make.message) {
      const loginToAccount = await SendData(
        "https://mealbowlapp.onrender.com/databaseTesting/login/",
      );
      if (loginToAccount.message) {
        localStorage.setItem(
          "User-" + registerData.username,
          JSON.stringify(registerData),
        );
        sessionStorage.setItem("Logged-In", true);
        const admin = await checkAdmin();
        setsomethingChangedinLogin((prev) => prev + 1);
        if (admin) {
          sessionStorage.setItem("admin", true);
        } else {
          sessionStorage.setItem("admin", false);
        }
      } else {
        console.log("error");
        sessionStorage.setItem("Logged-In", false);
      }
    } else {
      sessionStorage.setItem("Logged-In", false);
    }
    setprocessing(false);
  }
  async function verifyLocally() {
    let lastIndex = -1;
    for (let i = 0; i < localStorage.length; i++) {
      const Currentkey = localStorage.key(i);
      if (Currentkey.includes("User-")) {
        lastIndex = i;
      }
    }
    if (lastIndex != -1) {
      const key = localStorage.getItem("MostRecentLogin");
      const value = JSON.parse(localStorage.getItem(key));
      setRegisterData(value);
      const verification = await verifyUsingDatabase(value);
      if (verification) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  async function verifyUsingDatabase(data = {}) {
    let dataToUse;
    if (Object.keys(registerData).length !== 0) {
      dataToUse = registerData;
    } else {
      if (Object.keys(data).length !== 0) {
        dataToUse = data;
      }
    }
    setprocessing(true);
    const check = await SendData(
      "https://mealbowlapp.onrender.com/databaseTesting/login/",
      dataToUse,
    );
    if (check.message) {
      const admin = await checkAdmin();
      setsomethingChangedinLogin((prev) => prev + 1);
      if (admin) {
        sessionStorage.setItem("admin", true);
      } else {
        sessionStorage.setItem("admin", false);
      }
      setName(registerData.username);
      localStorage.setItem(
        "User-" + dataToUse.username,
        JSON.stringify(dataToUse),
      );
      setprocessing(false);
      localStorage.setItem("MostRecentLogin", "User-" + dataToUse.username);
      sessionStorage.setItem("Logged-In", true);
      await saveClicked();
      return true;
    } else {
      updateRegisterData(
        { name: "username", value: "Invalid credentials" },
        false,
      );
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      setprocessing(false);
      sessionStorage.setItem("Logged-In", false);
      setDontSkipLogin(true);
      return false;
    }
  }
  async function checkAdmin() {
    const adminCheck = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/checkUserperm/",
      {
        credentials: "include",
      },
    );
    const contentType = adminCheck.headers.get("content-type");
    let result;
    if (contentType && contentType.includes("application/json")) {
      result = await adminCheck.json();
    } else {
      result = await adminCheck.text();
    }
    if (result.admin) {
      return true;
    } else {
      return false;
    }
  }
  async function logoutfunction() {
    sessionStorage.removeItem("admin");
    const logoutCall = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/logout/",
      {
        credentials: "include",
      },
    );
    const contentType = logoutCall.headers.get("content-type");
    let result;
    if (contentType && contentType.includes("application/json")) {
      result = await logoutCall.json();
    } else {
      result = await logoutCall.text();
    }
    if (result.message) {
      setDontSkipLogin(true);
      sessionStorage.setItem("Logged-In", false);
      setManualLogout(true);
      setloginClicked(true);
      console.log(result.message);
    } else {
      sessionStorage.setItem("Logged-In", true);
      console.log(result.error);
    }
  }
  function pressed(param) {
    if (param === "contact") {
      setcontactClicked(!contactClicked);
    }
    if (param === "login") {
      setloginClicked(!loginClicked);
    }
    if (param === "logout") {
      logoutfunction();
    }
  }
  function redirectToLogin() {
    setDontSkipLogin(true);
    sessionStorage.setItem("Logged-In", false);
  }
  function redirectToRegister() {
    setDontSkipLogin(false);
    sessionStorage.setItem("Logged-In", false);
  }

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    (async () => {
      const flag = JSON.parse(sessionStorage.getItem("Logged-In")) ?? false;
      if (!flag && !manualLogout) {
        await setCookie();
        setCookieSet(true);
        const ver = await verifyLocally();
        console.log(ver);
        if (ver) {
          sessionStorage.setItem("Logged-In", true);
        } else {
          sessionStorage.setItem("Logged-In", false);
        }
      } else if (flag && !manualLogout) {
        (async () => {
          await saveClicked();
        })();
        console.log("Here");
        const admin = await checkAdmin();
        if (admin) {
          sessionStorage.setItem("admin", true);
          setsomethingChangedinLogin((prev) => prev + 1);
        } else {
          sessionStorage.setItem("admin", false);
          setsomethingChangedinLogin((prev) => prev + 1);
        }
      }
    })();
  }, []);

  async function saveClicked() {
    if (!isMounted.current) return;

    setText("Saving changes");
    await saveChanges();

    if (!isMounted.current) return;

    setSave(false);
    setText("Saving changes");
  }
  useEffect(() => {
    if (!intialRun) {
      setSave(true);
    }
  }, [reShowSave]);
  return (
    <>
      {save && <button onClick={saveClicked}>{text}</button>}

      <div className={HomepageStyles.banner}>
        <img src={logo} className={HomepageStyles.Logo} />
        <p className={HomepageStyles.logoText}>JS</p>
        <p className={HomepageStyles.slogan}>Tasty and healthy food bowls</p>
        <p className={HomepageStyles.caption}>
          Fuel your body with delicious healthy food delivered right to you
        </p>
      </div>
      <p
        className={`${HomepageStyles.caption} ${HomepageStyles.captionSecond}`}
      >
        Do you want to want to be healthy, fit and energetic? <br></br> Are you
        dieting and struggling to find time to make healthy, balanced meals?{" "}
        <br></br> Do you need a nourishing office lunch box? <br></br> Eating
        well doesn't have to mean bland food. <br></br> Jyoti's superbowls
        brings you balanced meals, with lots of options, all bursting with
        flavours
      </p>
      {sessionStorage.getItem("CheckoutData") &&
        JSON.parse(sessionStorage.getItem("Logged-In", true)) && (
          <Link to={`/checkout`}>
            <button hidden={processing} className="MainCheckout">
              Checkout
            </button>
          </Link>
        )}

      <div className={HomepageStyles.contactPlacement}>
        <h2 onClick={() => pressed("contact")} className="clickable">
          📞 Contact us{" "}
        </h2>
        {contactClicked && (
          <div className={HomepageStyles.contactPlacementChildAlign}>
            <p>Owner: Jyoti Sharma</p>
            <p>Email: gobbledygook@gmail.com</p>
            <p>Phone number: 05406405640606</p>
          </div>
        )}
      </div>
      <div className={HomepageStyles.container}>
        <div className={HomepageStyles.flexedLogin}>
          {!JSON.parse(sessionStorage.getItem("Logged-In")) ? (
            DontSkipLogin ? (
              <h2 onClick={() => pressed("login")} className="clickable">
                Login
              </h2>
            ) : (
              <h2 onClick={() => pressed("login")} className="clickable">
                Signup
              </h2>
            )
          ) : (
            <h2 onClick={() => pressed("logout")} className="clickable">
              Logout
            </h2>
          )}
          {!JSON.parse(sessionStorage.getItem("Logged-In")) &&
            loginClicked &&
            (DontSkipLogin ? (
              <>
                <br></br>
                <label htmlFor="username">Enter username: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.username || ""}
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter username here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <label htmlFor="email">Enter email: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.email || ""}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.password || ""}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <button
                  type="button"
                  onClick={verifyUsingDatabase}
                  disabled={processing}
                >
                  {processing ? "Please wait...." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={redirectToRegister}
                  disabled={processing}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                <br></br>
                <label htmlFor="username">Enter username: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.username || ""}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <label htmlFor="email">Enter email: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.email || ""}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <label htmlFor="password">Enter password: </label>
                <input
                  className={HomepageStyles.rounded}
                  value={registerData.password || ""}
                  id="password"
                  name="password"
                  type="text"
                  placeholder="Enter password here"
                  disabled={processing}
                  onChange={(e) => updateRegisterData(e, true)}
                />

                <button
                  type="button"
                  onClick={() => register()}
                  disabled={processing}
                >
                  {processing ? "Please wait...." : "Signup"}
                </button>
                <button
                  type="button"
                  onClick={redirectToLogin}
                  disabled={processing}
                >
                  Login to account
                </button>
              </>
            ))}
        </div>
        {JSON.parse(sessionStorage.getItem("admin", true)) &&
          sessionStorage.getItem("AdminData") &&
          sessionStorage.getItem("AdminPriceData") &&
          JSON.parse(sessionStorage.getItem("Logged-In", true)) && (
            <div className={HomepageStyles.admin}>
              <Link to="/Admin">
                <h2 className="clickable">👑 Access admin page</h2>
              </Link>
            </div>
          )}
      </div>

      <div className={HomepageStyles.bowlTextContainer}>
        <div href="#Bowls" className={HomepageStyles.formatExploreBowls}>
          <span>E</span>
          <span>x</span>
          <span>p</span>
          <span>l</span>
          <span>o</span>
          <span>r</span>
          <span>e</span>
          <span> </span>
          <span>B</span>
          <span>o</span>
          <span>w</span>
          <span>l</span>
          <span>s</span>
        </div>
      </div>
      <Link to={`/checkout`}>
        <button className="Checkout">Checkout</button>
      </Link>
      <div id="Bowls" className={HomepageStyles.arrangeBowls}>
        <BowlImage
          name="Soya Chunk High-Protein Bowl"
          price="₹ 200"
          picture={bowl}
        />
        <BowlImage name="Paneer Power Bowl" price="₹ 300" picture={bowl3} />
        <BowlImage name="Tofu Stir-Fry Bowl" price="₹ 400" picture={bowl4} />
        <BowlImage
          name="Chicken Tikka Macro Bowl"
          price="₹ 500"
          picture={bowl5}
        />

        <BowlImage
          name="Fish & Veggie Grain Bowl"
          price="₹ 600"
          picture={bowl6}
        />
        <BowlImage
          name="Egg Bhurji Nutrition Bowl"
          price="₹ 700"
          picture={bowl7}
        />
        <BowlImage name="Rajma Superfood Bowl" price="₹ 800" picture={bowl8} />
        <BowlImage
          name="Eggless Bhurji & Oats Bowl"
          price="₹ 900"
          picture={bowl}
        />
      </div>
    </>
  );
}

export default RenderBowls;
