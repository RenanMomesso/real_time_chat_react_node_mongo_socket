import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";

const Forgot = () => {
  const history = useHistory()
  const [values, setValues] = useState({
    email: "",
    buttonText: "Request",
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const submitSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "requesting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        setValues({...values, buttonText:'requested'})
        toast.success(response.data.message)
      })
      .catch((error) => {
        console.log("ERROR:",error.response.data);
        setValues({ ...values, buttonText: "submit" });
        toast.error(error.response.data.error);
      });
  };

  const forgotSigninForm = () => (
    <form onSubmit={submitSubmit}>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          className="form-control"
          values={email}
          onChange={handleChange("email")}
          type="text"
        />
      </div>
     
      <button type="submit">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      
      <ToastContainer />
      <div className="col-d-6 offset-md-3"></div>
      <h1 className="p-5">Forgot</h1>
      {forgotSigninForm()}
    </Layout>
  );
};

export default Forgot;
