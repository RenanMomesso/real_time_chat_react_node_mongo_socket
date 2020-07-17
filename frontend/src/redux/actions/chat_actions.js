import axios from 'axios';
import {AFTER_POST_MESSAGE,GET_CHATS} from './types'

export function getChats(){
    const request = axios.get('http//localhost:8000/api/getChats')
    .then(response => response.data)

    return {
        type:GET_CHATS,
        payload:request
    }




}

export function afterPostMessage(data){
    return {
        type:AFTER_POST_MESSAGE,
        payload:data
    }
}