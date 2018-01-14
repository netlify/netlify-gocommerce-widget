import { h, Component } from "preact";


class StripeCard extends Component {
  handleRef = (ref) => {
    if (ref) {
      const stripe = window.gocommerceFrame.contentWindow.Stripe(this.props.publicKey);
      const elements = stripe.elements();
      const card = elements.create("card", {});

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
        <span>Pay with credit card</span>
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