import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {BeatLoader} from 'react-spinners';
import {toast} from 'react-toastify';
import BasketItem from './partial/basketItem';
import '../css/basket.css';

function Basket(props){
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isBasketEmpty, setisBasketEmpty] = useState(null);
    const [loading, setLoading] = useState(true);
    toast.configure();
    const apiUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        let mounted = true;

        Axios.get(`${apiUrl}/api/basket/getItems`, {withCredentials: true})
        .then(res => {
            if(mounted){
                if(res.data === 'emptyBasket'){
                    setisBasketEmpty(true);
                }else{
                    setisBasketEmpty(false);
                    const requestedItems = res.data;
                    setItems(requestedItems.array);
                    setTotalPrice(requestedItems.totalPrice);
                }
                setLoading(false);
            }
        })
        .catch(() => props.history.push('/error'));

        return () => {
            mounted = false;
        }
    }, [props.history]);

    const clearBasket = () => {
        Axios.get(`${apiUrl}/api/basket/clear`, {withCredentials: true})
        .then(() => {
            toast.info("Basket cleared!", {position: toast.POSITION.BOTTOM_RIGHT, pauseOnHover: false, autoClose: 2000});
            setisBasketEmpty(true);
        });
    }

    const removeItem = (id) => {
        Axios.get(`${apiUrl}/api/basket/remove/${id}`, {withCredentials: true})
        .then(() => {
            window.location.reload();
        });
    }

    if(loading){
        return <div className="loading-container"><BeatLoader loading/></div>;
    }

    if(isBasketEmpty){
        return(
            <div className="basket-empty-container">
                <h1>Your basket is empty. Go do some shopping.</h1>
            </div>
        );
    }

    const itemList = items.map(book => {
        return(
            <BasketItem book={book} removeItem={removeItem} key={book.item.title} />
        );
    });

    return (
        <div className="basket-container">
            <div className="basket-items-container">
                {itemList}
            </div>
            <div className="basket-info">
                <h2>Total: ${totalPrice}</h2>
                <button onClick={clearBasket}>Clear basket</button>
            </div>
        </div>
    );
}

export default Basket;