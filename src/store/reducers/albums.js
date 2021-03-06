import {LOAD} from "../actions/albums";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOAD: {
      return {
        ...state,
        list: action.list,
      };
    }

    default:
      return state;
  }
}