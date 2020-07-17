import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

const Google = ({informParent = f => f}) => {
  const responseGoogle = (response) => {
    console.log(response.tokenId);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        console.log("GOOGLE SIGN SUCCESS", response);
        //inform parent component
        informParent(response)
      })
      .catch((error) => {
        console.log("ERROR SIGNIN ERROR", error.response);
      });
  };
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="btn btn-danger btn-lg btn-block"
            disabled={renderProps.disabled}
          >
            <i className="fab fa-google pr-2"></i>Login with Google{" "}
          </button>
        )}
        cookiePolicy={`single_host_origin`}
      />
    </div>
  );
};

export default Google;
