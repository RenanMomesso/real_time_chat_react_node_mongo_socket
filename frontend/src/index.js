import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes'

//redux
import Reducer from './redux/reducers'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk'

const createStoreWithMiddleWare = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);


ReactDOM.render(
  <Provider
  store={createStoreWithMiddleWare(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
  )}
>

    <Routes />
  </Provider>
  ,document.getElementById('root')
);