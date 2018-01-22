import { observable, action, computed } from "mobx";

function validateDetails(details) {
  return !!(
    (details.email || "").match(/.+@.+/) &&
    details.billing_full_name &&
    details.billing_country &&
    details.billing_zip &&
    details.billing_city &&
    details.billing_address1
  );
}

function loadStripeLib() {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.onload = () => resolve(true);
    el.src = "https://js.stripe.com/v3/";

    window.gocommerceFrame.contentDocument.head.appendChild(el);
  });
}

function loadPaypalLib() {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.onload = () => resolve(true);
    el.setAttribute("data-version-4", true);
    el.src = "https://www.paypalobjects.com/api/checkout.js";

    document.head.appendChild(el);
  });
}

const store = observable({
  recovered_user: null,
  message: null,
  settings: null,
  gocommerce: null,
  cart: null,
  orederedCart: null,
  itemCount: computed(() => {
    let count = 0;
    for (const sku in store.cart ? store.cart.items : {}) {
      count += store.cart.items[sku].quantity;
    }
    return count;
  }),
  paymentMethods: null,
  error: null,
  siteURL: null,
  saving: false,
  modal: {
    page: "details",
    isOpen: false,
    logo: true
  },
  details: {
    email: null,
    noShipping: true,
    validated: false
  },
  cc: {
    validated: false
  },
  order: null
});

store.startAction = action(function startAction() {
  store.saving = true;
  store.error = null;
  store.message = null;
});

store.setError = action(function setError(err) {
  store.saving = false;
  store.error = err;
});

store.init = action(function init(gocommerce) {
  if (gocommerce) {
    store.gocommerce = gocommerce;
    store.cart = gocommerce.getCart();
  } else {
    console.error("Instantiated withour gocommerce");
  }
});

store.setSiteURL = action(function setSiteURL(url) {
  store.siteURL = url;
});

store.addToCart = action(function addToCart(path, sku, quantity) {
  store.gocommerce
    .addToCart({ path, sku, quantity: quantity || 1 })
    .then(
      action(lineItem => {
        store.cart = store.gocommerce.getCart();
      })
    )
    .catch(store.setError);
});

store.checkout = action(function checkout() {
  const { details, cc, gocommerce } = store;
  const billing_address = {
    name: details.billing_full_name,
    address1: details.billing_address1,
    city: details.billing_city,
    zip: details.billing_zip,
    state: details.billing_state,
    country: details.billing_country,
    company: details.billing_company
  };
  gocommerce
    .order({
      email: details.email,
      billing_address,
      shipping_address: billing_address
    })
    .then(({ cart, order }) => {
      const paymentMethod = {
        provider: cc.provider,
        amount: cart.total.cents,
        currency: order.currency,
        order_id: order.id
      };
      if (cc.provider === "stripe") {
        paymentMethod.stripe_token = cc.result.token.id;
      }
      return gocommerce.payment(paymentMethod).then(
        action(transaction => {
          order.invoice_number = transaction.invoice_number;

          gocommerce.clearCart();
          store.cc = {};
          store.orderedCart = cart;
          store.cart = gocommerce.getCart();
          store.order = order;
          store.modal.page = "success";
        })
      );
    })
    .catch(store.setError);
});

store.updateQuantity = action(function updateQuantity(sku, path, quantity) {
  if (store.cart.items[sku]) {
    store.gocommerce.updateCart(sku, quantity);
    store.cart = store.gocommerce.getCart();
  } else {
    store.addToCart(path, sku, quantity);
  }
});

store.updateDetail = action(function updateDetail(detail, value) {
  const details = {...store.details, [detail]: value};
  details.validated = validateDetails(details);
  store.details = details;
});

store.openModal = action(function open() {
  if (!store.modal.isOpen) {
    store.modal.page = "details";
    store.modal.isOpen = true;
  }
});

store.loadPaymentMethods = action(function loadPaymentMethods() {
  if (store.paymentMethods) {
    return;
  }
  fetch(store.gocommerce.api.apiURL + "/settings")
    .then(response => response.json())
    .then(
      action(settings => {
        store.paymentMethods = settings.payment_methods || {
          stripe: {},
          paypal: {}
        };
        if (
          store.paymentMethods.stripe &&
          store.paymentMethods.stripe.enabled
        ) {
          loadStripeLib().then(
            action(() => {
              const methods = { ...store.paymentMethods };
              methods.stripe = { ...methods.stripe, loaded: true };
              store.paymentMethods = methods;
            })
          );
        }
        if (
          store.paymentMethods.paypal &&
          store.paymentMethods.paypal.enabled
        ) {
          loadPaypalLib().then(
            action(() => {
              const methods = { ...store.paymentMethods };
              methods.paypal = { ...methods.paypal, url: store.gocommerce.api.apiURL + "/paypal", loaded: true };
              store.paymentMethods = methods;
            })
          );
        }
      })
    );
});

store.setPage = action(function setPage(page) {
  store.modal.page = page;
});

store.setCC = action(function setCC(cc) {
  store.cc = cc;
});

store.closeModal = action(function close() {
  store.modal.isOpen = false;
  store.error = null;
  store.message = null;
  store.saving = false;
});

export default store;
