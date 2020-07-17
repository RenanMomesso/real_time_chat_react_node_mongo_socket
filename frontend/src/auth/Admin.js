import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuth, getCookie, updateUser } from "./Helpers";

const Admin = () => {
  const [values, setValues] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
    buttonText: "Update profile",
  });

  ///read
  //update

  const history = useHistory();

  const { _id } = isAuth();

  const handleChange = (name) => (event) => {
    // console.log("name", name)
    // console.log("event",event.target.value)
    // console.log("values", values)
    setValues({ ...values, [name]: event.target.value });
  };

  const { token } = getCookie();
  //   console.log(token)

  const { name, email, password, role, buttonText } = values;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () =>
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${_id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log(error.response.data.error);
        if (error.response.status === 401) {
          history.push("/");
        }
      });

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,
      data: { name, password },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // console.log("SIGNUP SUCCESS", response);
        //a função Helpers updateUser possui dois parametros, response e next, por isso a função tem que ter dois parametros aqui, response e que é o next,()=>{}
        updateUser(response, () => {
          setValues({
            ...values,
            buttonText: "Submited",
          });
          toast.success("Profile updated successfully");
        });
      })
      .catch((error) => {
        // console.log(error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const form = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        {JSON.stringify(name)}
        <input
          className="form-control"
          defaultValue={name}
          onChange={handleChange("name")}
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input
          className="form-control"
          defaultValue={role}
          disabled
          type="text"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">email</label>
        <input
          className="form-control"
          defaultValue={email}
          type="email"
          disabled
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

        <h1 className="p-5">Signup</h1>
        {form()}
      </div>
    </Layout>
  );
};

export default Admin;
