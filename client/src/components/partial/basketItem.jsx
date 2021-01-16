import React, {useState, useEffect} from 'react';
import {XIcon} from './icons';
import {withRouter} from 'react-router-dom';
import {app} from '../../firebase/index';
import {BeatLoader} from 'react-spinners';

function BasketItem(props){
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const storageRef = app.storage().ref();
        storageRef.child(`${props.book.item.image}`).getDownloadURL()
        .then((url) => {
                if(mounted){
                    setImageUrl(url);
                    setLoading(false);
                }
            }
        )
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [props.book.item.image, props.history]);

    if(loading){
        return <div><BeatLoader loading/></div>;
    }

    return(
        <div className="book-in-basket" key={props.book.item._id}>
            <button onClick={() => {props.history.push("/book/" + props.book.item.title)}}>
                <img src={imageUrl} alt=""/>
            </button>
            <div className="book-in-basket-info">
                <h2>{props.book.item.title}</h2>
                <p>${props.book.item.price} x {props.book.quantity}</p>
                <button onClick={() => props.removeItem(props.book.item._id)}><XIcon width="30" height="30" /></button>
            </div>
        </div>
    );
}

export default withRouter(BasketItem);