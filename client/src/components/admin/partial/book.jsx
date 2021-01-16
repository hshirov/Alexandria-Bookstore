import React, {useState, useEffect} from 'react';
import {XIcon} from '../../partial/icons';
import {withRouter} from 'react-router-dom';
import {app} from '../../../firebase/index';
import {BeatLoader} from 'react-spinners';

function Book(props){
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        if(mounted){
            const storageRef = app.storage().ref();
            storageRef.child(`${props.book.image}`).getDownloadURL()
            .then(url => {
                    setImageUrl(url);
                    setLoading(false);
                }
            )
            .catch(() => props.history.push('/error'));
        }
        
        return () => {
            mounted = false;
        }
    }, [props.book.image, props.history]);

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }

    return(
        <div className="book-item" key={props.book._id}>
            <div className="image-container">
                <button onClick={() => {props.history.push("/admin/book/" + props.book.title)}}>
                    <img src={imageUrl} alt=""/>
                </button>
            </div>
            <div className="description-container">
                <h2 className="book-title">{props.book.title}</h2>
                <h3 className="book-author">{props.book.author}</h3>
                <button className="book-add-to-basket" title="Remove" onClick={() => {props.remove(props.book._id, props.book.image)}}>
                    <XIcon width="30" height="30"/>
                </button>
            </div>
        </div>
    );
}

export default withRouter(Book);