import cookie from "js-cookie";

// colocar no cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, { expires: 1 });
  }
};

//remover do cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, { expires: 1 });
  }
};

//pegar do cookie a informação colocada
//será util quando precisar fazer requisições ao servidor usando o cookie
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

//colocar no localstorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

//remover do localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

//autenticar usuario passando dados para o cookie e localstorage quando fazer login
//pegando as duas inforamções que criamos como função lá em cima, o setCookie e localStorage, ambos recebendo dois parametros, o primeiro é a chave, e o value é o valor da chave, como key recebemos token ou user, e como valor, o resultado do backend.
export const authenticate = (response, next) => {
  console.log("AUTHENTICATE HELPER ON SIGNIN RESPONSE", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

//accesar usuario vindo do localstorage
export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateUser = (response, next) => {
  console.log("UPDATE USER IN LOCALSTORAGE HELPER", response);
  if (window !== "undefined") {
    // primeiro vai pega o que está em user no localstorage
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data
    //este user vai pegar o valor que está em response.data, que é o mesmo passado em req.body.password ou name
    // e qndo pegar este valor vai enviar para o localstorage, ou seja, sera substituido
    localStorage.setItem('user',JSON.stringify(auth));
  }
  //função de callback next para prosseguir a operação, usando ()=>{}
  next();
};
