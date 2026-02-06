import {FETCH_ALL,CREATE,UPDATE,DELETE,LIKE} from "../constants/ActionTypes";

import * as api from '../api';

//Action creators
export const getPosts=()=>async (dispatch)=>{              //For the thunk 
    try {
        const {data}=await api.fetchPosts();

        dispatch({type: FETCH_ALL ,payload:data})
    } catch (error) {
        console.log(error.message);
    }

    // const action={type:"FETCH_ALL",payload:[]};
    // dispatch(action);                           This two lines combined above into single
}

export const createPost = (post) => async (dispatch) => {
  try {
    console.log("Sending post to backend:", post); // ✅ See exactly what is being sent
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.error("Error in createPost:", error.response?.data || error.message);
  }
};

export const updatedPost=(id,post)=>async(dispatch)=>{
    try {
        const {data}=await api.updatePost(id,post);

        dispatch({type: UPDATE ,payload:data});
    } catch (error) {
        console.log(error);
    }
}

export const deletePost=(id)=>async(dispatch)=>{
    try {
        await api.deletePost(id);

        dispatch({type: DELETE ,payload:id});
    } catch (error) {
        console.log(error);
    }
}

export const likePost = (id) => async (dispatch) => {
  try {
    // ✅ CORRECT: Extract 'data' from the response
    const { data } = await api.likePost(id);

    // ❌ WRONG: const response = await api.likePost(id);
    
    dispatch({ type: 'LIKE', payload: data });
  } catch (error) {
    console.log(error);
  }
};


