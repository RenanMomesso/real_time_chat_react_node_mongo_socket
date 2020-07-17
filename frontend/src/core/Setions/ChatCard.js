import React, { useState } from "react";
import { Comment, Tooltip, Avatar } from "antd";
import moment from "moment";
import { Document, Page } from "react-pdf";

function ChatCard(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const conteudo = () => {
    if (props.message.substring(0, 7) === "uploads") {
      // this will be either video or image

      if (
        props.message.substring(
          props.message.length - 3,
          props.message.length
        ) === "mp4"
      ) {
        return (
          <video
            style={{ maxWidth: "200px" }}
            src={`http://localhost:8000/${props.message}`}
            alt="video"
            type="video/mp4"
            controls
          />
        );
      } else if (
        props.message.substring(
          props.message.length - 3,
          props.message.length
        ) === "jpg" ||
        "png" ||
        "jpeg"
      ) {
        return (
          <img
            style={{ maxWidth: "200px" }}
            src={`http://localhost:8000/${props.message}`}
            alt="img"
          />
        );
      } else if (
        props.message.substring(
          props.message.length - 3,
          props.message.length
        ) === "pdf"
      ) {
        return (
          <div>
            <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div>
        );
      }
      return <p>{props.message}</p>;
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Comment
        author={props.sender.name}
        avatar={<Avatar src={props.sender.image} alt={props.sender.name} />}
        content={conteudo()}
        datetime={
          <Tooltip title={moment().format("YYYY-MM-DD HH:mm:ss")}>
            <span>{moment().fromNow()}</span>
          </Tooltip>
        }
      />
    </div>
  );
}

export default ChatCard;
