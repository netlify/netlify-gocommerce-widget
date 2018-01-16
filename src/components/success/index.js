import { h, Component } from "preact";
import { formatAmount, formatOrderAmount } from "../helpers";

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
            Order # <strong>{order.invoice_number}</strong>
          </p>
        </div>

        <table className="cartOrder">
          <thead>
            <tr>
              <th />
              <th>Item</th>
              <th className="numberCell">Price</th>
              <th className="numberCell">Qty</th>
              <th className="numberCell">Total</th>
            </tr>
          </thead>
          <tfoot>
            <tr className="cartOrderSubtotal subdued">
              <th>Subtotal</th>
              <td />
              <td />
              <td />
              <td className="numberCell">{formatOrderAmount(order.subtotal, order.currency)}</td>
            </tr>
            <tr className="cartOrderTaxes subdued">
              <th>Taxes</th>
              <td />
              <td />
              <td />
              <td className="numberCell">{formatOrderAmount(order.taxes, order.currency)}</td>
            </tr>
            {order.discount > 0 && (
              <tr className="cartOrderDiscount subdued">
                <th>Discount</th>
                <td />
                <td />
                <td />
                <td className="numberCell">–{formatOrderAmount(order.discount, order.currency)}</td>
              </tr>
            )}
            <tr className="cartOrderTotal">
              <th>Total</th>
              <td />
              <td />
              <td />
              <td className="numberCell">{formatOrderAmount(order.total, order.currency)}</td>
            </tr>
          </tfoot>
          <tbody>
            {Object.keys(cart.items).map(sku => {
              const item = cart.items[sku];
              return (
                <tr className="cartOrderItem subdued" key={item.id}>
                  <th className="cartOrderItemIcon">
                    <img src={item.image} className="thumbnail" />
                  </th>
                  <th className="cartOrderItemName">
                    <a href={item.path} target="_blank">
                      {item.title}
                    </a>
                    <br />
                    <span className="cartOrderItemDesc">{item.description}</span>
                  </th>
                  <td className="cartOrderItemPrice numberCell">
                    {formatAmount(item.price)}
                  </td>
                  <td className="cartOrderItemQty numberCell">{item.quantity}</td>
                  <td className="cartOrderItemTotal numberCell">
                    {formatOrderAmount(
                      item.price.cents * item.quantity,
                      order.currency
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
