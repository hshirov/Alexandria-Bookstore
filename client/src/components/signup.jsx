import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import {toast} from 'react-toastify';
import '../css/forms.css';

function SignUp(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [accountCreated, setAccountCreated] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);
    toast.configure();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        Axios.get(`${apiUrl}/api/checkAuthentication`, { withCredentials: true })
        .then(result => {
            setIsLoggedIn(result.data);
            setLoading(false);
        })
        .catch(() => props.history.push('/error'));
    }, [props.history]);

    const onSubmit = (event) => {
        event.preventDefault()
        // Reset the alerts on every call to the API
        setAlerts([]);

        Axios.post(`${apiUrl}/api/signup`, {email: email, password: password, confirmPassword: confirmPassword})
        .then((res) => { 
            const errors = res.data.errors;      
            if(errors.length > 0 && errors[0].msg === 'Succesfully created'){
                toast.success("Account created successfully!", {position: toast.POSITION.BOTTOM_RIGHT, pauseOnHover: false, autoClose: 2000});
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAccountCreated(true);
            }else{
                setAlerts(errors);
            }
        })
        .catch(() => {
            props.history.push('/error');
        });
    }
   
    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }

    if(isLoggedIn){
        return(
            <Redirect
            to={{
                pathname: '/',
                state: { from: props.location }
            }}
            />
        );
    }

    const alertsList = alerts.map(elem => {return <div className="alert" role="alert" key={elem.msg}>{elem.msg}</div>});

    return (    
        <div className="form-container">
            <form className="form"> 
                <p className="form-title">Register as a new user</p>
                <div className="input-title">Email</div>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/><br/>
                <div className="input-title">Password</div>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/><br/>
                <div className="input-title">Confirm password</div>
                <input type="password" name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/><br/>
                <div className="submit-container">
                    <button className="submit-button" onClick={onSubmit}>SIGN UP</button>
                </div>                
            </form>
            <div className="alert-container">
                <div className="alert" role="alert" style={{display: accountCreated ? '' : 'none'}}>Please, check your email for confirmation.</div>
                {alertsList}
            </div>
        </div>
    );
}

export default SignUp;