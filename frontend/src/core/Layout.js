import React, { Fragment } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { isAuth, signout } from "../auth/Helpers";

const Layout = ({ children, history, match }) => {
  // const historia = useHistory()
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000", borderBottom: "1px solid black", outline: 0 };
    } else {
      return { color: "#FFF" };
    }
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>

      {isAuth() &&
        isAuth().role ===
          "AdministradordaPagina99999910201231981293123198239" && (
          <Link className="nav-link" style={isActive('/admin')} to="/admin">{isAuth().name}</Link>
        )}

      {isAuth() &&
        isAuth().role ===
          "subscriber" && (
            <li className="nav-link">
              <Link style={isActive('/private')} to="/private">{isAuth().name}</Link>

            </li>
        )}

      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link to="/signin" className="nav-link" style={isActive("/signin")}>
              Signin
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" style={isActive("/signup")}>
              Signup
            </Link>
          </li>
        </>
      )}

{isAuth() && (
  <li className="nav-item">
   <li className="nav-item">
            <Link to="/chatroom" className="nav-link" style={isActive("/chatroom")}>
              chatroom
            </Link>
          </li>
  </li>
)}
      {isAuth() && (
        <li className="nav-item">
          <span
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Logout
          </span>
        </li>
      )}
      
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
