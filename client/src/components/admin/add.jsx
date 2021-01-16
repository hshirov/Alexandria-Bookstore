import React, {useState, useEffect} from 'react';
import {app} from '../../firebase/index';
import {toast} from 'react-toastify';
import Axios from 'axios';

function Add(props){
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [price, setPrice] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [description, setDescription] = useState('');
    const [availability, setAvailability] = useState(true);
    const [featured, setFeatured] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [genres, setGenres] = useState([]);
    toast.configure();
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        let mounted = true;

        Axios.get(`${apiUrl}/api/genres/getAll`, {withCredentials: true})
        .then(res => {
            if(mounted){
                const requestedGenres = res.data;
                setGenres(requestedGenres);
            }
        })
        .catch(() => {
            props.history.push('/error');
        });

        return () => {
            mounted = false;
        }
    }, [props.history]);

    const handleChange = event => {
        const img = event.target.files[0];
        setImage(img);
    }

    // Accessing firebase is done client-side
    const uploadImage = async () => {
        const storageRef = await app.storage().ref();
        const imageName = title + ' - ' + author;
        const fileRef = await storageRef.child(imageName);
        await fileRef.put(image);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const imageName = title + ' - ' + author;
        Axios.post(`${apiUrl}/api/admin/add`, {title: title, author: author, genre: genre, price: price, 
        publishedDate: publishedDate, description: description, availability: availability, featured: featured, image: imageName}, {withCredentials: true})
        .then(res => {
            const errors = res.data.errors;
            if(errors.length > 0 && errors[0].msg === 'Succesfully created'){
                setAlerts([]);                               
                uploadImage();
                toast.success("Book added!", {position: toast.POSITION.BOTTOM_RIGHT, pauseOnHover: false, autoClose: 2000});
                setTimeout(() => window.location.reload(), 2000);
            }else{
                setAlerts(errors);
            }
        })
        .catch(() => {
            props.history.push('/error');
        });
    }

    const isInputNumber = (event) => {
        const ch = String.fromCharCode(event.which);
        if(!(/[0-9]/.test(ch))){
            event.preventDefault();
        }
    }

    const alertsList = alerts.map(elem => {return <div className="alert" role="alert" key={elem.msg}>{elem.msg}</div>});
    const genreOptions = genres.map(genre => {return <option value={genre.name} key={genre.name}>{genre.name}</option>}); 

    return(
        <div className="form-container">        
            <form className="form-admin">
                <h1 className="admin-add-title">Add a new book</h1>
                <input type="text" name="title" placeholder="*Title" maxLength="255" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" name="author" placeholder="*Author" value={author} maxLength="255" onChange={(e) => setAuthor(e.target.value)}/>
                <select className="genre-dropdown" value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="" disabled defaultValue>Select genre</option>
                    {genreOptions}
                </select>
                <textarea type="text" name="description" placeholder="Description" maxLength="255" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="text" name="price" min="1" max="999" placeholder="*Price in dollars" maxLength="5" value={price} onChange={(e) => setPrice(e.target.value)} onKeyPress={(e) => isInputNumber(e)}/>
                <input type="text" name="publishedDate" placeholder="Published Date" maxLength="255" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)}/>
                <div className="drain">
                    <input type="checkbox" id="availability" name="availability" checked={availability} onChange={() => setAvailability(!availability)} />
                    <label htmlFor="availability">Is available</label><br/>
                    <input type="checkbox" id="featured" name="featured" checked={featured} onChange={() => setFeatured(!featured)} />
                    <label htmlFor="featured">Featured on home page</label><br/>
                    <label htmlFor="file">Select book cover image:</label>
                    <input id="file" type="file" onChange={(e) => handleChange(e)}/><br/>
                </div>     
                <button className="submit-button" onClick={(e) => handleSubmit(e)} style={{display: image ? '' : 'none'}}>Add</button>
                {alertsList}
            </form>
            <button className="admin-back-button" onClick={() => props.history.push('/admin')}>Back to admin panel</button>      
        </div>
    );
}

export default Add;