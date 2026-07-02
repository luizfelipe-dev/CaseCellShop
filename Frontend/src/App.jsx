import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import ResetPage from './pages/ResetPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/reset" element={<ResetPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
