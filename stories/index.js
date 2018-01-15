import { h } from "preact";
import { storiesOf } from "@storybook/react";
import Field from "../src/components/forms/field";
import "../src/components/modal.css";
import Modal from "../src/components/modal";

const ModalDecorator = (storyFn) => (
    <Modal isOpen>{ storyFn() }</Modal>
  );

storiesOf("Form", module)
    .addDecorator(ModalDecorator)
    .add("basic text field", () => {
        return <Field
            label="Basic Text Field"
            name="text"
            value=""
            placeholder="Enter some text"
        />
    })