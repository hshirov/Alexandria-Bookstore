import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {app} from '../../firebase/index';
import {BeatLoader} from 'react-spinners';

function FeaturedBook(props){
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        if(mounted){
            const storageRef = app.storage().ref();
            storageRef.child(`${props.book.image}`).getDownloadURL()
            .then((url) => {
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
        <div className="featured-book-item">
                <div className="featured-image-container">
                    <button onClick={() => {props.history.push("/book/" + props.book.title)}}>
                        <img src={imageUrl} alt=""/>
                    </button>
                </div>
            </div>
    );
}

export default withRouter(FeaturedBook);