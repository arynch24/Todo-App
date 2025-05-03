import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from "./components/Signin"
import SignUp from "./components/Signup"
import Home from "./pages/Home"
function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signin" element={<SignIn/>} />
          <Route path="/signup" element={<SignUp/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
