import { h } from "preact";
import { storiesOf } from "@storybook/react";
import ModalDecorator from "./modal-decorator"

import Field from "../src/components/forms/field";
import SuggestionField from "../src/components/forms/suggesions-field";
import countries from '../src/components/forms/countries.json';

storiesOf("Form Helpers", module)
    .addDecorator(ModalDecorator)
    .add("basic text field", () => {
        return <Field
            label="Basic Text Field"
            name="text"
            value=""
            placeholder="Enter some text"
        />
    })
    .add("country field", () => {
        let value = "";
        return <SuggestionField
            label="Country Field"
            name="text"
            value={value}
            onInput={(e) => value = e.target.value}
            options={countries}
            placeholder="Enter some text"
        />
    })
