import { Button } from '@material-ui/core';
import React from 'react'
import "./Login.css";
import { auth, provider } from './Firebase'
import { actionTypes } from './Reducer';
import { useStateValue } from './StateProvider';
function Login() {

    const [{ }, dispatch] = useStateValue();

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
            })
            .catch((error) => alert(error.message));
    };
    return (
        <div className="Login">
            <div className="login__container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/225px-WhatsApp.svg.png"
                    alt="whatsapp"
                />
                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>

                <Button onClick={signIn}>
                    <h3> Sign In with Google</h3>
                </Button>
            </div>
        </div>
    )
}

export default Login
