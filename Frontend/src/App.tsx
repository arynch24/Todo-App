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
import Accounts from "./components/Dashboard/Settings/Accounts"
import Preferences from "./components/Dashboard/Settings/Preferences"
import Advanced from "./components/Dashboard/Settings/Advanced"
import { GoogleAuthProvider } from "./Context/GoogleAuthContext"

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
              <GoogleAuthProvider>
                <Dashboard />
              </GoogleAuthProvider>
            </ProtectedRoute>
          }>
            {/* This is the main dashboard route */}
            <Route path="" element={<Agenda />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="search" element={<Search />} />

            {/* This is the settings route */}
            <Route path="settings" element={<Settings />} >
              <Route path="" element={<Accounts />} />
              <Route path="Preferences" element={<Preferences />} />
              <Route path="Advanced" element={<Advanced />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
