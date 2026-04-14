import Login from "./pages/Login"
import Register from "./pages/Register"
import Editor from "./pages/Editor"

function App() {

  const path = window.location.pathname

  if (path === "/register") return <Register />
  if (path === "/editor") return <Editor />

  return <Login />
}

export default App