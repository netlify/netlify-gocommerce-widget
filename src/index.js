import netlifyGocommerce from "./netlify-gocommerce";

if (typeof exports !== undefined) {
  exports.netlifyGocommerce = netlifyGocommerce;
}
if (typeof window !== undefined) {
  window.netlifyGocommerce = netlifyGocommerce;
}

document.addEventListener("DOMContentLoaded", () => {
  netlifyGocommerce.init({APIUrl: window.GocommerceAPI || null});
});
