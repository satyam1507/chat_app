import React, { useEffect } from 'react'
import { db, auth, rtdb } from '../firebase';
import { collection, query, where, updateDoc, onSnapshot, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { onDisconnect, ref, set} from "firebase/database";
import User from '../components/User';
import MessageForm from '../components/MessageForm';
import Message from '../components/Message';
function Home() {
    const [users, setUsers] = React.useState([]);
    const [chat, setChat] = React.useState("");
    const [text, setText] = React.useState("");
    const [msgs, setMsgs] = React.useState([]);
    const user1 = auth.currentUser.uid;
    useEffect(() => {
        const usersRef = collection(db, "users");
        changeStatus();
        const statusRef = ref(rtdb, 'users/' + user1);
        onDisconnect(statusRef).update({
            status: 'offline',
            time: Timestamp.now(),
        });

        // create query object
        const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            set(ref(rtdb, 'users/' + user1), {
                status: 'online',
                time: Timestamp.now(),
            });
            setUsers(users);
        });
        return () => unsub();
    }, []);
    const selectUser = (user) => {
        setChat(user);
        const user2 = user.uid;
        const id = user1 > user2 ? user1 + user2 : user2 + user1;
        const msgsRef = collection(db, "messages", id, 'chat');
        const q = query(msgsRef, orderBy('createdAt', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().from !== user1) {
                    updateDoc(doc.ref, { seen: true });
                }
                msgs.push(doc.data());
            });
            setMsgs(msgs);
        });
    }
    function changeStatus() {

        set(ref(rtdb, 'users/' + user1), {
            status: 'online',
        });
    }
    const handleSubmit = async e => {

        e.preventDefault();
        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        await addDoc(collection(db, 'messages', id, 'chat'), {
            text,
            from: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            seen: false
        });
        setText("");
    }
    return (
        <div className="home_container">
            <div className="users_container">
                {users.map(user => <User key={user.uid} user={user} selectUser={selectUser} />)}
            </div>
            <div className="messages_container">
                {chat ? (
                    <>
                        <div className="messages_user">
                            <h3>{chat.name}</h3>
                        </div>
                        <div className="messages">

                            {msgs.length ? msgs.map((msg, i) =>
                                <Message key={i} msg={msg} user1={user1} check={chat.isOnline} user2={chat} />) : null}
                        </div>
                        <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} />
                    </>
                ) : (<h3 className="no_conv">Select a user to start conversation</h3>)}
            </div>
        </div>

    )
}

export default Home
