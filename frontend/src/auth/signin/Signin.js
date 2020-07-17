import React, { useState } from "react";
import { Redirect, useHistory, Link} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../../core/Layout";
import Google from '../Google'
import Facebook from '../Facebook'
import { authenticate, isAuth } from "../Helpers";

const Signin = () => {
  const history = useHistory()
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = response => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "AdministradordaPagina99999910201231981293123198239" ? history.push('/admin') : history.push('/private')
    });
  }

  const submitSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "submiting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        // usando o response, ele retorna tudo do servidor, ele volta data(que sao as informações q enviamos no backend[ex: return res.json({oq queremos enviar})], além de um monte de coisa como header, status,etc..., já o resposne.data volta apenas aquilo qeremos no servidor, como enviei token e user, se eu quiser o token eu coloco response.data.token)
        // console.log("USUANDO APENAS RESPONSE", response)
        // console.log("USANDO RESPNSE.DATA", response.data)
        //o metodo authenticate criado no Helpers pega o response como primeiro parametro, lá ele separa conforme escrito por mim, ele vai pegar para o token, o response.data.token, aqui estou enviando tudo que está no response, e o next  usado como função de callback para retornar a proxima função
        authenticate(response, () => {
          setValues({ ...values, email:'',password:'',buttonText: "submited" });
          // toast.success("Login realizado com sucesso.");
          isAuth() && isAuth().role === "AdministradordaPagina99999910201231981293123198239" ? history.push('/admin') : history.push('/private')
        });
      })
      .catch((error) => {
        console.log("ERROR:",error.response.data);
        setValues({ ...values, buttonText: "submit" });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (
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
      <div className="form-group">
        <label className="text-muted">password</label>
        <input
          className="form-control"
          values={password}
          onChange={handleChange("password")}
          type="password"
        />
      </div>
      <button type="submit" className="btn btn-primary">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      
      <ToastContainer />
      {isAuth() ? <Redirect to="/"/> : null}
      <div className="col-d-6 offset-md-3"></div>
      <h1 className="p-5">Signin</h1>
      <Google informParent={informParent}/>
      <Facebook informParent={informParent}/>
      {signinForm()}
      <hr/>
      <Link to="/auth/password/forgot" className="btn btn-sm btn-outline-danger">Forgot password</Link>
    </Layout>
  );
};

export default Signin;
