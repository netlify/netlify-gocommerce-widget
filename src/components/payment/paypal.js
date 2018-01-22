import {h, Component} from 'preact';

export default class PaypalButton extends Component {
  shouldComponentUpdate = () => false;

  componentDidMount() {
    this.configurePaypal();
  }

  componentWillUnmount() {}

  configurePaypal = (tries) => {
    if (tries > 30) {
      console.error("Paypal script didn't load");
      return;
    }

    if (window.paypal) {
      console.log('configuring button', this.props.env)
      this.button = window.paypal.Button.render({
        env: this.props.env, // Specify 'sandbox' for the test environment
        payment: this.handlePaypal, // on click
        onAuthorize: this.handlePaypalConfirmation, // on confirm
        style: {
          color: 'gold',
          size: 'medium'
        }
      }, this.base);
    } else {
      setTimeout(() => this.configurePaypal(tries + 1), 1000);
    }
  };

  handlePaypal = (resolve, reject) => {
    const {url, amount, currency} = this.props;

    window.paypal.request.post(url, {amount: (parseFloat(amount) * 100).toFixed(0), provider: 'paypal', currency})
      .then(function(data) {
          console.log('resolving', data);
        resolve(data.id);
      })
      .catch(function(err) {
        reject(err);
      });
  };

  handlePaypalConfirmation = data => this.props.onPaypal(data)

  render() {
    return <div></div>;
  }
}