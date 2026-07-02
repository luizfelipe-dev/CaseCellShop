function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function ProductList({ products, selectedProductId, onSelect, isLoading }) {
  if (isLoading) {
    return <p className="loading-text">Carregando produtos...</p>;
  }

  if (!products.length) {
    return <p className="empty-text">Nenhum produto disponível no momento.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        const outOfStock = product.stock === 0;

        return (
          <button
            key={product.id}
            type="button"
            className={`product-card ${isSelected ? 'product-card--selected' : ''} ${outOfStock ? 'product-card--disabled' : ''}`}
            onClick={() => !outOfStock && onSelect(product)}
            disabled={outOfStock}
          >
            {product.imageUrl && (
              <div className="product-card__image-wrapper">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-card__image"
                />
              </div>
            )}
            <div className="product-card__content">
              <h3>{product.name}</h3>
              <p className="product-card__price">{formatPrice(product.price)}</p>
              <p className={`product-card__stock ${outOfStock ? 'product-card__stock--empty' : ''}`}>
                {outOfStock ? 'Sem estoque' : `${product.stock} un.`}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ProductList;
