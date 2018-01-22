import { h, render } from "preact";
import { observe } from "mobx";
import { Provider } from "mobx-preact";
import GoTrue from "gotrue-js";
import GoCommerce from "gocommerce-js";
import App from "./components/app";
import store from "./state/store";
import Controls from "./components/controls";
import modalCSS from "./components/modal.css";

const callbacks = {};
function trigger(callback) {
  (callbacks[callback] || []).forEach(cb => {
    cb.apply(cb, Array.prototype.slice.call(arguments, 1));
  });
}

const validActions = {
  open: true,
  configure: true,
  error: true
};

const netlifyGocommerce = {
  on: (event, cb) => {
    callbacks[event] = callbacks[event] || [];
    callbacks[event].push(cb);
  },
  open: action => {
    action = action || "login";
    if (!validActions[action]) {
      throw new Error(`Invalid action for open: ${action}`);
    }
    store.openModal(store.user ? "user" : action);
  },
  close: () => {
    store.closeModal();
  },
  get gocommerce() {
    if (!store.gocommerce) {
      store.openModal("configure");
    }
  },
  init: options => {
    init(options);
  },
  store
};

let queuedIframeStyle = null;
function setStyle(el, css) {
  let style = "";
  for (const key in css) {
    style += `${key}: ${css[key]}; `;
  }
  if (el) {
    el.setAttribute("style", style);
  } else {
    queuedIframeStyle = style;
  }
}

const localHosts = {
  localhost: true,
  "127.0.0.1": true,
  "0.0.0.0": true
};

function instantiateGocommerce(APIUrl) {
  const isLocal = localHosts[document.location.host.split(":").shift()];
  const siteURL = isLocal && localStorage.getItem("netlifySiteURL");
  if (APIUrl) {
    return new GoCommerce({ APIUrl, setCookie: !isLocal });
  }
  if (isLocal && siteURL) {
    const parts = [siteURL];
    if (!siteURL.match(/\/$/)) {
      parts.push("/");
    }
    parts.push(".netlify/gocommerce");
    return new GoCommerce({ APIUrl: parts.join("") });
  }

  return new GoCommerce({ APIUrl: "http://localhost:9111" });
}

let root;
let iframe;
const iframeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  border: "none",
  width: "100%",
  height: "100%",
  overflow: "visible",
  background: "transparent",
  display: "none",
  "z-index": 99
};

observe(store.modal, "isOpen", () => {
  setStyle(iframe, {
    ...iframeStyle,
    display: store.modal.isOpen ? "block !important" : "none"
  });
  if (store.modal.isOpen) {
    trigger("open", store.modal.page);
  } else {
    trigger("close");
  }
});

observe(store, "siteURL", () => {
  localStorage.setItem("netlifySiteURL", store.siteURL);
  store.init(instantiateGocommerce(), true);
});

observe(store, "gocommerce", () => {
  store.gocommerce && trigger("init", store.gocommerce.getCart());
});

observe(store, "itemCount", ({ newValue, oldValue }) => {
  if (newValue > oldValue) {
    store.openModal();
  }
});

observe(store, "error", () => {
  trigger("error", store.error);
});

const routes = /order_id=([^&]+)/;

function runRoutes() {
  const hash = (document.location.hash || "").replace(/^#/, "");
  if (!hash) {
    return;
  }
}

function init(options = {}) {
  const { APIUrl, logo = true } = options;
  const controlEls = document.querySelectorAll("[data-gocommerce-button]");
  Array.prototype.slice.call(controlEls).forEach(el => {
    let controls = null;
    const mode = "button";
    render(
      <Provider store={store}>
        <Controls mode={mode} text={el.innerText.trim()} />
      </Provider>,
      el,
      controls
    );
  });

  const buttonEls = document.querySelectorAll("[data-gocommerce-add");
  Array.prototype.slice.call(buttonEls).forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      store.addToCart(
        e.target.dataset.gocommerceAdd,
        e.target.dataset.gocommerceSku
      );
    });
  });

  store.init(instantiateGocommerce(APIUrl));
  store.modal.logo = logo;
  iframe = document.createElement("iframe");
  iframe.id = "netlify-gocommerce-widget";
  iframe.onload = () => {
    const styles = iframe.contentDocument.createElement("style");
    styles.innerHTML = modalCSS.toString();
    iframe.contentDocument.head.appendChild(styles);
    root = render(
      <Provider store={store}>
        <App />
      </Provider>,
      iframe.contentDocument.body,
      root
    );
    window.gocommerceFrame = iframe;
    //iframe.contentWindow.location.host = document.location.host
    runRoutes();
  };
  setStyle(iframe, iframeStyle);
  iframe.src = "javascript:";

  const container = options.container
    ? document.querySelector(options.container)
    : document.body;
  container.appendChild(iframe);
  /* There's a certain case where we might have called setStyle before the iframe was ready.
	   Make sure we take the last style and apply it */
  if (queuedIframeStyle) {
    iframe.setAttribute("style", queuedIframeStyle);
    queuedIframeStyle = null;
  }
}

export default netlifyGocommerce;
