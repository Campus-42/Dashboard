import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Input, Modal, Spinner } from "reactstrap";
import firebaseApp, { collections } from "../../services/firebaseApp";
import { Message } from "react-chat-ui";
import { useRecoilValue } from "recoil";
import { campusIdState } from "../../state/campusIdState";
import CustomChatFeed from "components/Chat/CustomChatFeed";
import UserInfoContext from "../../contexts/UserInfoContext";

interface IProps {
  channelId: string;
  onClose: Function;
}

const SendChannelMsgModal: FC<IProps> = ({ channelId, onClose }) => {
  const campusId = useRecoilValue(campusIdState);
  const userInfo = useContext(UserInfoContext);

  const [message, setMessage] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = useCallback(async () => {
    if (!campusId) return;
    const snapshot = await collections
      .channelMessages(campusId, channelId)
      .get();
    if (snapshot.empty) {
      return setMessages([]);
    }
    setMessages(
      snapshot.docs.map((doc) => {
        const data = doc.data();
        return new Message({
          id: data.timestamp_ms,
          message: data.text || `>>IMG<<${data.image}`,
          senderName: data.creator_name,
        });
      })
    );
    snapshot.docs.forEach((doc) => console.log(doc.data()));
  }, [campusId, channelId, setMessages]);

  async function submitForm() {
    setSubmitting(true);

    const createMessage = firebaseApp
      .functions()
      .httpsCallable("createMessage");

    const result = await createMessage({
      channelId,
      campusKey: campusId,
      conversationId: channelId,
      text: message,
      creator: userInfo?._id,
      creator_name: `${userInfo?.first_name} ${userInfo?.last_name}`,
      __type: "user",

      device_token: false,

      timestamp: new Date(Date.now()),
    });
    console.log(result);

    await fetchMessages();

    setMessage("");

    setSubmitting(false);
  }

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (!userInfo) return null;

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={true}
      toggle={(e: any) => onClose(e)}
    >
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
          Send Message
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
      <div className={"modal-body"}>
        <CustomChatFeed
          messages={messages}
          hasInputField={false}
          showSenderName
          maxHeight={300}
          bubbleStyles={{
            chatbubble: {
              backgroundColor: "#58C0ED",
            },
          }}
        />

        <Col>
          <Input
            type="textarea"
            name="msg"
            id="msg"
            placeholder="Message..."
            value={message}
            style={{
              transition: "none",
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Col>
      </div>
      <div className="modal-footer">
        <Button
          color="secondary"
          data-dismiss="modal"
          type="button"
          onClick={(e) => onClose(e)}
        >
          Cancel
        </Button>
        {!isSubmitting ? (
          <Button color="primary" type="button" onClick={submitForm}>
            Send message
          </Button>
        ) : (
          <Button
            color="primary"
            type="button"
            onClick={submitForm}
            disabled={true}
          >
            <Spinner color="light" />
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default SendChannelMsgModal;
