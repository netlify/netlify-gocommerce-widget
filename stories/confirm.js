import { h } from "preact";
import { storiesOf } from "@storybook/react";
import ModalDecorator from "./modal-decorator"

import Confirm from "../src/components/confirm";
import Cart from "../src/components/cart";

const cart = {
    subtotal: {amount: "29.80", cents: 2980, currency: "USD"},
    taxes: {amount: "0.00", cents: 0, currency: "USD"},
    total: {amount: "29.80", cents: 2980, currency: "USD"},
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
    email: "jon.doe@example.com",
    billing_full_name: "Jon Doe",
    billing_company: "Acme",
    billing_address1: "2325 3rd Street",
    billing_address2: "Suite 215",
    billing_country: "USA",
    billing_state: "CA",
    billing_city: "San Francisco",
    billing_zip: "94107"
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

storiesOf("Confirmation", module)
    .addDecorator(ModalDecorator)
    .add("Confirm checkout", () => {
        // TODO: ugly boilerplate should go into a component
        return <div className="main confirm">
        <div className="aside">
            <Cart cart={cart}/>
        </div>
        <div className="body">{
            <Confirm cart={cart} details={details} order={order} />
        }</div>
      </div>
    })
