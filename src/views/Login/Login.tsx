import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState} from 'react';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        await signInWithEmailAndPassword(auth, username, password)
            .then(() => navigate('/'))
            .catch((error) => {
                console.log('error:', error.code);
                toast.error(error.code)
            });
        setLoading(false);
    }

    const signInWithGoogle = () => {
        setLoading(true);

        signInWithPopup(auth, new GoogleAuthProvider())
            .then((response) => {
                console.log('response:', response);
                navigate('/');
            })
            .catch((error) => {
                console.log('error:', error.code);
                setLoading(false);
                toast.error(error.code);
            })
    }

    const signInWithFacebook = () => {
        setLoading(true);

        signInWithPopup(auth, new FacebookAuthProvider())
            .then((response) => {
                console.log('response:', response);
                navigate('/');
            })
            .catch((error) => {
                console.log('error:', error.code);
                setLoading(false);
                toast.error(error.code);
            })
    }

    const signInWithGithub = () => {
        setLoading(true);

        signInWithPopup(auth, new GithubAuthProvider())
            .then((response) => {
                console.log('response:', response);
                navigate('/');
            })
            .catch((error) => {
                console.log('error:', error.code);
                setLoading(false);
                toast.error(error.code);
            })
    }

    return (
        <div className="Login">
            <div className="login-wrapper">
                <form onSubmit={handleSubmit} className="form">
                    <p className="login-title">Login</p>
                    <div><input type="email" required onChange={onChangeUsername} className="username-box" placeholder="Email Address *" /></div>
                    <div><input type="password" minLength={6} required onChange={onChangePassword} className="password-box" placeholder="Password *" /></div>
                    <div className="row">
                        <input type="checkbox" />
                        <span className="rememberme-text">Remember me</span>
                        <a href="#" className="forgot-text">Forgot?</a>
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>{loading ? <div className="loader" /> : "Log in"}</button>
                    <div className="separator"><span className="separator-text">Or</span></div>
                    <div className="auth-icons">
                        <img src="./assets/icons/icon_google.svg" alt="Google OAuth" className="oauth-icon" onClick={signInWithGoogle}/>
                        <img src="./assets/icons/icon_facebook.svg" alt="Facebook OAuth" className="oauth-icon" onClick={signInWithFacebook}/>
                        <img src="./assets/icons/icon_github.svg" alt="Github OAuth" className="oauth-icon" onClick={signInWithGithub}/>
                    </div>
                    <div style={{marginTop: 100}}>
                        Don't have an account yet ?
                        <a className="sign-up" onClick={() => navigate('/signup')}>Sign up</a>
                    </div>
                </form>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} pauseOnFocusLoss={false} />
        </div>
    );
};

export default Login;
