import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from "./components/Signin"
import SignUp from "./components/Signup"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import LoadingContext from "./Context/LoadingContext"
import { useContext } from "react"

function App() {

  const {loading} = useContext(LoadingContext)

  return (
    <>
      <BrowserRouter>
        {loading?null:<NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
