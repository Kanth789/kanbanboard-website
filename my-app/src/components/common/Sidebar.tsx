import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { AddBoxOutlined, LogoutOutlined } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import boardApi from "../../api/boardApis";
import { setBoards } from "../../redux/features/boardSlice";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import FavoruitesList from "./FavoruitesList";
import UI from "../../constants/ui";

const Sidebar = () => {
  const userDetails = useSelector((state: RootState) => state.user.value);
  const boards = useSelector((state: RootState) => state.board.boards);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeBoardIndex, setActiveBoardIndex] = useState(0);
  const sidebarWidth = 250;
  const username = userDetails?.user?.username || "Guest";

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res));
      } catch (err:any) {
        toast.error(`${err.msg}`, {
          position: "bottom-center",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };
    getBoards();
  }, []);

  useEffect(() => {
    if (boards && boards.length > 0) {
      const activeItem = boards.findIndex((e) => e?._id === boardId);
      if (boardId === undefined) {
        navigate(`/boards/${boards[0]._id}`);
      }
      setActiveBoardIndex(activeItem);
    }
  }, [boards, boardId, navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success(UI.LOGOUT_SUCCESSFUL, {
      position: "bottom-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newlist = [...boards];
    const [removed] = newlist.splice(source.index, 1);
    newlist.splice(destination.index, 0, removed);

    const activeItem = newlist.findIndex((e) => e._id === boardId);
    setActiveBoardIndex(activeItem);
    dispatch(setBoards(newlist));

    try {
      await boardApi.updatePosition({ boards: newlist });
    } catch (err) {
      alert(err);
    }
  };

  const onClickAdd = async () => {
    try {
      const res = await boardApi.create();
      const newItem = res.data;
      dispatch(setBoards([newItem, ...boards]));
      navigate(`/boards/${newItem._id}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <Drawer
        container={window.document.body}
        variant="permanent"
        open={true}
        sx={{
          width: sidebarWidth,
          height: "100%",
          "& > div": {
            borderRight: "none",
          },
        }}
      >
        <List
          disablePadding
          sx={{
            width: sidebarWidth,
            height: "100vh",
            backgroundImage:
              "linear-gradient(90deg, hsla(0, 0%, 37%, 1) 0%, hsla(59, 30%, 49%, 1) 100%)",
          }}
        >
          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight="600">
                {username}
              </Typography>
              <IconButton onClick={logout}>
                <LogoutOutlined fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
          <Box sx={{ paddingTop: "10px" }} />
          <FavoruitesList />
          <Box sx={{ paddingTop: "10px" }} />

          <ListItem>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight="600">
                {UI.PRIVATE}
              </Typography>
              <IconButton onClick={onClickAdd}>
                <AddBoxOutlined fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              key={"list-board-droppable-key"}
              droppableId={"list-board-droppable"}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {(boards ?? []).map((item, index) => (
                    <Draggable
                      key={item._id}
                      draggableId={item._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ListItemButton
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          selected={index === activeBoardIndex}
                          component={Link}
                          to={`/boards/${item._id}`}
                          sx={{
                            pl: "20px",
                            cursor: snapshot.isDragging
                              ? "grab"
                              : "pointer!important",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.title}
                          </Typography>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Drawer>
      
    </>
  );
};

export default Sidebar;
