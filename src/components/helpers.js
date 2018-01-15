export function formatAmount(price) {
  if (price.currency === "USD") {
    return `$${price.amount}`;
  }
  if (price.currency === "EUR") {
    return `${price.amount}€`;
  }
  return `${price.amount} ${price.currency}`;
}

export function formatOrderAmount(amount, currency) {
  if (typeof amount === "number") {
    return formatAmount({ amount: (amount / 100).toFixed(2), currency });
  }
  return null;
}

export function calculateTotal(item) {
  const cents = parseFloat(item.price.amount) * 100;
  const total = cents * item.quantity;

  return {
    amount: (total / 100).toFixed(2),
    currency: item.price.currency
  };
}
