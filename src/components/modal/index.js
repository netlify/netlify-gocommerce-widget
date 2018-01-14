import { h, Component } from "preact";

function formatError(error) {
  return (
    (error.json && error.json.error_description) ||
    error.message ||
    error.toString()
  );
}

export default class Modal extends Component {
  handleClose = e => {
    e.preventDefault();
    this.props.onClose();
  };

  blockEvent = e => {
    e.stopPropagation();
  };

  linkHandler = page => e => {
    e.preventDefault();
    this.props.onPage(page);
  };

  render() {
    const {
      page,
      loading,
      isOpen,
      children,
      logo
    } = this.props;
    const hidden = loading || !isOpen;
    return (
      <div
        className="modalContainer"
        role="dialog"
        aria-hidden={`${hidden}`}
        onClick={this.handleClose}
      >
        <div
          className={`modalDialog${loading ? " visuallyHidden" : ""}`}
          onClick={this.blockEvent}
        >
          <div className="modalContent">
            <button onclick={this.handleClose} className="btn btnClose">
              <span className="visuallyHidden">Close</span>
            </button>
            {children}
          </div>
        </div>
        {logo && (
          <a
            href="https://www.netlify.com"
            className={`callOut${loading ? " visuallyHidden" : ""}`}
          >
            <span className="netlifyLogo" />
            Coded by Netlify
          </a>
        )}
      </div>
    );
  }
}
