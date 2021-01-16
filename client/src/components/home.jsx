import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import {BeatLoader} from 'react-spinners';
import '../css/home.css';
import Navigation from './partial/navigation';
import FeaturedBook from './partial/featuredBook';
import Footer from './partial/footer';

function Home(props){
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        let mounted = true;

        Axios.get(`${apiUrl}/api/books/getAllFeatured`, {withCredentials: true})
        .then(res => {
            if(mounted){
                setFeaturedBooks(res.data);
                setLoading(false);
            }
        })
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [props.history]);

    const featuredBookList = featuredBooks.map(book => {return <FeaturedBook key={book.title} book={book}/>});

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }
    
    return (
        <div>        
            <Navigation />
            <h2 className="featured-title">Featured</h2>
            <div className="featured-container">        
                {featuredBookList}
            </div>
            <Footer />
        </div>
    );
}

export default withRouter(Home);