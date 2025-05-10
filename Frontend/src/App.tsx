import NavBar from "./components/NavBar"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from "./components/Signin"
import SignUp from "./components/Signup"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import LoadingContext from "./Context/LoadingContext"
import { useContext } from "react"
import Agenda from "./components/Dashboard/Agenda"
import Calendar from "./components/Dashboard/Calendar"
import Search from "./components/Dashboard/Search"
import Settings from "./components/Dashboard/Settings"

function App() {

  const { loading } = useContext(LoadingContext)

  return (
    <>
      <BrowserRouter>
        {loading ? null : <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route path="agenda" element={<Agenda />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="search" element={<Search/>} />
            <Route path="settings" element={<Settings/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
