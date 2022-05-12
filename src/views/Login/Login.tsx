import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from 'react';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import * as GoogleLogo from '../../assets/icon_google.svg';
// const GoogleIcon = require('../../assets/icon_google.svg') as string;
// const FacebookIcon = require('../../assets/icon_facebook.svg') as string;
// const LinkedInIcon = require ('../../assets/icon_linkedin.svg') as string;

const Login = ({setToken}: {setToken: Dispatch<SetStateAction<string>>}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast.error("En construction !");
        // setToken('okay');
    }

    return (
        <div className="Login">
            <div className="login-wrapper">
                <p className="login-title">Login</p>
                <form onSubmit={handleSubmit}>
                    <div><input type="text" onChange={onChangeUsername} className="username-box" placeholder="Username or Email Address *" /></div>
                    <div><input type="password" onChange={onChangePassword} className="password-box" placeholder="Password *" /></div>
                    <div className="row">
                        <input type="checkbox" />
                        <span className="rememberme-text">Remember me</span>
                        <a href="#" className="forgot-text">Forgot?</a>
                    </div>
                    <button type="submit" className="login-button">Log in</button>
                    <div className="separator"><span className="separator-text">Or</span></div>

                    <div className="auth-icons">
                        <img src="assets/icons/icon_google.svg" alt="Log in with Google" className="icon"/>
                        <img src="assets/icons/icon_facebook.svg" alt="Log in with Facebook" className="icon" />
                        <img src="assets/icons/icon_linkedin.svg" alt="Log in with LinkedIn" className="icon" />
                    </div>

                </form>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} pauseOnFocusLoss={false} />
        </div>
    );
};

export default Login;
