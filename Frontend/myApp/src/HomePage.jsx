import BowlImage from "./BowlImage.jsx";
import HomepageStyles from "./HomePage.module.css";
import { useState, useRef, useEffect, use } from "react";
import React from "react";
import bowl from "./assets/bowl.png";
import bowl3 from "./assets/bowl3.jpg";
import bowl4 from "./assets/bowl4.jpg";
import bowl5 from "./assets/bowl5.jpg";
import bowl6 from "./assets/bowl6.jpg";
import bowl7 from "./assets/bowl7.jpg";
import bowl8 from "./assets/bowl8.jpg";
import logo from "./assets/logo.png";

import Cookies from "js-cookie";

function RenderBowls() {
  const [contactClicked, setcontactClicked] = useState(false);
  const [loginClicked, setloginClicked] = useState(false);
  const [logout, setlogout] = useState(false);
  const [DontSkipLogin, setDontSkipLogin] = useState(true);

  const [registerData, setRegisterData] = useState({});

  const fetchPermissionFromBackend = async () => {
    const data = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/",
    );
    if (data) {
      console.log("Page fetched", data);
    } else {
      console.log("not fetched");
    }
  };

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

  const setCookie = async () => {
    await fetch("https://mealbowlapp.onrender.com/databaseTesting/setToken/", {
      method: "GET",
      credentials: "include",
    });
    return new Promise((resolve) => setTimeout(resolve, 100));
  };
  async function getCookieFromBrowser() {
    const fetchTheData = await fetch(
      "https://mealbowlapp.onrender.com/databaseTesting/getToken/",
      {
        method: "GET",
        credentials: "include",
      },
    );
    const cookiesData = await fetchTheData.json();
    return cookiesData.csrftoken;
  }
  async function SendData(url) {
    let response;
    const dataStringified = JSON.stringify(registerData);
    localStorage.setItem("Details", dataStringified);
    console.log(JSON.parse(localStorage.getItem("Details") || "{}"));
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
        body: JSON.stringify(registerData),
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
        setlogout(true);
      } else {
        console.log("Server threw an error", response);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    return response;
  }
  async function verifyUsingDatabase() {
    const check = await SendData(
      "https://mealbowlapp.onrender.com/databaseTesting/login/",
    );
    if (check.message) {
      updateRegisterData({ name: "username", value: "" }, false);
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      setlogout(true);
    } else {
      updateRegisterData(
        { name: "username", value: "Incorrect details" },
        false,
      );
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      console.log("Username: " + username + " Password: " + password);
      setlogout(false);
      setDontSkipLogin(true);
    }
  }
  async function verify() {
    if (
      username === registerData.username &&
      password === registerData.password
    ) {
      updateRegisterData({ name: "username", value: "" }, false);
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      setlogout(true);
    } else {
      updateRegisterData(
        { name: "username", value: "Incorrect details" },
        false,
      );
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      console.log("Username: " + username + " Password: " + password);
      setlogout(false);
      setDontSkipLogin(true);
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
      console.log("Admin granted");
    } else {
      setlogout(true);
      console.log("Admin restricted");
    }
  }
  async function logoutfunction() {
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
      setlogout(false);
      setloginClicked(!loginClicked);
      console.log(result.message);
    } else {
      setlogout(true);
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
    if (param === "admin") {
      checkAdmin();
    }
  }
  function redirectToLogin() {
    setDontSkipLogin(true);
    setlogout(false);
  }
  function redirectToRegister() {
    setDontSkipLogin(false);
    setlogout(false);
  }
  useEffect(() => {
    (async () => {
      await setCookie();
    })();
  }, []);
  return (
    <>
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
      <div className={HomepageStyles.container}>
        <div className={HomepageStyles.flexedLogin}>
          {!logout ? (
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
          {!logout &&
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
                  onChange={(e) => updateRegisterData(e, true)}
                />
                <button type="button" onClick={verifyUsingDatabase}>
                  Login
                </button>
                <button type="button" onClick={redirectToRegister}>
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
                  onChange={(e) => updateRegisterData(e, true)}
                />

                <button
                  type="button"
                  onClick={() =>
                    SendData(
                      "https://mealbowlapp.onrender.com/databaseTesting/createUser/",
                    )
                  }
                >
                  Signup
                </button>
                <button type="button" onClick={redirectToLogin}>
                  Login to account
                </button>
              </>
            ))}
        </div>
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
      </div>
      {logout && (
        <div
          className={`${HomepageStyles.contactPlacement} ${HomepageStyles.admin}`}
        >
          <h2 onClick={() => pressed("admin")} className="clickable">
            👑 Access admin page
          </h2>
        </div>
      )}
      <div className={HomepageStyles.bowlTextContainer}>
        <p className={HomepageStyles.styleBowlTextSymbolToBeaContainingImage}>
          <span className={HomepageStyles.rotate}>◗</span>
          <a
            href="#Bowls"
            className={`${HomepageStyles.center} ${HomepageStyles.link}`}
          >
            Explore bowls
          </a>
        </p>
      </div>
      <div id="Bowls" className={HomepageStyles.arrangeBowls}>
        <BowlImage name="Paneer Power Bowl" price="₹ 300" picture={bowl} />
        <BowlImage
          css="red"
          name="Chicken Tikka Macro Bowl"
          price="₹ 500"
          picture={bowl}
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
