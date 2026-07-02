import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CheckoutPanel from './components/CheckoutPanel';
import AlertMessage from './components/AlertMessage';
import OrderStatusTracker from './components/OrderStatusTracker';
import { fetchProducts, submitCheckout, ApiError } from './services/api';
import { generateUid } from './utils/uuid';
import { getErrorMessage } from './utils/messages';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [trackingUid, setTrackingUid] = useState('');

  const loadProducts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoadingProducts(true);
    }

    try {
      const data = await fetchProducts();
      setProducts(data);

      setSelectedProduct((current) => {
        if (!current) {
          return null;
        }

        return data.find((product) => product.id === current.id) || null;
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Não foi possível carregar os produtos. Verifique se o backend está rodando.',
      });
    } finally {
      if (!silent) {
        setIsLoadingProducts(false);
      }
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setAlert({ type: '', message: '' });
    setTrackingUid('');
  }

  async function handleCheckout(checkoutAmount) {
    if (!selectedProduct || isSubmitting) {
      return;
    }

    const amount = Math.floor(Number(checkoutAmount));

    if (amount < 1 || amount > selectedProduct.stock) {
      setAlert({
        type: 'error',
        message: getErrorMessage('user_request_error'),
      });
      return;
    }

    const uid = generateUid();

    setIsSubmitting(true);
    setAlert({ type: '', message: '' });
    setTrackingUid('');

    try {
      const result = await submitCheckout({
        uid,
        productId: selectedProduct.id,
        amount,
      });

      setAlert({
        type: 'success',
        message: result.message,
      });
      setTrackingUid(result.uid || uid);
      await loadProducts({ silent: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: getErrorMessage(error.errorCode, error.message),
        });

        if (error.errorCode === 'stock_error') {
          await loadProducts({ silent: true });
        }
      } else {
        setAlert({
          type: 'error',
          message: 'Erro de conexão. Verifique se o backend está disponível.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOrderFinished = useCallback((order) => {
    if (order.status === 'failed') {
      setAlert({
        type: 'error',
        message: order.message || getErrorMessage('server_error'),
      });
      loadProducts({ silent: true });
      return;
    }

    setAlert({
      type: 'success',
      message: order.message || 'Pedido concluído com sucesso!',
    });
    loadProducts({ silent: true });
  }, [loadProducts]);

  return (
    <div className="app">
      <Header />

      <div className="app__container">
        <main className="app__main">
          <AlertMessage type={alert.type} message={alert.message} />

          <div className="app__layout">
            <section className="products-section">
              <div className="section-heading">
                <h2>Produtos</h2>
                <p>Selecione uma capinha para finalizar a compra</p>
              </div>
              <ProductList
                products={products}
                selectedProductId={selectedProduct?.id}
                onSelect={handleSelectProduct}
                isLoading={isLoadingProducts}
              />
            </section>

            <aside className="checkout-sidebar">
              <CheckoutPanel
                selectedProduct={selectedProduct}
                onSubmit={handleCheckout}
                isSubmitting={isSubmitting}
              />

              <OrderStatusTracker uid={trackingUid} onFinished={handleOrderFinished} />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
