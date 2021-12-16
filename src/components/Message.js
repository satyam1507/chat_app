import React, { useRef, useEffect, useState } from 'react'
import { Check, CheckAll } from 'react-bootstrap-icons';
import Moment from 'react-moment';
import { rtdb } from '../firebase';
import { ref, onValue } from 'firebase/database';
const Message = ({ msg, user1, check, user2 }) => {
    const scrollRef = useRef();
    const [status, setStatus] = useState('offline');
    useEffect(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        const statusRef = ref(rtdb, 'users/' + user2.uid);
        onValue(statusRef, (snapshot) => {
            if (snapshot.val()) {
                setStatus(snapshot.val().status);
            }
        }
        );
    }, [msg]);
    return (
        <div className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
            ref={scrollRef}>
            <p className={msg.from === user1 ? "me" : "friend"}>
                {msg.text + " "}{msg.seen === true ? <CheckAll color="royalblue" viewBox="0 0 16 16" /> : status === 'offline' ? <Check color="royalblue" fill="white" viewBox="0 0 16 16" /> : msg.seen === false ? <CheckAll color="royalblue" fill="white" viewBox="0 0 16 16" /> : <CheckAll color="royalblue" viewBox="0 0 16 16" />}
                <br></br>

            </p>
            <h6><Moment format="h:mm a">{msg.createdAt.toDate()}</Moment></h6>
            {/* <div class="checkmark">L</div> */}

        </div>
    )
}

export default Message
