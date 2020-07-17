import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "./Helpers";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth() && isAuth().role === 'AdministradordaPagina99999910201231981293123198239' ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/signin", state: props.location }} />
      )
    }
  />

  //     <Route {...rest} render={
  //         props => isAuth() ? <Component {...props} /> : <Redirect to={{
  //             pathname="/signin",
  //             state: {from:props.location}
  //         }} />
  // }/>
);

export default AdminRoute;
