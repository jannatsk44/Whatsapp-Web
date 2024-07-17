import React, { useState, useEffect } from 'react';
import db from './Firebase';
import firebase from 'firebase';
import { useStateValue } from './StateProvider';
import { useParams } from 'react-router-dom';


function FileUpdw() {
    const { roomId } = useParams("");
    const [{ user }, dispatch] = useStateValue();
    const [file, setfile] = useState([]);
    const [roomName, setRoomName] = useState("");
    useEffect(() => {
        if (roomId) {
            db.collection('rooms')
                .doc(roomId).onSnapshot((snapshot) => setRoomName(snapshot
                    .data().name));

            db.collection('rooms')
                .doc(roomId)
                .collection('files')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) =>
                    setfile(snapshot.docs.map((doc) => doc.data()))
                );
        }
    }, [roomId]);

    const [docUrl, setdocUrl] = useState(null);
    const handleFilechange = async (e) => {
        const file = e.target.files[0];
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setdocUrl(await fileRef.getDownloadURL())
    }
    const handleFileUpload = (e) => {
        e.preventDefault()
        db.collection('rooms').doc(roomId).collection('files').add({
            filepath: docUrl,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <div class="imageupload">
            <form>
                <input type="file" onChange={handleFilechange} />
                <button onClick={handleFileUpload}>FILE SUBMIT</button>
            </form>
        </div>
    );
}



export default FileUpdw;

// const Example = () => {
//     const componentRef = useRef();
//     const handlePrint = useReactToPrint({
//       content: () => componentRef.current,
//     });

//     return (
//       <div>
//         <ComponentToPrint ref={componentRef} />
//         <button onClick={handlePrint}>Print this out!</button>
//       </div>
//     );
//   };