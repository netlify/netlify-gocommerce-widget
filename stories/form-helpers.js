import { h } from "preact";
import { storiesOf } from "@storybook/react";
import ModalDecorator from "./modal-decorator"

import Field from "../src/components/forms/field";

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
