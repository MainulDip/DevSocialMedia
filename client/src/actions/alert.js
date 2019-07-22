import { SET_ALERT, REMOVE_ALERT } from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
    const id = uuid.v4();
    // This Will Call The action.js Reducer from somewhere else
    // By Packed Into 2nd Parameter Of reducers/action.js reducer's action parameters

    // As action.type and action.payload
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    })

    setTimeout(()=>dispatch({type: REMOVE_ALERT, payload: id}), timeout)
}

// export const setAlert = (msg, alertType) => {
//     const id = uuid.v4()
//     // This Will Call The action.js Reducer from somewhere else
//     // By Packed Into 2nd Parameter Of reducers/action.js reducer's action parameters

//     // As action.type and action.payload
//     return ({
//         type: SET_ALERT,
//         payload: {msg, alertType, id}
//     })
// }


// export const setAlert = (msg, alertType) => {
//   const id = uuid.v4()
//   return { type: SET_ALERT, payload: { msg, alertType, id } }
// }
