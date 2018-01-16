import { h, Component } from "preact";
import { formatAmount } from "../helpers";

export default class Confirm extends Component {
    render() {
        const {cart, details, cc} = this.props;
        return <div className="cartConfirmation">
            <h3>Your order confirmation will be sent to:</h3>
            <p>
                {details.email}
            </p>

            <h3>Billing address:</h3>
            <p>
                {details.billing_full_name}
                {details.billing_company && <span>, {details.billing_company}</span>}
                <br/>
                {details.billing_address1}
                {details.billing_address2 && <span>, {details.billing_address2}</span>}
                <br/>
                {details.billing_city}, {details.billing_country}
            </p>
        </div>;
    }
}