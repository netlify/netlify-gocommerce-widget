import { h } from "preact";
import { storiesOf } from "@storybook/react";
import ModalDecorator from "./modal-decorator"

import Success from "../src/components/success";

const cart = {
    items: {
        "design-book": {
            sku: "design-book",
            path: "/design-book",
            title: "A Book About Design",
            description: "This is a super cool book about design",
            image: "//cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/a24177d6-1a2f-4294-9419-b765383a3196/design-systems-large-view-v2.png",
            type: "Book",
            quantity: 2,
            price: {
                amount: "14.90",
                cents: 1490,
                currency: "USD"
            }
        }
    }
}

const details = {
    email: "jon.doe@example.com"
}

const order = {
    email: "jon.doe@example.com",
    invoice_number: 12,
    currency: "USD",
    subtotal: 2 * 1490,
    taxes: 0,
    discount: 0,
    total: 2 * 1490
}

storiesOf("Success", module)
    .addDecorator(ModalDecorator)
    .add("Sucessful checkout", () => {
        // TODO: ugly boilerplate should go into a component
        return <div className="main success">
        <div className="aside"></div>
        <div className="body">{
            <Success cart={cart} details={details} order={order} />
        }</div>
      </div>
    })
