import { Route, Routes } from "react-router-dom"
import Navbar from "./components/TESTNavbar"
import Homepage from "./pages/Homepage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import PrivateRoute from "./components/PrivateRoute"
import TestProfile from "./pages/TestProfile"
import AdminRoute from "./components/AdminRoute"
import TestAdminPage from "./pages/TestAdminPage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users/:userId" element={
          <PrivateRoute>
            <TestProfile />
          </PrivateRoute>
          } />
        <Route path="/admin" element={
          <AdminRoute>
            <TestAdminPage />
          </AdminRoute>
        }/>
        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </>
  )
}

export default App
