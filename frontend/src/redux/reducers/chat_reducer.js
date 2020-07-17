import { AFTER_POST_MESSAGE, GET_CHATS } from "../actions/types";

export default function (state = {}, action) {
  switch (action.payload) {
    case GET_CHATS:
      return { ...state, chats: action.payload };
    case AFTER_POST_MESSAGE:
      return { ...state, chats: state.chats.concat(action.payload) };
    default:
      return state;
  }
}
