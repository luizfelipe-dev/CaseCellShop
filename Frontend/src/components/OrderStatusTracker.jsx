import { useEffect, useState } from 'react';
import { fetchOrderStatus } from '../services/api';
import { getOrderStatusLabel } from '../utils/messages';

const POLL_INTERVAL_MS = 2000;
const FINAL_STATUSES = ['completed', 'failed'];

function OrderStatusTracker({ uid, onFinished }) {
  const [order, setOrder] = useState(null);
  const [pollError, setPollError] = useState('');

  useEffect(() => {
    if (!uid) {
      return undefined;
    }

    let isActive = true;
    let intervalId;

    async function pollOrderStatus() {
      try {
        const data = await fetchOrderStatus(uid);

        if (!isActive) {
          return;
        }

        setOrder(data);
        setPollError('');

        if (FINAL_STATUSES.includes(data.status)) {
          clearInterval(intervalId);
          onFinished?.(data);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        setPollError(error.message || 'Erro ao consultar status do pedido.');
      }
    }

    pollOrderStatus();
    intervalId = setInterval(pollOrderStatus, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [uid, onFinished]);

  if (!uid) {
    return null;
  }

  return (
    <section className="order-tracker">
      <h2>Status do pedido</h2>
      <p className="order-tracker__uid">
        ID: <code>{uid}</code>
      </p>

      {pollError && <p className="order-tracker__error">{pollError}</p>}

      {order && (
        <div className={`order-tracker__status order-tracker__status--${order.status}`}>
          <p>{getOrderStatusLabel(order.status)}</p>
          {order.message && <p>{order.message}</p>}
        </div>
      )}

      {!order && !pollError && (
        <p className="loading-text">Consultando status...</p>
      )}
    </section>
  );
}

export default OrderStatusTracker;
