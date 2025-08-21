import { useState } from "react";
import ContactStyles from "./Contact.module.css";
function Contact() {
  return (
    <>
      <div className={ContactStyles.contact}>
        <p>Owner: Jyoti Sharma</p>
        <p>Email: gobbledygook@gmail.com</p>
        <p>Phone number: 05406405640606</p>
      </div>
    </>
  );
}

export default Contact;
