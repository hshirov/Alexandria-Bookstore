import React from "react"
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import SignUp from "./components/signup";
import Home from "./components/home";
import LogIn from "./components/login";
import Books from "./components/books"
import Book from "./components/book"
import Basket from "./components/basket"
import Header from "./components/partial/header"
import Error from "./components/error/error"
//Admin panel
import AdminIndex from "./components/admin/index";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
      <Header />
      <div className="content">
          <Switch>       
            <Route path="/" component={Home} exact/>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={LogIn} />
            <Route path="/books/:genre?" component={Books} />
            <Route path="/basket" component={Basket} />
            <Route path="/book/:title" component={Book} />
            <Route path="/admin" component={AdminIndex} />
            <Route path="/error" component={Error} />
            <Redirect to="/" />
          </Switch>
        </div>
      </BrowserRouter>
      </div>
  );
}

export default App;
