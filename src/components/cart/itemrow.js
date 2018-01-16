import { h, Component } from "preact";
import {formatAmount, calculateTotal} from "../helpers";


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
      <li className="cartItem">
        <div className="media">
          <div className="mediaFigure">
            <img src={item.image} className="thumbnail" />
          </div>
          <div className="mediaBody">
            <h3 className="cartItemTitle">{item.title}</h3>
            <p className="cartItemDesc">{item.description}</p>
            <p className="cartItemMeta">
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
              {" X "}
              {formatAmount(item.price)}
            </p>
          </div>
        </div>
      </li>
    );
  }
}
