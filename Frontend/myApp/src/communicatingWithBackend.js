const intialBackendString = "https://mealbowlapp.onrender.com/databaseTesting";
async function getCSRFToken() {
  const fetchTheData = await fetch(`${intialBackendString}/getToken/`, {
    method: "GET",
    credentials: "include",
  });
  let response;
  const contentType = fetchTheData.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      response = await fetchTheData.json();
      response = response.csrftoken;
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      response = await fetchTheData.text();
    }
  } else {
    response = await fetchTheData.text();
    console.warn("Received non-JSON response:");
  }
  return response;
}
function isPrivateBrowsing() {
  try {
    localStorage.setItem("__test__", "1");
    localStorage.removeItem("__test__");
    return false;
  } catch {
    return true;
  }
}
function authenticationHeaders() {
  const sessionid = JSON.parse(sessionStorage.getItem("sessionid"));
  const csrftoken = JSON.parse(sessionStorage.getItem("csrftoken"));

  return {
    "Content-Type": "application/json",
    "X-SESSIONID": sessionid || "",
    "X-CSRFToken": csrftoken || "",
  };
}
export async function SendData(url, data = {}) {
  let response;
  try {
    const sendData = await fetch(url, {
      method: "POST",
      headers: authenticationHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });
    const contentType = sendData.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        response = await sendData.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        response = await sendData.text();
      }
    } else {
      response = await sendData.text();
      console.warn("Received non-JSON response:");
    }
    if (sendData.ok) {
      sessionStorage.setItem("Logged-In", true);
    } else {
      console.log("Server threw an error", response);
    }
  } catch (error) {
    console.log("Error in send data function: ", error);
  }
  return response;
}
