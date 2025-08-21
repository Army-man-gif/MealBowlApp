import BowlImage from "./BowlImage.jsx";
import HomepageStyles from "./HomePage.module.css";
import LoginFeature from "./LoginLogic.jsx";
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

//import { setCookie, getCookieFromBrowser } from "./auth.js";
import { Link } from "react-router-dom";
function RenderBowls({
  setsomethingChangedinLogin,
  saveChanges,
  reShowSave,
  save,
  setSave,
  processing,
  setprocessing,
  text,
  setText,
}) {
  const [contactClicked, setcontactClicked] = useState(false);
  const initial = useRef(true);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  async function saveClicked() {
    if (!isMounted.current) return;
    setSave(true);
    setText("Syncing changes");
    console.log("Syncing changes");
    await saveChanges();

    if (!isMounted.current) return;
    console.log("Synced changes");
    setText("Synced changes");
    setSave(false);
  }

  useEffect(() => {
    if (!initial.current) {
      (async () => {
        await saveClicked();
      })();
    } else {
      initial.current = false;
    }
  }, [reShowSave]);

  function pressed(param) {
    if (param === "contact") {
      setcontactClicked(!contactClicked);
    }
  }
  return (
    <>
      {save && <div>{text}</div>}
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
        JSON.parse(sessionStorage.getItem("Logged-In", true)) &&
        !save && (
          <Link to={`/checkout`}>
            <button hidden={processing} className="MainCheckout">
              Checkout
            </button>
          </Link>
        )}
      <Link to={"/contact"} className={HomepageStyles.placeContactLink}>
        📞 Contact
      </Link>
      <div className={HomepageStyles.container}>
        <div className={HomepageStyles.flexedLogin}>
          <Link to={"/loginPage"} className={HomepageStyles.loginLink}>
            Login/Register Page
          </Link>
        </div>
        {JSON.parse(sessionStorage.getItem("admin", true)) &&
          sessionStorage.getItem("AdminData") &&
          sessionStorage.getItem("AdminPriceData") &&
          JSON.parse(sessionStorage.getItem("Logged-In", true)) &&
          !save && (
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
