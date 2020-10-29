import { baseUrl } from '../../config';
// import { errorNotifications } from "../error-notifications.js";

export const TOKEN_KEY = "songcamp/authentication/TOKEN";
export const USER_ID = "songcamp/authentication/USER_ID";
export const USER_NAME = "songcamp/authentication/USER_NAME";
export const ARTIST_NAME = "songcamp/authentication/ARTIST_NAME";
export const IS_ARTIST = "songcamp/authentication/IS_ARTIST";
export const SET_TOKEN = "songcamp/authentication/SET_TOKEN";
export const REMOVE_TOKEN = "songcamp/authentication/REMOVE_TOKEN";

export const setToken = (token) => ({
    type: SET_TOKEN,
    token
})

export const removeToken = () => ({
    type: REMOVE_TOKEN,
})

export const loadToken = () => async (dispatch) => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if(token) {
        dispatch(setToken(token));
    };
};


// FAN SIGNUP ============================================================================
export const FanSignup = ({email, password, userName, artist, bio, imgUrl}) => async (dispatch) => {

    const body = {email, password, userName, artist, bio, imgUrl};

    try{
        const response = await fetch(`${baseUrl}/fans`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body)
        });
    
        if(!response.ok) {
            console.log('error!!!');
            throw response;
        }
    
        const { token, user: { id, userName, artistName, artist } } = await response.json();
        
        console.log('sign up successful!!!!');

        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(USER_ID, id);
        window.localStorage.setItem(USER_NAME, userName);
        window.localStorage.setItem(ARTIST_NAME, artistName);
        window.localStorage.setItem(IS_ARTIST, artist);
        
        //create actions to set artist name and is artist into state
        dispatch(setToken(token));

    } catch(err) {
        console.error(err);
        // errorNotifications(err);
    }
}



// ARTIST SIGNUP ============================================================================
export const ArtistSignup = ({email, password, userName, artist, artistName, bio, genre, imgUrl}) => async (dispatch) => {

    try{
        const response = await fetch(`${baseUrl}/artists`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email, password, userName, artist, artistName, bio, genre, imgUrl })
        });
    
        if(!response.ok) {
            throw response;
        }
    
        const { token, user: { id, userName, artistName, artist } } = await response.json();
        
        console.log('sign up successful!!!!');

        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(USER_ID, id);
        window.localStorage.setItem(USER_NAME, userName);
        window.localStorage.setItem(ARTIST_NAME, artistName);
        window.localStorage.setItem(IS_ARTIST, artist);
        
        dispatch(setToken(token));

    } catch(err) {
        console.error(err);
        // errorNotifications(err);
    }
}

// LOGIN ============================================================================
export const login = ({email, password}) => async (dispatch) => {

    try {
        const response = await fetch(`${baseUrl}/users/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    
        if(!response.ok) {
            throw response;
        }

        const { token, user: { id, userName, artistName, artist } } = await response.json();
        
        console.log("USER!", artist);
        window.localStorage.setItem(TOKEN_KEY, token);
        window.localStorage.setItem(USER_ID, id);
        window.localStorage.setItem(USER_NAME, userName);
        window.localStorage.setItem(ARTIST_NAME, artistName);
        window.localStorage.setItem(IS_ARTIST, artist);

        dispatch(setToken(token));

        console.log("LOG IN SUCCESSFUL!!!!");
    } catch(err) {
        console.error(err);
        // errorNotifications(err);
    }
}


// LOGOUT ============================================================================
export const logout = () => async (dispatch, getState) => {
    const { authentication: { token }} = getState();
    const response = await fetch(`${baseUrl}/users/token`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if(response.ok) {
        window.localStorage.removeItem(TOKEN_KEY);
        dispatch(removeToken());
    }
}
