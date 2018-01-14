import { h, Component } from "preact";
import ItemRow from "./itemrow";

function mergeItems(state, props) {
  console.log("merging in props", JSON.stringify(props));
  const keys = {};
  for (const k in state) {
    keys[k] = true;
  }
  for (const k in props) {
    keys[k] = true;
  }
  const result = {};
  for (const k in keys) {
    result[k] = props[k] || { ...state[k], quantity: 0 };
  }
  return result;
}

export default class Cart extends Component {
  constructor(props) {
    super(props);
    // We need to make sure we keep track of itesm, so we can show items
    // that has been removed from the cart
    this.state = {
      items: mergeItems({}, props.cart ? props.cart.items : {})
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: mergeItems(
        this.state.items,
        nextProps.cart ? nextProps.cart.items : {}
      )
    });
  }

  renderEmpty() {
    return (
      <tbody>
        <tr>
          <td colspam="4">You don't have any items in your cart</td>
        </tr>
      </tbody>
    );
  }

  renderItems() {
    const { items } = this.state;

    console.log("rendering items", items);

    return (
      <tbody>
        {Object.keys(items).map(sku => (
          <ItemRow
            item={items[sku]}
            key={sku}
            onQuantity={this.props.onQuantity}
          />
        ))}
      </tbody>
    );
  }

  render() {
    const { cart } = this.props;
    const { items } = this.state;
    const isEmpty = Object.keys(items).length === 0;

    return (
      <table className="gocommerceTable">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        {isEmpty ? this.renderEmpty() : this.renderItems()}
      </table>
    );
  }
}
