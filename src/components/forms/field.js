import { h, Component } from "preact";

export default class Field extends Component {
  render() {
    const {
      label,
      name,
      value,
      required,
      placeholder,
      autocapitalize,
      type,
      className,
      onInput
    } = this.props;
    const classes = ["formGroup"];
    if (className) {
      classes.push(className);
    }
    return (
      <div className={classes.join(" ")}>
        <label>
          <span>{label}</span>
          <input
            className="formControl"
            type={type || "text"}
            name={name}
            value={value}
            placeholder={placeholder}
            autocapitalize={autocapitalize}
            required={required}
            onInput={onInput}
          />
        </label>
      </div>
    );
  }
}
