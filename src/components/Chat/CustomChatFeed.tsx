import {
  BubbleGroup,
  ChatFeed,
  Message,
  ChatBubble as DefaultChatBubble,
} from "react-chat-ui";
import React from "react";

// ChatFeed.prototype.componentDidUpdate = () => {};
ChatFeed.prototype.renderMessages = function (messages: [Message]) {
  const { bubbleStyles, chatBubble, showSenderName } = this.props;

  const ChatBubble = chatBubble || DefaultChatBubble;

  const CustomChatBubble = (props: any) => {
    if (props.message.message.startsWith(">>IMG<<")) {
      return (
        <img
          alt={"Message"}
          src={props.message.message.slice(7)}
          style={{
            maxHeight: 100,
            borderRadius: 20,
          }}
        />
      );
    }

    return <ChatBubble {...props} />;
  };

  let group: Message[] = [];

  const messageNodes = messages.map((message, index) => {
    group.push(message);
    // Find diff in message type or no more messages
    if (
      index === messages.length - 1 ||
      messages[index + 1].id !== message.id
    ) {
      const messageGroup = group;
      group = [];
      return (
        <BubbleGroup
          key={index}
          messages={messageGroup}
          id={message.id}
          showSenderName={showSenderName}
          chatBubble={CustomChatBubble}
          bubbleStyles={bubbleStyles}
        />
      );
    }

    return null;
  });

  // // Other end is typing...
  // if (isTyping) {
  //   messageNodes.push(
  //     <div key="isTyping" style={{ ...styles.chatbubbleWrapper }}>
  //   <ChatBubble
  //     message={new Message({ id: 1, message: '...', senderName: '' })}
  //   bubbleStyles={bubbleStyles}
  //   />
  //   </div>
  // );
  // }

  // return nodes
  return messageNodes;
};

const CustomChatFeed = ChatFeed;

export default CustomChatFeed;
