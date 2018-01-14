import { h, Component } from "preact";

export default class Confirm extends Component {
    render() {
        const {cart, details, cc} = this.props;
        return <div>
            <p>{JSON.stringify(cart)}</p>
            <p>{JSON.stringify(details)}</p>
            <p>{JSON.stringify(cc)}</p>
        </div>;
    }
}