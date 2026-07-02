import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import { resetDatabase, ApiError } from '../services/api';

function ResetPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  async function handleReset() {
    const confirmed = window.confirm(
      'Isso vai apagar todos os pedidos e restaurar o estoque original. Deseja continuar?'
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const result = await resetDatabase();
      setAlert({
        type: 'success',
        message: `${result.message} (${result.productsCreated} produtos)`,
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({ type: 'error', message: error.message });
      } else {
        setAlert({
          type: 'error',
          message: 'Erro ao resetar o banco. Verifique se o backend está rodando.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app__main page">
      <section className="page-panel page-panel--warning">
        <div className="section-heading">
          <h2>Reset do banco</h2>
          <p>Restaura produtos e estoque para os valores iniciais do seed</p>
        </div>

        <div className="reset-info">
          <p>Esta ação irá:</p>
          <ul>
            <li>Apagar todos os pedidos</li>
            <li>Recriar os produtos com estoque original</li>
            <li>Limpar o cache da vitrine</li>
          </ul>
        </div>

        <AlertMessage type={alert.type} message={alert.message} />

        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
          disabled={isLoading}
        >
          {isLoading ? 'Resetando...' : 'Resetar banco e estoque'}
        </button>
      </section>
    </main>
  );
}

export default ResetPage;
