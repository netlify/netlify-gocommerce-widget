import { h, Component } from "preact";
import { formatOrderAmount } from "../helpers";

export default class Success extends Component {
  render() {
    const { cart, details, order } = this.props;

    return (
    <div>
        <h1>Thank you for your business!</h1>
      <div className="cartSuccess">
        <p>
          Your order was successful and we've sent a confirmation mail to{" "}
          <strong>{order.email}</strong>
        </p>

        <p>
          Order # <strong>{order.order_number}</strong>
        </p>

        <table className="cartOrder">
          <thead>
            <tr>
              <th />
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tfoot>
            <tr className="cartOrderSubtotal">
              <th>Subtotal</th>
              <td />
              <td />
              <td />
              <td>{formatOrderAmount(order.subtotal, order.currency)}</td>
            </tr>
            <tr className="cartOrderTaxes">
              <th>Taxes, included</th>
              <td />
              <td />
              <td />
              <td>{formatOrderAmount(order.taxes, order.currency)}</td>
            </tr>
            {order.discount > 0 && (
              <tr className="cartOrderDiscount">
                <th>Discount</th>
                <td />
                <td />
                <td />
                <td>–{formatOrderAmount(order.discount, order.currency)}</td>
              </tr>
            )}
            <tr className="cartOrderTotal">
              <th>Total</th>
              <td />
              <td />
              <td />
              <td>{formatOrderAmount(order.total, order.currency)}</td>
            </tr>
          </tfoot>
          <tbody>
            {Object.keys(cart.items).map(sku => {
              const item = cart.items[sku];
              return (
                <tr className="cartOrderItem" key={item.id}>
                  <th className="cartOrderItemIcon">
                    <img src={item.image} />
                  </th>
                  <th className="cartOrderItemName">
                    <a href={item.path} target="_blank">
                      {item.title}
                    </a>
                    {item.type && <span> ({item.type})</span>}
                    <br />
                    {item.description}
                  </th>
                  <td className="cartOrderItemPrice">
                    {formatOrderAmount(item.price, order.currency)}
                  </td>
                  <td className="cartOrderItemQty">{item.quantity}</td>
                  <td className="cartOrderItemTotal">
                    {formatOrderAmount(
                      item.price * item.quantity,
                      order.currency
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}
