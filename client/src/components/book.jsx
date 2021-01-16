import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import {toast} from 'react-toastify';
import {CheckmarkIcon} from './partial/icons';
import {app} from '../firebase/index';
import '../css/books.css';
import 'react-toastify/dist/ReactToastify.css';

function Book(props){
    const [book, setBook] = useState({});
    const {title} = props.match.params;
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    toast.configure();

    useEffect(() => {
        let mounted = true;

        Axios.get(`http://localhost:8000/api/books/get/${title}`, {withCredentials: true})
        .then(res => {
            if(mounted){
                setBook(res.data);  
                const storageRef = app.storage().ref();
                storageRef.child(`${res.data.image}`).getDownloadURL()
                .then(url => {
                        setImageUrl(url);
                        setLoading(false);
                    }
                );
            }       
        })
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [title, props.history]);

    const addToBasket = (id) => {
        Axios.get(`http://localhost:8000/api/basket/add/${id}`, {withCredentials: true})
        .then(() => {toast.info("Book added to basket!", {position: toast.POSITION.BOTTOM_RIGHT, pauseOnHover: false, autoClose: 2000})});
    };

    const availability = book.available ?
    <p className="single-book-in-stock"><CheckmarkIcon width="20" height="20"/>In stock</p> 
    : <p className="single-book-out-of-stock">Out of stock</p>;

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }
    
    return (
        <div className="single-book-container">
            <div className="single-book-image">
                <img src={imageUrl} alt=""/>
            </div>
            <div className="single-book-info">
                <h1 className="single-book-title">{book.title}</h1>
                <h2 className="single-book-author">by {book.author}</h2>
                <p className="single-book-genre">Genre: {book.genre}</p>
                <p className="single-book-date" style={{display: book.publishedDate === '' ? 'none' : ''}}>Published: {book.publishedDate}</p>
                <p className="single-book-price">${book.price}</p>
                {availability}
                <button className="single-book-add-to-basket" onClick={() => {addToBasket(book._id)}}
                style={{display: book.available ? '' : 'none'}}>
                    Add to basket
                </button>
                <div className="single-book-description">
                    <h1 style={{display: book.description === '' ? 'none' : ''}}>Description</h1> 
                    {book.description}
                </div>
            </div> 
        </div>
    );
}

export default withRouter(Book);