import { useState } from "react";
import HomepageStyles from "./HomePage.module.css";
function Contact() {
  const [contactClicked, setcontactClicked] = useState(false);
  function pressed(param) {
    if (param === "contact") {
      setcontactClicked(!contactClicked);
    }
  }
  return (
    <>
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
    </>
  );
}

export default Contact;
