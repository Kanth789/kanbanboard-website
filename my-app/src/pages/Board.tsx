import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import boardApi from "../api/boardApis";
import { Box, Divider, IconButton, TextField } from "@mui/material";
import {
  DeleteOutlined,
  StarBorderOutlined,
  StarOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setBoards } from "../redux/features/boardSlice";
import { setFavouriteList } from "../redux/features/favouriteSlice";
import { RootState } from "../redux/store";
import Sections from "../components/common/Sections";
import { toast } from "react-toastify";
import UI from "../constants/ui";

let timer: NodeJS.Timeout;
const timeout = 500;
interface BoardItem {
  _id: string;
  user: string;
  title: string;
  description: string;
  position: number;
  favourite: boolean;
  favouritePosition: number;
  __v: number;
}


const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favouriteList = useSelector(
    (state: RootState) => state.favourites.value
  );
  const boards = useSelector((state: RootState) => state.board.boards);
  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getParticularOne(boardId);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setSections(res.data.sections);
        setIsFavourite(res.data.favourite);
      } catch (err) {
        alert(err);
      }
    };
    getBoard();
  }, [boardId]);
  const updateDescription = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    const newDescription = e.currentTarget.value;
    setDescription(newDescription);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const updateTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e._id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e._id === boardId);
      tempFavourite[favouriteIndex] = {
        ...tempFavourite[favouriteIndex],
        title: newTitle,
      };
      dispatch(setFavouriteList(tempFavourite));
    }

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        alert(err);
      }
    }, timeout);
  };

  const addFavourites = async () => {
    try {
      const response = await boardApi.update(boardId, { favourite: !isFavourite });
      
      const updatedBoard: BoardItem = response.data;
  
      let newFavouriteList = [...favouriteList];
  
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter((e) => e._id !== boardId);
      } else {
        newFavouriteList.unshift(updatedBoard);
      }
  
      dispatch(setFavouriteList(newFavouriteList));
      setIsFavourite(!isFavourite);
    } catch (err) {
      alert(err);
    }
  };
  

  const deleteBoard = async () => {
    try {
      await boardApi.deleteBoard(boardId);
      toast.success(UI.DELETED_SUCCESSFUL, {
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter((e) => e._id !== boardId);
        dispatch(setFavouriteList(newFavouriteList));
      }
      const newList = boards.filter((e) => e._id !== boardId);
      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0]._id}`);
      }
      dispatch(setBoards(newList))

    } catch (err) {
      alert(err);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <IconButton onClick={addFavourites}>
          {isFavourite ? (
            <StarOutlined color="warning" />
          ) : (
            <StarBorderOutlined />
          )}
        </IconButton>
        <IconButton color="error" onClick={deleteBoard}>
          <DeleteOutlined />
        </IconButton>
      </Box>
      <Box sx={{ p: 2 }}>
        <TextField
          value={title}
          onChange={updateTitle}
          placeholder="Untitled"
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { p: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "700" },
          }}
        />
        <TextField
          value={description}
          onChange={updateDescription}
          placeholder="Add a description"
          variant="outlined"
          multiline
          fullWidth
          sx={{
            "& .MuiOutlinedInput-input": { padding: 0 },
            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
            "& .MuiOutlinedInput-root": { fontSize: "0.8rem" },
          }}
        />
        <Divider sx={{ mt: 1 }} />
        <Box>
          <Sections sections={sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  );
};

export default Board;
