import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Dashboard from '../pages/buyer/dashboard/Dashboard';
import SearchPage from '../pages/buyer/search/Search';
import BuyerProfile from '../pages/buyer/profile/Profile';
import ProductDetail from '../pages/buyer/product-detail/ProductDetail';
import Checkout from '../pages/buyer/checkout/Checkout';
import Cart from '../pages/buyer/cart/Cart';
import AuctionPage from '../pages/buyer/auction/AuctionPage';
import AuctionItemDetail from '../pages/buyer/auction/AuctionItemDetail';
import AuctionOngoing from '../pages/buyer/auction/AuctionOngoing';

import PublisherDashboard from '../pages/publisher/dashboard/Dashboard';
import PublishBook from '../pages/publisher/publish-book/PublishBook';
import SellAntique from '../pages/publisher/sell-antique/SellAntique';
import EditBookPage from '../pages/publisher/edit-book/EditBookPage';
import PublisherViewBook from '../pages/publisher/view-book/ViewBook';

const ProtectedRoutes = () => (
  <>
    {/* Buyer Routes */}
    <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
      <Route path="/buyer/dashboard" element={<Dashboard />} />
      <Route path="/buyer/search" element={<SearchPage />} />
      <Route path="/buyer/profile" element={<BuyerProfile />} />
      <Route path="/buyer/product-detail/:id" element={<ProductDetail />} />
      <Route path="/buyer/checkout" element={<Checkout />} />
      <Route path="/buyer/cart" element={<Cart />} />
      <Route path="/buyer/auction-page" element={<AuctionPage />} />
      <Route path="/buyer/auction-item-detail/:id" element={<AuctionItemDetail />} />
      <Route path="/buyer/auction-ongoing/:id" element={<AuctionOngoing />} />
    </Route>

    {/* Publisher Routes */}
    <Route element={<ProtectedRoute allowedRoles={['publisher']} />}>
      <Route path="/publisher/dashboard" element={<PublisherDashboard />} />
      <Route path="/publisher/publish-book" element={<PublishBook />} />
      <Route path="/publisher/sell-antique" element={<SellAntique />} />
      <Route path="/publisher/edit-book/:id" element={<EditBookPage />} />
      <Route path="/publisher/view-book/:id" element={<PublisherViewBook />} />
    </Route>
  </>
);

export default ProtectedRoutes;
