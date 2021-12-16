import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth } from "../firebase";
import {setDoc, doc, Timestamp} from '@firebase/firestore';
import{db} from '../firebase';
import {useNavigate} from 'react-router-dom';

function Signup() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
    });
    const { name, email, password, error, loading } = data;
    const navigate = useNavigate();
    const handleChange = (e) => {
        setData({ ...data, error: '', [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(data);
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: 'Please enter all fields' });
        }
        createUserWithEmailAndPassword(auth, email, password).then(cred => {
            setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                name: name,
                email: email,
                password: password,
                isOnline: true,
                createdAt: Timestamp.fromDate(new Date()),
            });
            setData({name: '', email: '', password: '', error: null, loading: false});
            navigate('/');
        }).catch(error => {
            setData({ ...data, error: error.message, loading: false });
        });
    };

    return (
        <section>
            <h3>Create An Account</h3>
            <form className="form" onSubmit={handleSubmit}>
                <div className="input_container">
                    <label htmlFor="first_name">First Name</label>
                    <input type="text" name="name" value={name} onChange={handleChange} />
                </div>
                <div className="input_container">
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" value={email} onChange={handleChange} />
                </div>
                <div className="input_container">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange} />
                </div>
                {error && <div className="error">{error}</div>}
                <div className="btn_container">
                    <button className="btn" disabled={loading}>Sign Up</button>
                </div>
            </form>
        </section>
    )
}

export default Signup
