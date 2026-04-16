import Login from "./pages/Login"
import Register from "./pages/Register"
import Editor from "./pages/Editor"
import Workspace from "./pages/Workspace"
import Documents from "./pages/Documents"
import Join from "./pages/Join"

function App() {

  const path = window.location.pathname

  if (path.startsWith("/join")) return <Join />
  if (path === "/register") return <Register />
  if (path === "/editor") return <Editor />
  if (path === "/documents") return <Documents />
  if (path === "/workspace") return <Workspace />
  

  return <Login />
}

export default App