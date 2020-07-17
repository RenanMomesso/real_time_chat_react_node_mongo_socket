import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";
import jwt from "jsonwebtoken";

const Reset = ({ match }) => {
  // props.match from react-router-dom
  const history = useHistory();
  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Request",
  });

  const { name, token, newPassword, buttonText } = values;

  useEffect(() => {
    const token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const submitSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Done" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        setValues({ ...values, buttonText: "requested" });
        toast.success(response.data.message);
        setTimeout(() => {
          history.push('/')
        }, 5000);
      })
      .catch((error) => {
        console.log("ERROR:", error.response.data);
        setValues({ ...values, buttonText: "Reset password" });
        toast.error(error.response.data.error);
      });
  };

  const resetPasswordForm = () => (
    <form onSubmit={submitSubmit}>
      <div className="form-group">
        <label className="text-muted">New Password</label>
        <input
          className="form-control"
          placeholder="Try a new password"
          values={newPassword}
          onChange={handleChange}
          type="password"
        />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      <ToastContainer />
      <div className="col-d-6 offset-md-3"></div>
      <h1 className="p-5">Hey, {name} . Type your new password</h1>
      {resetPasswordForm()}
    </Layout>
  );
};

export default Reset;
