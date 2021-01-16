import React from 'react';
import '../../css/admin.css';

function Home(props){
    return(
        <div>
            <h1 className="admin-panel-title">Admin Panel</h1>
            <div className="admin-buttons-container">
                <button className="admin-button" onClick={() => props.history.push('/admin/add')}>Add</button><br/>
                <button className="admin-button" onClick={() => props.history.push('/admin/books')}>Modify</button>
            </div>           
        </div>
    );
}

export default Home;