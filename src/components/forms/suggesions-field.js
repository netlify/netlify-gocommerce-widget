import { h, Component } from "preact";

export default class SuggestionsField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || null,
      autoComplete: props.autoComplete,
      selected: 0
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value || null,
      autoComplete: newProps.autoComplete,
      selected: 0
    });

    return newProps;
  }

  handleChange = e => {
    this.setState(
      {
        name: this.props.name,
        value: e.target.value,
        selected: 0,
        suggestions: this.filterSuggestions(e.target.value)
      },
      () => {
        this.props.onInput && this.props.onInput({ target: this.state });
      }
    );
  };

  handleFocusChange = (isFocus, e) => {
    if (!isFocus) {
      const suggestions = this.filterSuggestions(this.state.value, true);

      if (suggestions && e.target.value) {
        this.setState(
          {
            value: suggestions[this.state.selected],
            autoComplete: this.props.autoComplete,
            selected: 0,
            suggestions: null
          },
          this.validateField
        );
      }
      this.props.onInput({ target: this.state });
    } else {
      this.setState({
        value: e.target.value,
        selected: 0,
        autoComplete: "off",
        suggestions: this.filterSuggestions(e.target.value)
      });
    }
  };

  handleSuggestion = e => {
    this.setState({ value: e.target.textContent, suggestions: null });
  };

  handleFocus = (e) => {
    this.setState({focus: true});
    this.handleFocusChange(true, e);
  };

  handleBlur = (e) => {
    this.setState({focus: false});
    this.handleFocusChange(false, e);
  };

  handleKeyDown = e => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const step = e.key === "ArrowUp" ? -1 : 1;
      let { selected, value } = this.state;
      const suggestions = this.filterSuggestions(value);
      selected += step;

      if (selected >= suggestions.length) selected = suggestions.length - 1;
      if (selected < 0) selected = 0;

      this.setState({ selected });
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.pickFirstSuggestion();
    }
  };

  validate = () => {
    this.validateField();
  };

  filterSuggestions = (value, forceReturn) => {
    const suggestions = [];
    if (!value) {
      return forceReturn ? suggestions : null;
    }

    for (let i = 0, len = this.props.options.length; i < len; i++) {
      const option = Object.assign({}, this.props.options[i]);
      const regexp = new RegExp("^" + value.replace(/\s/, ".*"), "i");

      if (
        regexp.test(option.label) ||
        regexp.test(option.value) ||
        (option.alternatives || []).find(alt => regexp.test(alt))
      ) {
        if (value) {
          option.boost = 0;
          if (option.value.toLowerCase() === value.toLowerCase())
            option.boost = 1;
        }
        suggestions.push({
          value: option[this.props.valueField || "label"],
          boost: option.boost || 0,
          label: option.label,
          alternatives: option.alternatives,
          code: option.value
        });
      }
    }

    if (
      !forceReturn &&
      suggestions.length === 1 &&
      (suggestions[0].value === value || value === suggestions[0].code)
    )
      return null;

    return suggestions
      .sort((a, b) => b.boost - a.boost)
      .map(s => s.value)
      .slice(0, 5);
  };

  pickFirstSuggestion = () => {
    const suggestions = this.filterSuggestions(this.state.value);
    if (suggestions) {
      this.setState(
        { value: suggestions[this.state.selected], suggestions: null },
        this.validateField
      );
      this.props.onInput({ target: this.state });
    }
  };

  handleHover(selected) {
    return () => {
      this.setState({ selected });
    };
  }

  render() {
    const {
      name,
      label,
      className,
      error,
      autoCapitalize,
      pattern,
      optional,
      spellCheck,
      autoCorrect,
      errorMessage,
      onValidate
    } = this.props;
    const { value, suggestions, autoComplete, selected } = this.state;
    const id = label.replace(/[^\w0-9_-]/g, "");

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
            name={name}
            value={value}
            onInput={this.handleChange}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            autoComplete={false}
            autoCapitalize={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </label>
        {this.props.options.length > 0 && (
          <datalist id={`datalist-${id}`}>
            <option value={this.props.options[0].label} />
          </datalist>
        )}
        {suggestions && (
          <ul className="field--suggestions">
            {suggestions.map((suggestion, i) => (
              <li
                onMouseOver={this.handleHover(i)}
                className={
                  "field--suggestion " +
                  (selected === i ? "field--suggestion__selected" : "")
                }
                onClick={this.handleSuggestion}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
