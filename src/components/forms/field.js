import { h, Component } from "preact";

export default class Field extends Component {
    render() {
        const {label, name, value, required, placeholder, autocapitalize, type, iconName, onInput} = this.props;

        return <div className="formGroup">
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
          <div className={`inputFieldIcon ${iconName}`} />
        </label>
      </div>
    }
}