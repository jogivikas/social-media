const { createSlice } = require("@reduxjs/toolkit");
const { connection } = require("next/server");
const { Profiler } = require("react");


const initialState = {
  user:[],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  
  ProfileFetched:false,
 connections:[],
  connectionRequests:[],

};

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
      reset:()=>{ 
        initialState,

        handleLoginUser:(state)=>{
          state.message="hello  world -hhdfhh"
        },
        
        },
    },

    extraReducers:(builder)=>{
        builder
        .addCase(handleLoginUser.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(handleLoginUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.user=action.payload
        })
        .addCase(handleLoginUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
    }
})