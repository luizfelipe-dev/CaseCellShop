import { useCallback, useEffect, useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import { fetchOrders } from '../services/api';
import { getOrderStatusLabel } from '../utils/messages';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('pt-BR');
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const loadOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await fetchOrders();
      setOrders(data);
      setAlert({ type: '', message: '' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Não foi possível carregar os pedidos.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <main className="app__main page">
      <section className="page-panel">
        <div className="section-heading section-heading--row">
          <div>
            <h2>Meus Pedidos</h2>
            <p>Histórico de pedidos com status completo</p>
          </div>
          <button type="button" className="page-panel__refresh" onClick={loadOrders}>
            Atualizar
          </button>
        </div>

        <AlertMessage type={alert.type} message={alert.message} />

        {isLoading ? (
          <p className="loading-text">Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">Nenhum pedido encontrado.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order.uid} className={`order-card order-card--${order.status}`}>
                <div className="order-card__header">
                  <h3>{order.productName}</h3>
                  <span className={`order-card__badge order-card__badge--${order.status}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
                <dl className="order-card__details">
                  <div>
                    <dt>ID do pedido</dt>
                    <dd><code>{order.uid}</code></dd>
                  </div>
                  <div>
                    <dt>Produto</dt>
                    <dd><code>{order.productId}</code></dd>
                  </div>
                  <div>
                    <dt>Quantidade</dt>
                    <dd>{order.amount}</dd>
                  </div>
                  <div>
                    <dt>Criado em</dt>
                    <dd>{formatDate(order.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Atualizado em</dt>
                    <dd>{formatDate(order.updatedAt)}</dd>
                  </div>
                </dl>
                {order.message && (
                  <p className="order-card__message">{order.message}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default OrdersPage;
