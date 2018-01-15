import { h, Component } from "preact";

const style = {
  base: {
    color: '#0e1e25',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    lineHeight: '24px',
    '::placeholder': {
      color: '#a3a9ac'
    },
  }
};

class StripeCard extends Component {
  handleRef = (ref) => {
    if (ref) {
      const stripe = window.gocommerceFrame.contentWindow.Stripe(this.props.publicKey);
      const elements = stripe.elements();
      const card = elements.create("card", {style});

      card.mount(ref);
      this.props.onStripe(stripe, card, {});
      card.addEventListener('change', (data) => {
        this.props.onStripe(stripe, card, data);
      });

      this.card = card;
    }
  }

  componentWillUnmount() {
    this.card.destroy();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div className="formGroup">
      <label>
        <span>Credit Card</span>
        <div ref={this.handleRef}>Stripe...</div>
      </label>
    </div>;
  }
}

export default class Payment extends Component {
    componentWillMount() {
        if (!this.props.methods) {
          this.props.onLoadMethods();
        }
    }

    handleStripe = (stripe, card, data) => {
      console.log('stripe', card, data);
      this.props.onUpdatePaymentMethod(data.complete, () => stripe.createToken(card).then((result) => {
        if (result.error) { throw(result.error); }

        return result;
      }));
    }

    renderStripe() {
      const {stripe} = this.props.methods;

      if (!stripe.enabled) return null;

      if (!stripe.loaded) {
        console.log('stripe not loaded :(', stripe);
        return <p>Loading stripe...</p>
      }

      return <StripeCard publicKey={stripe.public_key} onStripe={this.handleStripe} />;
    }

    render() {
      if (!this.props.methods) {
        return <p>Loading...</p>
      }

      return <div>
        {this.renderStripe()}
      </div>;
    }
}