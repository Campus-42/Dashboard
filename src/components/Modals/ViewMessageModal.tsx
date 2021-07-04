import React, { FC, useCallback, useEffect, useState } from "react";
import { Report } from "../../interfaces/Report";
import { firestore } from "../../services/firebaseApp";
import { Message } from "../../interfaces/Message";
import { Col, Form, FormGroup, Input, Label, Modal } from "reactstrap";
import { UserInfo } from "../../interfaces/UserInfo";

interface IProps {
  report: Report;
  show?: boolean;
  onClose: Function;
  users: UserInfo[];
}

const ViewMessageModal: FC<IProps> = ({
  report,
  show = true,
  onClose,
  users,
}) => {
  const [messages, setMessages] = useState<Array<Message>>([]);

  const loadMessages = useCallback(async () => {
    // Current path is in the format: <empty>/campuses/<campus_id>/bubbles/<bubble_id>/messages/<message_id>
    // We need this format instead: bubbles/<bubble_id>/messages
    // The path is sliced to skip the first 3 elements and the last one to get the correct format
    let collection_path = report.path_to_doc.split("/").slice(3, -1).join("/");
    let snapshot = await firestore.collection(collection_path).get();
    let messages = snapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          _id: doc.id,
        } as Message)
    );
    setMessages(messages);
  }, [report]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages, report]);

  let reported_id = report.path_to_doc.split("/")[6];

  let formattedMessages = messages
    .sort((a, b) => a.timestamp_ms - b.timestamp_ms)
    .map((message) => {
      if (message.creator_name === "false") return `SYSTEM: ${message.text}`;
      let msg_prefix = "";

      if (message._id === reported_id) msg_prefix = "***REPORTED***";

      return `${msg_prefix}${message.creator_name}: ${message.text}`;
    });
  let renderedLog = formattedMessages.join("\n");

  const user: UserInfo | undefined = report.reported_uid
    ? users.find((user) => user._id === report.reported_by)
    : undefined;

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={show}
      toggle={(e: any) => onClose(e)}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Messages
        </h5>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={(e) => onClose(e)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>

      <div className="modal-body">
        <Form>
          <FormGroup>
            <Label for="name">Reported by:</Label>
            <Col>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={
                  user
                    ? `${user.first_name} ${user.last_name} (${user.email})`
                    : "Anonymous"
                }
              />
            </Col>
          </FormGroup>
          <Input
            rows="10"
            type="textarea"
            value={renderedLog}
            style={{
              transition: "none",
            }}
          />
        </Form>
      </div>
    </Modal>
  );
};

export default ViewMessageModal;
