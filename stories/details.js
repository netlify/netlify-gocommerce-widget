import { h } from "preact";
import { storiesOf } from "@storybook/react";
import ModalDecorator from "./modal-decorator"

import Details from "../src/components/details";
import Cart from "../src/components/cart";

const cart = {
    subtotal: {amount: "54.70", cents: 5470, currency: "USD"},
    taxes: {amount: "0.00", cents: 0, currency: "USD"},
    total: {amount: "54.70", cents: 5470, currency: "USD"},
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
        },
        "e-book": {
            sku: "e-book",
            path: "/e-book",
            title: "An E-Book",
            description: "The most awesome E-Book ever",
            image: "https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/9bab679b-21df-43b0-885e-e5ce5edb2402/a11y-3-ebooks-bundle-cover-opt-large.png",
            type: "E-Book",
            quantity: 2,
            price: {
                amount: "24.90",
                cents: 2490,
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

function onLoadMethods() { }

storiesOf("Details", module)
    .addDecorator(ModalDecorator)
    .add("Input details", () => {
        // TODO: ugly boilerplate should go into a component
        return <div className="main details">
        <div className="body">{
            <Details details={details} onLoadMethods={onLoadMethods} />
        }</div>
        <div className="aside">
            <Cart cart={cart}/>
        </div>
      </div>
    })
