import React, { useState } from 'react';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from "../firebase";
import { doc, updateDoc} from '@firebase/firestore';
import{db} from '../firebase';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
    });
    const { email, password, error, loading } = data;
    const navigate = useNavigate();
    const handleChange = (e) => {
        setData({ ...data, error: '', [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(data);
        setData({ ...data, error: null, loading: true });
        if (!email || !password) {
            setData({ ...data, error: 'Please enter all fields' });
        }
        signInWithEmailAndPassword(auth, email, password).then(cred => {
            updateDoc(doc(db, 'users', cred.user.uid), {
                isOnline: true,
            });
            setData({ email: '', password: '', error: null, loading: false});
            navigate('/home');
        }).catch(error => {
            setData({ ...data, error: error.message, loading: false });
        });
    };
    return (
        <section>
            <h3>Login to Whatsapp Clone</h3>
            <form className="form" onSubmit={handleSubmit}>
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
                    <button className="btn" disabled={loading}>{loading?"Logging in..":"Login"}</button>
                </div>
            </form>
        </section>
    )
}

export default Login;
