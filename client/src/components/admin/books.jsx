import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import {DescendingIcon, AscendingIcon} from '../partial/icons';
import Book from './partial/book';
import {app} from '../../firebase/index';
const qs = require('qs');

function Books(props){
    const [books, setBooks] = useState([]);
    const [genre] = useState(qs.parse(props.location.search, {ignoreQueryPrefix: true}).genre);
    const [sortBy] = useState(qs.parse(props.location.search, {ignoreQueryPrefix: true}).orderby);
    const [descending] = useState(qs.parse(props.location.search, {ignoreQueryPrefix: true}).descending);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const APIRequest = `http://localhost:8000/api/books/getAll?genre=${genre ? genre : ''}&orderby=${sortBy ? sortBy : 'title'}&descending=${descending ? descending : 'false'}`;
        Axios.get(APIRequest, {withCredentials: true})
        .then(res => {
            if(mounted){
                setBooks(res.data);
                setLoading(false);
            }
        })
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [descending, genre, sortBy, props.history]);

    // Saves the sorting options in the URL
    const redirect = (genre, orderBy, descending) => {
        props.history.push({
            pathname: '/admin/books',
            search: `?genre=${genre ? genre : ''}&orderby=${orderBy ? orderBy : 'title'}&descending=${descending ? descending : 'false'}`
          });
          window.location.reload();
    }

    const remove = (id, image) => {
        Axios.post('http://localhost:8000/api/admin/remove', {id: id}, {withCredentials: true})
        .then(() => {
            const storageRef = app.storage().ref();
            storageRef.child(image).delete();
            window.location.reload();
        })
        .catch(() => props.history.push('/error'));
    }

    const bookList = books.map(book => {
        return <Book book={book} remove={remove} key={book.title}/>;
    });

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }
    
    return (
        <div>
            <button onClick={() => props.history.push('/admin')}>Back to admin panel</button>   
            <h1 className="genre-title">{genre}</h1>
            <div className="sort-options-container">
                <form className="order-by-form">
                    <label>
                        Order by:&nbsp;
                        <select value={sortBy} onChange={(e) => redirect(genre, e.target.value, descending)}>
                            <option value="title">Title</option>
                            <option value="author">Author</option>
                            <option value="price">Price</option>
                        </select>
                    </label>
                    <button type="button" onClick={() => redirect(genre, sortBy, descending === 'true' ? 'false' : 'true')}>
                    {descending === 'true' ? <DescendingIcon width="20" height="20"/> 
                    : <AscendingIcon width="20" height="20"/>}
                </button>  
                </form>             
            </div>
            <div className="book-container">
                {bookList}
            </div>
        </div>
    );
}

export default withRouter(Books);