import { useEffect, useState } from 'react';

function CheckoutPanel({
  selectedProduct,
  onSubmit,
  isSubmitting,
}) {
  const maxAmount = selectedProduct?.stock ?? 1;
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    setAmount(1);
  }, [selectedProduct?.id]);

  useEffect(() => {
    if (!selectedProduct || selectedProduct.stock === 0) {
      return;
    }

    setAmount((current) => {
      const parsed = Math.floor(Number(current)) || 1;
      return Math.min(Math.max(parsed, 1), selectedProduct.stock);
    });
  }, [selectedProduct?.stock]);

  function handleAmountChange(event) {
    const raw = event.target.value;

    if (raw === '') {
      setAmount('');
      return;
    }

    const parsed = Math.floor(Number(raw));
    if (Number.isNaN(parsed)) {
      return;
    }

    if (parsed > maxAmount) {
      setAmount(maxAmount);
      return;
    }

    setAmount(parsed);
  }

  function handleAmountBlur() {
    setAmount((current) => {
      const parsed = Math.floor(Number(current));
      if (Number.isNaN(parsed) || parsed < 1) {
        return 1;
      }
      if (parsed > maxAmount) {
        return maxAmount;
      }
      return parsed;
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    if (!selectedProduct || isSubmitting) {
      return;
    }

    const quantity = Math.floor(Number(amount));

    if (quantity < 1 || quantity > maxAmount) {
      return;
    }

    onSubmit(quantity);
  }

  const isDisabled =
    !selectedProduct ||
    selectedProduct.stock === 0 ||
    isSubmitting;

  return (
    <section className="checkout-panel">
      <h2>Checkout</h2>

      {!selectedProduct ? (
        <p className="checkout-panel__hint">Selecione um produto para continuar.</p>
      ) : (
        <form key={selectedProduct.id} onSubmit={handleFormSubmit}>
          <div className="checkout-panel__summary">
            <p>
              <strong>{selectedProduct.name}</strong>
            </p>
            <p>Estoque disponível: {selectedProduct.stock}</p>
          </div>

          <label className="checkout-panel__label" htmlFor="amount">
            Quantidade
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={1}
            max={maxAmount}
            value={amount}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            disabled={isSubmitting}
            className="checkout-panel__input"
          />

          <button
            type="submit"
            className="checkout-panel__button"
            disabled={isDisabled}
          >
            {isSubmitting ? 'Processando...' : 'Finalizar compra'}
          </button>
        </form>
      )}
    </section>
  );
}

export default CheckoutPanel;
