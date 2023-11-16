import React, { useState } from "react";
import { Box } from "@mui/material";
import  LoadingButton  from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApis";
import { setBoards } from "../redux/features/boardSlice";
import UI from "../constants/ui";

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false)
  const handleAddNewBoard = async () => {
    setLoading(true)
    try{
      const res = await boardApi.create()
      dispatch(setBoards([res.data]))
      navigate(`/boards/${res.data?._id}`)
    }catch(err){
      alert(err)
    }finally{
      setLoading(false)
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingButton
        variant="outlined"
        color="success"
        onClick={handleAddNewBoard}
      >
        {UI.CLICK_HERE_TO_ADD_NEW_BOARD}
      </LoadingButton>
    </Box>
   
  );
};

export default Home;
