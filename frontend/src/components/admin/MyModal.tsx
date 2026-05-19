import Modal from "react-modal";
import {X} from "lucide-react";
import {useEffect, useState} from "react";

Modal.setAppElement("#root");

type ModalPayload = {
    openModal: boolean;
    afterOpen: () => void;
    closedModal: () => void;
    contend: any
}

export const MyModal = ({openModal, afterOpen, closedModal, contend}: ModalPayload) => {

    const [modalIsOpen, setIsOpen] = useState(false);

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.

    }

    const closeModal = () => {
        setIsOpen(false);
        closedModal()
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    useEffect(() => {
        setIsOpen(openModal);
    }, [openModal, closedModal, afterOpen])

    return (
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >


            <X onClick={closeModal} className="close-modal"/>

            <div className={"modal-container"}>
                {contend}
            </div>

        </Modal>
    )
}