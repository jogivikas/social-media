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

const 