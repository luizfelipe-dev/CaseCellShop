function CheckoutPanel({
  selectedProduct,
  onSubmit,
  isSubmitting,
}) {
  const maxAmount = selectedProduct?.stock ?? 1;

  function handleFormSubmit(event) {
    event.preventDefault();

    if (!selectedProduct || isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const quantity = Math.floor(Number(formData.get('amount')));

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
            defaultValue={1}
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
