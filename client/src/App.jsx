import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login/Login'
import Home from './pages/public/Home'
import BuyerSignup from './pages/auth/signup/buyer/BuyerSignup'
import PublisherSignup from './pages/auth/signup/publisher/PublisherSignup'

function App() {
  return (
    <div>
      <Routes>
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="signup/buyer" element={<BuyerSignup />} />
          <Route path="signup/publisher" element={<PublisherSignup />} />
        </Route>

        <Route path="/" element={<Home />} />
      </Routes>     
    </div>
  )
}

export default App
