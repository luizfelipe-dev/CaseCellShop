const { validateCheckout } = require('../../src/schemas/checkout.schema');

describe('checkout.schema', () => {
  const validPayload = {
    uid: '3d8f4d7a-91d5-4f67-a3c5-0b6ef4c91234',
    productId: '507f1f77bcf86cd799439011',
    amount: 2,
  };

  it('aceita payload válido', () => {
    const { error, value } = validateCheckout(validPayload);
    expect(error).toBeUndefined();
    expect(value).toEqual(validPayload);
  });

  it('rejeita uid inválido', () => {
    const { error } = validateCheckout({
      ...validPayload,
      uid: 'nao-e-uuid',
    });
    expect(error).toBeDefined();
  });

  it('rejeita amount menor ou igual a zero', () => {
    const { error } = validateCheckout({
      ...validPayload,
      amount: 0,
    });
    expect(error).toBeDefined();
  });

  it('rejeita campos ausentes', () => {
    const { error } = validateCheckout({});
    expect(error).toBeDefined();
  });

  it('rejeita productId com formato inválido', () => {
    const { error } = validateCheckout({
      ...validPayload,
      productId: '123',
    });
    expect(error).toBeDefined();
  });
});
