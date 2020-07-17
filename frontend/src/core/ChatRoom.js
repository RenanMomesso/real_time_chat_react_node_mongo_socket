import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import { Form, Input, Button, Row, Col, Mes } from "antd";
import Dropzone from "react-dropzone";
import { isAuth } from "../auth/Helpers";
import moment from 'moment'
import {
  CloudUploadOutlined,
  EnterOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import axios from "axios";
import ChatCard from "./Setions/ChatCard";
import { Document, Page } from "react-pdf";


let server = "http://localhost:8000";
const socket = io(server);
socket.on("connect", () => console.log("nova conexão"));

export default function ChatRoom() {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const getMessages = () => {
    axios.get("http://localhost:8000/api/getChats").then((response) => {
      setMessages(response.data);
    });
  };

  // messageEnd.scrollIntoView({behavior:'smooth'})

  const irParaBaixo = () => {
    divRef.scrollTo(1000,1000)
  }
  const divRef = useRef(irParaBaixo);

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    socket.on("Output That Message", (newMessageHandler) => {
      setMessages((mensagemdeantess) =>
        mensagemdeantess.concat(newMessageHandler)
      );
    });
  }, []);
  let messagesEnd;
  

  console.log('messages' , messages)
  const onDrop = (files) => {
    console.log("files", files)
    let formData = new FormData();

    const config = {
      header: {'content-type':'multipart/form-data'}
    }
    formData.append('file',files[0])
    axios.post('http://localhost:8000/api/chat/uploadfiles', formData, config).then(response => {
      if(response.data.success){
        console.log(response)
        let chatMessage = response.data.url;
        let userId = isAuth()._id;
        let userName = isAuth().name;
        let nowTime = moment();
        let type = "VideoOrImage"
        
        socket.emit("newMessage", {
          chatMessage,
          userId,
          userName,
          nowTime,
          type
        })
      }

    })
  };

  const submitChatMessage = (e) => {
    e.preventDefault();

    let newMessage = chatMessage;
    let userId = isAuth()._id;
    let userName = isAuth().name;
    let newTimeAndHour =
      new Date().getDate() + " / " + new Date().getHours() + "h";
    let type = "Text";
    socket.emit("newMessage", {
      chatMessage: newMessage,
      userId,
      userName,
      newTimeAndHour,
      type,
    });
    setChatMessage("");
  };
  const renderCards = () =>
    messages && messages.map((chat) => <ChatCard key={chat._id} {...chat} />);

  return (
    <Layout>
      <div>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="infinite-container" style={{ height: '500px', overflowY: 'scroll' }}>
                        {messages && (
                            renderCards()
                        )}
                        <div
                            ref={el => {
                                messagesEnd = el;
                            }}
                            style={{ float: "left", clear: "both" }}
                        />
                    </div>

                    <Row >
                        <Form layout="inline" onSubmit={submitChatMessage}>
                            <Col span={18}>
                                <Input
                                    id="message"
                                    prefix={<MessageOutlined />}
                                    placeholder="Let's start talking"
                                    type="text"
                                    value={chatMessage}
                                    onChange={e=>setChatMessage(e.target.value)}
                                />
                            </Col>
                            <Col span={2}>
                                <Dropzone onDrop={onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Button>
                                                    <CloudUploadOutlined />
                                                </Button>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Col>
                            <div>
            <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
          </div>
                            <Col span={4}>
                                <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage} htmlType="submit">
                                    <EnterOutlined />
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </div>
    </Layout>
  );
}
