import { setCookie, getCookieFromBrowser } from "./auth.js";
import { useState, useEffect, useRef } from "react";
import LoginStyles from "./Login.module.css";
function RegisterorLoginPage({
  setsomethingChangedinLogin,
  saveChanges,
  reShowSave,
  setreShowSave,
  processing,
  setprocessing,
  text,
  setText,
}) {
  const [DontSkipLogin, setDontSkipLogin] = useState(false);
  const [registerData, setRegisterData] = useState({});
  const [cookieSet, setCookieSet] = useState(false);
  const [name, setName] = useState("");
  const [manualLogout, setManualLogout] = useState(false);
  const [LogoutState, setLogoutState] = useState("Logout");
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  async function saveClicked() {
    if (!isMounted.current) return;
    setText("Syncing changes");
    console.log("Syncing changes");
    await saveChanges();

    if (!isMounted.current) return;
    console.log("Synced changes");
    setText("Synced changes");
    setreShowSave(false);
  }

  useEffect(() => {
    if (reShowSave) {
      (async () => {
        await saveClicked();
      })();
    }
  }, [reShowSave]);

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
  async function ensureCSRFToken() {
    let token = await getCookieFromBrowser("csrftoken");
    if (!token) {
      await fetch("http://127.0.0.1:8000/databaseTesting/setToken/", {
        method: "GET",
        credentials: "include",
      });
      // wait until cookie actually exists
      for (let i = 0; i < 10; i++) {
        token = await getCookieFromBrowser("csrftoken");
        if (token) break;
        await new Promise((r) => setTimeout(r, 100)); // wait 100ms
      }
    }
    return token;
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
    let CSRFToken = await ensureCSRFToken();
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
      updateRegisterData({ name: "email", value: CSRFToken }, false);
      const contentType = sendData.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        response = await sendData.json();
      } else {
        response = await sendData.text();
      }
      if (sendData.ok) {
        console.log("Server responded with: ", response);
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
        setreShowSave(true);
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
      setreShowSave(true);
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
      setLogoutState("Logout");
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
    setLogoutState("Logging out");
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
      updateRegisterData({ name: "username", value: "" }, false);
      updateRegisterData({ name: "email", value: "" }, false);
      updateRegisterData({ name: "password", value: "" }, false);
      setManualLogout(true);
      setreShowSave(false);
      console.log(result.message);
    } else {
      sessionStorage.setItem("Logged-In", true);
      console.log(result.error);
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
  function pressed(param) {
    if (param === "logout") {
      logoutfunction();
    }
  }

  useEffect(() => {
    (async () => {
      await ensureCSRFToken();
    })();
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
        console.log("Here");
        const admin = await checkAdmin();
        if (admin) {
          sessionStorage.setItem("admin", true);
          setreShowSave(false);
        } else {
          sessionStorage.setItem("admin", false);
          setreShowSave(false);
        }
      }
    })();
  }, []);

  return (
    <>
      {reShowSave && <div className="syncText">{text}</div>}
      <div className={LoginStyles.flexedLogin}>
        {!JSON.parse(sessionStorage.getItem("Logged-In")) ? (
          DontSkipLogin ? (
            <h2 className="clickable">Login</h2>
          ) : (
            <h2 className="clickable">Signup</h2>
          )
        ) : (
          <h2 onClick={() => pressed("logout")} className="clickable">
            {LogoutState}
          </h2>
        )}
        {!JSON.parse(sessionStorage.getItem("Logged-In")) &&
          (DontSkipLogin ? (
            <>
              <br></br>
              <label htmlFor="username">Enter username: </label>
              <input
                className="rounded"
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
                className="rounded"
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
                className="rounded"
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
                className="rounded"
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
                className="rounded"
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
                className="rounded"
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
    </>
  );
}

export default RegisterorLoginPage;
