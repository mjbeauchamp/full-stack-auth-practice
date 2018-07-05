//Creating your "store", which contains your global "store" state
import {createStore} from 'redux';
import reducer from "./ducks/users";


export default createStore(reducer);