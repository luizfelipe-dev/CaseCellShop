const CHECKOUT_SUCCESS_MESSAGE =
  'O pedido foi recebido com sucesso e será processado';

const SERVER_ERROR_MESSAGE =
  'Estamos com uma instabilidade temporária. Tente novamente mais tarde.';

function toIdString(value) {
  if (!value) {
    return value;
  }

  return value.toString();
}

function buildCheckoutSuccessResponse(order) {
  return {
    message: CHECKOUT_SUCCESS_MESSAGE,
    orderId: toIdString(order._id),
    uid: order.uid,
    status: order.status,
  };
}

module.exports = {
  CHECKOUT_SUCCESS_MESSAGE,
  SERVER_ERROR_MESSAGE,
  toIdString,
  buildCheckoutSuccessResponse,
};
