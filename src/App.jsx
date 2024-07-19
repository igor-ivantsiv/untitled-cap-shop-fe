import { Route, Routes } from "react-router-dom"
import Navbar from "./components/TESTNavbar"
import Homepage from "./pages/Homepage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" />
        <Route path="/admin" />
      </Routes>
    </>
  )
}

export default App
