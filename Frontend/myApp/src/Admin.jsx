import { setCookie, getCookieFromBrowser } from "./auth.js";

async function AdminPage() {
  const getAll = await fetch(
    "https://mealbowlapp.onrender.com/databaseTesting/getEverything/",
    {
      credentials: "include",
    },
  );
  const contentType = getAll.headers.get("content-type");
  let result;
  if (contentType && contentType.includes("application/json")) {
    result = await getAll.json();
  } else {
    result = await getAll.text();
  }
  console.log(result);
  return (
    <>
      <div>Hi</div>
    </>
  );
}

export default AdminPage;
