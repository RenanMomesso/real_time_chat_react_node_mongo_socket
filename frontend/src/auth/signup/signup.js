import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../../core/Layout";
import axios from "axios";
import WhatsAppBadge from "react-whatsapp-badge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuth } from "../Helpers";

const Signup = () => {
  const [values, setValues] = useState({
    name: "renan",
    email: "renan",
    password: "123",
    buttonText: "Submit",
    loading: "true",
  });

  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log("name", name)
    // console.log("event",event.target.value)
    // console.log("values", values)
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submited",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const form = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          className="form-control"
          values={name}
          onChange={handleChange("name")}
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">email</label>
        <input
          className="form-control"
          values={email}
          onChange={handleChange("email")}
          type="email"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">password</label>
        <input
          className="form-control"
          values={password}
          onChange={handleChange("password")}
          type="password"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/"/> : null}

        <WhatsAppBadge
          text="hello"
          number="5519981317613"
          image="whatsapp.png"
        />
        <h1 className="p-5">Signup</h1>
        {form()}
      </div>
    </Layout>
  );
};

export default Signup;
