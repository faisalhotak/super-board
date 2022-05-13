import React, {useEffect, useState} from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {useNavigate} from "react-router-dom";

const AuthRoute = (props: { children: any; }) => {
    const { children } = props;
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/login');

            setLoading(false);
        })

        return () => {
            onAuthStateChanged(auth, (user) => {
                if (!user) navigate('/login');

                setLoading(false);
            })
        }
    }, [auth]);

    if (loading) {
        return (
            <div style={{textAlign: 'center', fontFamily: 'Verdana'}}>
                <h1>Loading...</h1>
                <div className="loader" />
            </div>)
    }

    return <>{children}</>;
}

export default AuthRoute;