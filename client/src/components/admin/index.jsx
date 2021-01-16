import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Home from './home';
import Add from './add';
import Books from './books';
import Book from './book';

function AdminIndex(props){
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        Axios.get('http://localhost:8000/api/checkAuthentication', {withCredentials: true})
        .then(result => {
            if(mounted){
                if(result.data){
                    Axios.get('http://localhost:8000/api/checkAdminAuthentication', {withCredentials: true})
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

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }

    if(!isAdmin){
        return(
            <Redirect
            to={{
                pathname: '/',
                state: { from: props.location }
            }}
            />
        );
    }

    return(
        <div className="admin">
            <BrowserRouter>
            <div className="admin-panel">
                <Switch>       
                    <Route path="/admin" component={Home} exact/>
                    <Route path="/admin/add" component={Add} />
                    <Route path="/admin/books" component={Books} />
                    <Route path="/admin/book/:title" component={Book} />
                    <Redirect to="/" />
                </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default AdminIndex;