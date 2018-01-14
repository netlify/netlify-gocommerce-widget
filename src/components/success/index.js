import { h, Component } from "preact";

export default class Success extends Component {
    render() {
        const {details, order} = this.props;

        return <div>
            <h1>Success! <small>You bought the things!</small></h1>
            <p>We've sent the receipt to <strong>{details.email}</strong></p>
            <p>{JSON.stringify(order)}</p>
        </div>;
    }
}