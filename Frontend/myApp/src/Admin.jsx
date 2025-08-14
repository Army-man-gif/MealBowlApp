async function AdminPage() {
  const getAll = await fetch(
    "https://mealbowlapp.onrender.com/databaseTesting/getEverything/",
    {
      credentials: "include",
    },
  );
  console.log(getAll);
  return (
    <>
      <div>Hi</div>
    </>
  );
}

export default AdminPage;
