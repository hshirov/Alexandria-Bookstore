import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

function Navigation(props){ 
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        let mounted = true;
        
        Axios.get('http://localhost:8000/api/genres/getAll', {withCredentials: true})
        .then(res => {
            if(mounted){
                setGenres(res.data);
            }
        })
        .catch(() => props.history.push('/error'));
        
        return () => {
            mounted = false;
        }
    }, [props.history]);

    const genreList = genres.map(genre => {
        return(
            <button type="button" onClick={() => {props.history.push(`/books?genre=${genre.name}`);  window.location.reload()}} key={genre.name}>{genre.name}</button>
        );
    });

    return(
        <div className="nav-bar">
            <button key="all" type="button" onClick={() => {props.history.push('/books'); window.location.reload()}}>All</button>
            {genreList}
        </div>
    );
}

export default withRouter(Navigation);
