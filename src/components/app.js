import { h, Component } from "preact";
import { connect } from "mobx-preact";
import Modal from "./modal";
import SiteURLForm from "./forms/siteurl";
import Cart from "./cart";
import Details from "./details";
import Confirm from "./confirm";
import Success from "./success";
import Message from "./forms/message";

const pages = {
  details: {
    title: "Customer Details",
    button: "Review Order →",
    tabs: true,
    isActive: store => true,
    handler: (store, state) => {
      if (
        store.itemCount > 0 &&
        store.details.validated &&
        store.paymentMethods.complete
      ) {
        state.tokenFn().then(result => {
          store.setPage("confirm");
          store.setCC({ validated: true, result, provider: "stripe" });
        });
      }
    }
  },
  confirm: {
    title: "Review Order",
    button: "Finish Checkout →",
    tabs: true,
    isActive: store =>
      store.itemCount > 0 && store.details.validated && store.cc.validated,
    handler: store => {
      console.log("Checkout!");
      store.checkout();
    }
  },
  success: {
    title: "Success",
    button: "All Done",
    handler: store => {
      store.closeModal();
    }
  }
};

@connect(["store"])
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose = () => this.props.store.closeModal();
  handleSiteURL = url => this.props.store.setSiteURL(url);

  handleQuantity = (sku, path, quantity) => {
    this.props.store.updateQuantity(sku, path, quantity);
  };

  handleDetails = (detail, value) => {
    this.props.store.updateDetail(detail, value);
  };

  handleLoadMethods = () => {
    this.props.store.loadPaymentMethods();
  };

  handleNext = e => {
    e.preventDefault();

    const { store } = this.props;
    const page = pages[store.modal.page];

    page.handler(store, this.state);
  };

  handleGoto = e => {
    e.preventDefault();

    this.props.store.setPage(e.target.dataset.slug);
    console.log(e.target, e.target.slug);
  };

  handleUpdatePaymentMethod = (state, tokenFn) => {
    console.log("updating payment method", state);
    this.setState(
      { tokenFn },
      () => (this.props.store.paymentMethods.complete = state)
    );
  };

  renderBody() {
    const { store } = this.props;

    if (!store.gocommerce) {
      return <SiteURLForm onSiteURL={this.handleSiteURL} />;
    }

    switch (store.modal.page) {
      case "details":
        return (
          <Details
            details={store.details}
            onDetails={this.handleDetails}
            methods={store.paymentMethods}
            onLoadMethods={this.handleLoadMethods}
            onUpdatePaymentMethod={this.handleUpdatePaymentMethod}
          />
        );
      case "confirm":
        return (
          <Confirm cart={store.cart} details={store.details} cc={store.cc} />
        );
      case "success":
        return (
          <Success
            cart={store.orderedCart}
            details={store.details}
            order={store.order}
          />
        );
    }
  }

  render() {
    const { store } = this.props;
    const page = pages[store.modal.page];
    console.log("modal", store.modal);

    console.log("rendering", store.modal.page, pages[store.modal.page]);

    return (
      <div>
        <Modal
          error={store.error}
          loading={!store.error && !store.gocommerce}
          isOpen={store.modal.isOpen}
          onPage={this.handlePage}
          onClose={this.handleClose}
          logo={store.modal.logo}
        >
          {page.tabs && (
            <div className="header">
              {Object.keys(pages)
                .filter(slug => pages[slug].tabs)
                .map(slug => (
                  <button
                    data-slug={slug}
                    onClick={this.handleGoto}
                    disabled={!pages[slug].isActive(store)}
                    className={`btn btnHeader${
                      slug == store.modal.page ? " active" : ""
                    }`}
                  >
                    {pages[slug].title}
                  </button>
                ))}
            </div>
          )}
          <div className={`main ${store.modal.page}`}>
            <div className="body">{this.renderBody()}</div>
            <div className="aside">
              <Cart cart={store.cart} onQuantity={this.handleQuantity} />
            </div>
          </div>
          <div className="footer">
            <button className="btn" onClick={this.handleNext}>
              {page.button}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
