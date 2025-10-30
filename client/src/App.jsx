import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login/Login'
import Home from './pages/public/Home/Index'
import BuyerSignup from './pages/auth/signup/buyer/BuyerSignup'
import PublisherSignup from './pages/auth/signup/publisher/PublisherSignup'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

import AdminDashboard from "./pages/admin/dashboard/Dashboard"
import PublisherDashboard from './pages/publisher/dashboard/Dashboard'
import PublishBook from './pages/publisher/publish-book/PublishBook'
import SellAntique from './pages/publisher/sell-antique/SellAntique'
import Dashboard from './pages/buyer/dashboard/Dashboard'
import SearchPage from './pages/buyer/search/Search'
import BuyerProfile from './pages/buyer/profile/Profile'
import ProductDetail from './pages/buyer/product-detail/ProductDetail'
import Checkout from './pages/buyer/checkout/Checkout'
import Cart from './pages/buyer/cart/Cart'
import AuctionPage from './pages/buyer/auction/AuctionPage'

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
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/admin/dashboard/:key" element={<AdminDashboard/>} />


        <Route path="/publisher/dashboard" element={<PublisherDashboard/>} />
        <Route path="/publisher/publish-book" element={<PublishBook/>} />
        <Route path="/publisher/sell-antique" element={<SellAntique/>} />
        
        
        <Route path="/buyer/dashboard" element={<Dashboard />} />
        <Route path="/buyer/search" element={<SearchPage/>} />
        <Route path="/buyer/profile" element={<BuyerProfile/>} />
        <Route path="/buyer/product-detail/:id" element={<ProductDetail/> } />
        <Route path="/buyer/checkout" element={<Checkout/> }/>        
        <Route path="/buyer/cart" element={<Cart/> } />

        <Route path="/buyer/auction-page" element={<AuctionPage/>} />
      </Routes>     
    </div>
  )
}

export default App
