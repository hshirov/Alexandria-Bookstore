import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import {app} from '../../firebase/index';
import 'react-toastify/dist/ReactToastify.css';

function Book(props){
    const [book, setBook] = useState({});
    const {title} = props.match.params;
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [available, setAvailable] = useState(null);
    const [featured, setFeatured] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        let mounted = true;

        Axios.get(`${apiUrl}/api/books/get/${title}`, {withCredentials: true})
        .then(res => {
            if(mounted){
                setBook(res.data);       
                const storageRef = app.storage().ref();
                storageRef.child(`${res.data.image}`).getDownloadURL()
                .then((url) => {
                        setImageUrl(url);
                        setAvailable(res.data.available);
                        setFeatured(res.data.featured);
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

    const updateAvailability = () => {
        Axios.post(`${apiUrl}/api/admin/update`, {id: book._id, field: 'available', value: !available}, {withCredentials: true})
        .catch(() => props.history.push('/error'));
        window.location.reload();
    }

    const updateFeatured = () => {
        Axios.post(`${apiUrl}/api/admin/update`, {id: book._id, field: 'featured', value: !featured}, {withCredentials: true})
        .catch(() => props.history.push('/error'));
        window.location.reload();
    }

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }
    
    return (
        <div>
            <button onClick={() => props.history.push('/admin/books')}>Back to books</button>
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
                    <button onClick={updateAvailability}>
                        <div className="availability-selector">
                            <div className={available ? "selected-outline" : ""}>
                                <p className="single-book-in-stock">In stock</p>
                            </div>
                            <div className={!available ? "selected-outline" : ""}>
                                <p className="single-book-out-of-stock">Out of stock</p>
                            </div>
                        </div>
                    </button><br />
                    <button onClick={updateFeatured}>{featured ? 'Remove from ' : 'Feature on '}home page</button>
                    <div className="single-book-description">
                        <h1 style={{display: book.description === '' ? 'none' : ''}}>Description</h1> 
                        {book.description}
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default withRouter(Book);