import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined, FileCopy, Image } from '@material-ui/icons';
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from '@material-ui/icons/Mic';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Chat.css";
import db from './Firebase';
import { useStateValue } from './StateProvider';
import firebase from 'firebase';
import Dropdown from "../node_modules/react-bootstrap/Dropdown";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

function Chat() {

    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const { roomId } = useParams("");
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [images, setimages] = useState([]);
    const [files, setfiles] = useState([]);
    useEffect(() => {
        if (roomId) {
            db.collection('rooms')
                .doc(roomId).onSnapshot((snapshot) => setRoomName(snapshot
                    .data().name));

            db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) =>
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                );
            db.collection('rooms')
                .doc(roomId)
                .collection('images')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) =>
                    setimages(snapshot.docs.map((doc) => doc.data()))
                );
            db.collection('rooms')
                .doc(roomId)
                .collection('files')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) =>
                    setfiles(snapshot.docs.map((doc) => doc.data()))
                );
        }
    }, [roomId]);
    useEffect(() => {
        setSeed(Math.floor(
            Math.random() * 5000)
        );

    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input !== " " && input !== "" && input !== null) {
            db.collection('rooms').doc(roomId).collection('messages').add({
                message: input,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setInput("");
        }
    }
    const [imageUrl, setimageUrl] = useState("");
    const imagechange = async (e) => {
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setimageUrl(await fileRef.getDownloadURL())
    }
    const imageUpload = (e) => {
        e.preventDefault()
        if (imageUrl !== " " && imageUrl !== "" && imageUrl !== null) {
            db.collection('rooms').doc(roomId).collection('images').add({
                imagepath: imageUrl,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setimageUrl("");
        }
    }
    const [docUrl, setdocUrl] = useState("");
    const [filenm, setfilename] = useState("");
    const handleFilechange = async (e) => {
        const file = e.target.files[0];
        const fname = file.name;
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setdocUrl(await fileRef.getDownloadURL())
        setfilename(fname)

    }
    const handleFileUpload = (e) => {
        e.preventDefault()
        if (docUrl !== " " && docUrl !== "" && docUrl !== null) {
            db.collection('rooms').doc(roomId).collection('files').add({
                filepath: docUrl,
                filename: filenm,
                name: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setdocUrl("");
        }
    }


    return (
        <div className="chat">
            <div className='chat__header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at{"   "}
                        {new Date(
                            messages[messages.length - 1]?.timestamp?.toDate()).toLocaleString()}
                        {new Date(
                            files[files.length - 1]?.timestamp?.toDate()).toLocaleString()}
                        {new Date(
                            images[images.length - 1]?.timestamp?.toDate()).toLocaleString()}
                    </p>
                </div>
                <div className='chat__headerRight'>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>

                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            <IconButton><AttachFile /></IconButton>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>

                            <form>
                                <input type="file" id="formInput" accept="image/*" onChange={imagechange} />
                                <IconButton><label for="formInput"><Image /></label></IconButton><br></br>
                                <button type="submit" onClick={imageUpload}>SEND</button>
                            </form>
                            <form>
                                <input type="file" id="fileInput" onChange={handleFilechange} />
                                <IconButton><label for="fileInput"><FileCopy /></label></IconButton><br></br>
                                <button type="submit" onClick={handleFileUpload} >SEND</button>
                            </form>


                        </Dropdown.Menu>
                    </Dropdown>

                    <IconButton>
                        <MoreVert />
                    </IconButton>

                </div>
            </div>
            <div className='chat__body'>
                {messages.map((message) => (
                    <p className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
                        <span className="chat__name">
                            {message.name}
                        </span>
                        <span className="message">{message.message} </span>

                        <span className="chat__timestamp" >
                            {new Date(message.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </p>
                ))}
                {images.map((image) => (
                    <p className={`chat__message ${image.name === user.displayName && "chat__reciever"}`}>
                        <span className="chat__name">
                            {image.name}
                        </span>
                        <a href={image.imagepath} target='_blank'>
                            <img src={image.imagepath} alt={image.name} width="300px" className="message" />
                        </a>

                        <br />
                        <span className="chat__timestamp" >
                            {new Date(image.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </p>
                ))}
                {files.map((f) => (
                    <p className={`chat__message ${f.name === user.displayName && "chat__reciever"}`}>
                        <span className="chat__name">
                            {f.name}
                        </span>
                        <span className="message"><a href={f.filepath} target="_blank"><b><u>{f.filename}</u> </b></a> </span>

                        <span className="chat__timestamp" >
                            {new Date(f.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </p>
                ))}
            </div>

            <div className='chat__footer'>
                <Tooltip className='Icontitle' title="Press Windows + (.) " aria-label="key" arrow >
                    <IconButton className="fab">
                        <InsertEmoticonIcon />
                    </IconButton>
                </Tooltip>
                <form>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder='Type a message' />
                    <button type="submit" onClick={sendMessage} >Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    );
}
export default Chat;
