import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { auth, db } from "../firebase";
import { updateDoc, doc } from '@firebase/firestore';
import { signOut } from '@firebase/auth';
import { AuthContext } from "../context/auth";
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../firebase';
import { ref,update } from 'firebase/database';

function Navbar() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSignOut = async () => {
        update(ref(rtdb, 'users/' + auth.currentUser.uid), {
            status: 'offline',
        });
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false
        })
        await signOut(auth);
        navigate('/login');
    };
    return (
        <nav>
            <h3>
                <Link to="/home">Whatsapp clone</Link>
            </h3>
            <div>
                {user ? (
                    <>
                        <button onClick={handleSignOut} className=" btn btn-danger">Sign out</button>

                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}

            </div>
        </nav>
    )
}

export default Navbar
