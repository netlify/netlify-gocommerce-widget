import { h, Component } from "preact";

function formatAmount(price) {
  if (price.currency === "USD") {
    return `$${price.amount}`;
  }
  if (price.currency === "EUR") {
    return `${price.amount}€`;
  }
  return `${price.amount} ${price.currency}`;
}

function calculateTotal(item) {
  const cents = parseFloat(item.price.amount) * 100;
  const total = cents * item.quantity;

  return {
    amount: (total / 100).toFixed(2),
    currency: item.price.currency
  };
}

export default class ItemRow extends Component {
  handleDecrease = e => {
    e.preventDefault();
  };

  handleDecrease = e => {
    e.preventDefault();
    const { item, onQuantity } = this.props;

    if (this.canDecrease()) {
      onQuantity(item.sku, item.path, item.quantity - 1);
    }
  };

  handleIncrease = e => {
    e.preventDefault();
    const { item, onQuantity } = this.props;

    onQuantity(item.sku, item.path, item.quantity + 1);
  };

  canDecrease() {
    return this.props.item.quantity > 0;
  }

  render() {
    const { item } = this.props;

    return (
      <tr>
        <td>
          <div className="media">
            <div className="mediaFigure">
              <img src={item.image} className="thumbnail"/>
            </div>
            <div className="mediaBody">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </td>
        <td>
          <button
            className="btn-qty"
            onClick={this.handleDecrease}
            disabled={!this.canDecrease()}
          >
            -
          </button>
          {` ${item.quantity} `}
          <button className="btn-qty" onClick={this.handleIncrease}>
            +
          </button>
        </td>
        <td>{formatAmount(item.price)}</td>
        <td>{formatAmount(calculateTotal(item))}</td>
      </tr>
    );
  }
}
