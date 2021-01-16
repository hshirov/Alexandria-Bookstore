import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import {LogOutIcon, BasketIcon} from './icons';
import '../../css/header.css';

function Header(props){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        let mounted = true;

        Axios.get(`${apiUrl}/api/checkAuthentication`, { withCredentials: true })
        .then(result => {
            if(mounted){
                if(result.data){
                    setIsLoggedIn(result.data);
                    Axios.get(`${apiUrl}/api/checkAdminAuthentication`, { withCredentials: true })
                    .then(data => {
                        setIsAdmin(data.data);
                        setLoading(false);
                    });
                }else{
                    setIsAdmin(false);
                    setLoading(false);
                }
            }
        })
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [props.history]);

    const logOut = () => {
        Axios.get(`${apiUrl}/api/logout`, { withCredentials: true })
        .then(result => {
            props.history.push(result.data);
            setIsLoggedIn(false);
        })
        .catch(() => {
            props.history.push('/error');
        });
    }

    if(loading){
        return(
            <div className="header">
                <div className="logo" onClick={() => props.history.push('/')}><p>Alexandria</p></div>       
            </div>
        );
    }

    if(isLoggedIn){
        return(
            <div className="header">
                <div className="logo" onClick={() => props.history.push('/')}><p>Alexandria</p></div> 
                <div className="log">
                    <button className="basket-button" title="Basket" onClick={() => props.history.push('/basket')}>
                        <BasketIcon width="20" height="20" />
                    </button>             
                    <button className="log-out-button" title="Log Out" onClick={logOut}>
                        <LogOutIcon width="20" height="20" />
                    </button>
                    <button style={{display: isAdmin ? '' : 'none'}} onClick={() => {props.history.push('/admin'); window.location.reload()}}>Admin panel</button>
                </div>       
            </div>
        );
    }

    // If not logged in
    return(
        <div className="header">
            <div className="logo" onClick={() => props.history.push('/')}><p>Alexandria</p></div>
            <div className="log">
                <button className="basket-button" title="Basket" onClick={() => props.history.push('/basket')}>
                    <BasketIcon width="20" height="20" />
                </button>
                <button onClick={() => props.history.push('/login')}>Login</button>
            </div>
        </div>
    );
}

export default withRouter(Header);