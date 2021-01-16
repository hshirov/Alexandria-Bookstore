import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import '../css/forms.css';

function LogIn(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get('http://localhost:8000/api/checkAuthentication', { withCredentials: true })
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

        Axios.post('http://localhost:8000/api/login', {email: email, password: password}, { withCredentials: true })
        .then((res) => {
            const errors = res.data.errors;        
            if(errors.length > 0 && errors[0].msg === 'Successfully Authenticated'){
                // If login was successful, redirect to home
                props.history.push('/');
                // this updates the isLoggedIn state in the header
                window.location.reload();
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
                <p className="form-title">Login as existing user</p>
                <div className="input-title">Email</div>
                <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                <div className="input-title">Password</div>
                <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                <div className="submit-container">
                    <button className="submit-button" onClick={onSubmit}>LOGIN</button><br />
                    or <button onClick={() => props.history.push('/signup')}>Sign up</button>
                </div>     
            </form>
            <div className="alert-container">
                {alertsList}
            </div>            
        </div>
    );
}

export default LogIn;