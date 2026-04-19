import API from "./api"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Workspace from "./pages/Workspace"
import Documents from "./pages/Documents"
import Editor from "./pages/Editor"
import Join from "./pages/Join"

function App() {

  const path = window.location.pathname

  const publicRoutes =
    path === "/" ||
    path === "/register" ||
    path.startsWith("/join")

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout")
    } catch (err) {
      console.log(err)
    }

    localStorage.removeItem("token")
    window.location.href = "/"
  }

  let page

  if (path === "/register") page = <Register />
  else if (path === "/workspace") page = <Workspace />
  else if (path === "/documents") page = <Documents />
  else if (path === "/editor") page = <Editor />
  else if (path.startsWith("/join")) page = <Join />
  else page = <Login />

  return (
    <div>

      {!publicRoutes && (
        <div
  style={{
    padding: "10px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "flex-end"
  }}
><button
  onClick={handleLogout}
  style={{
    padding: "8px 14px",
    cursor: "pointer"
  }}
>
  Logout
</button>
</div>
      )}

      {page}

    </div>
  )
}

export default App