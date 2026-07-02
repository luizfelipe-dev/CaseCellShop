const ERROR_MESSAGES = {
  user_request_error: 'Dados inválidos. Verifique a quantidade e tente novamente.',
  stock_error: 'Não há mais itens disponíveis.',
  server_error:
    'Estamos com uma instabilidade temporária. Tente novamente mais tarde.',
  not_found: 'Pedido não encontrado.',
  unknown_error: 'Ocorreu um erro inesperado.',
};

const ORDER_STATUS_LABELS = {
  pending: 'Aguardando processamento',
  processing: 'Processando no ERP...',
  completed: 'Pedido concluído',
  failed: 'Falha no processamento',
};

export function getErrorMessage(errorCode, fallbackMessage) {
  return ERROR_MESSAGES[errorCode] || fallbackMessage || ERROR_MESSAGES.unknown_error;
}

export function getOrderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status;
}

export { ERROR_MESSAGES, ORDER_STATUS_LABELS };
