import React, { useState, useEffect } from 'react'
import { ref, onValue, } from "firebase/database";
import { rtdb } from '../firebase';
const User = ({ user, selectUser }) => {
    const [status, setStatus] = useState('offline');
    useEffect(() => {
        const statusRef = ref(rtdb, 'users/' + user.uid);
        onValue(statusRef, (snapshot) => {
            if (snapshot.val()) {
                setStatus(snapshot.val().status);
            }
        }
        );
    }, [user]);
    return (
        <div className="user_wrapper" onClick={() => selectUser(user)}>
            <div className="user_info">
                <div className="user_detail">
                    <img src="https://mpng.subpng.com/20180509/fyq/kisspng-computer-icons-user-profile-clip-art-5af2c2026fcf73.188817051525858818458.jpg" alt="avatar" className="avatar" />
                    <h5>{user.name}</h5>
                </div>
                <div
                    // className={`user_status ${user.isOnline ? "online" : "offline"}`}  >
                    className={`user_status ${status}`}  >

                </div>
            </div>
        </div >

    )
}
export default User
