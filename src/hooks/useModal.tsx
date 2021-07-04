import React, { useState } from "react";
import { Button, Modal } from "reactstrap";

function useModal(
  initialContent: JSX.Element | string,
  title?: string
): [JSX.Element | undefined, Function] {
  const [modalContent, setContent] = useState(initialContent);
  const [isModalVisible, toggleModal] = useState(false);

  let modal;
  if (isModalVisible)
    modal = (
      <Modal
        className="modal-dialog-centered"
        isOpen={isModalVisible}
        toggle={(e: any) => toggleModal(!isModalVisible)}
      >
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            {title}
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={(e) => toggleModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">{modalContent}</div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={(e) => toggleModal(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    );

  function showModal(arg: typeof initialContent) {
    if (!arg) return toggleModal(false);

    setContent(arg);
    toggleModal(true);
  }

  return [modal, showModal];
}

export default useModal;
