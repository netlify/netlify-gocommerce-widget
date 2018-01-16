import { h } from "preact";
import Modal from "../src/components/modal";

export default function ModalDecorator(storyFn) {
    return <Modal isOpen>{ storyFn() }</Modal>
}
