import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { rtdb } from "../firebase";
import { onDisconnect, ref, update } from "firebase/database";
import { Timestamp } from "firebase/firestore";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const statusRef = ref(rtdb, 'users/' + user.uid);
                onDisconnect(statusRef, () => {
                    update(statusRef, {
                        status: 'offline',
                        time: Timestamp.now(),
                    });
                });
            }
        });
    }, []);
    if (loading) {
        return 'Loading...';
    }
    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;