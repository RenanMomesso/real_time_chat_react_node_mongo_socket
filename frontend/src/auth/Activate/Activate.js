import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../../core/Layout";
import axios from "axios";
import WhatsAppBadge from "react-whatsapp-badge";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt from 'jsonwebtoken'

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  const { name, token, show } = values;

  useEffect(() => {
    let token = match.params.token;
    // o match.params vem do react-router-dom, no qual o site que manda a rota com o id para cá, esta localizado no BrowserRouter, assim podemos desestruturar  props.match usando {match}, e ai pegando o token, pois está escrito no token assim /:token
    // console.log(token)
    //o metodo jwt.decode vai olhar o token que esta na rota ou parametro, e vai decodificar a parte name, pois está com name
    const {email} = jwt.decode(token)
    console.log(email)
    const {name} = jwt.decode(token)
    //se houver token disponivel, então ele ira decodificar este token com jwt.decode e pegar o name, e o token todo, e gravar no values
    if(token) {
      setValues({...values,name:name.toUpperCase(),token:token})
    }

  }, []);

  const clickSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("Account activation", response);
        setValues({
          ...values,
          name: "",
          show:false
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("error", error)
        console.log("Account activation error", error.response.data.error);
        toast.error(error.response.data.error);
      });
  };

  const activationLink = () => (
    <div>
      <h1 className="p-5 text-center">
        Hey, {name}, Ready to activation account?
      </h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
