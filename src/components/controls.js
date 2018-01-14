import { h, Component } from "preact";
import { connect } from "mobx-preact";

@connect(["store"])
class Controls extends Component {
  handleButton = e => {
    e.preventDefault();
    this.props.store.openModal();
  };

  render() {
    return (
      <a
        className="netlify-gocommerce-button"
        href="#"
        onClick={this.handleButton}
      >
        View Cart
      </a>
    );
  }
}

export default Controls;
