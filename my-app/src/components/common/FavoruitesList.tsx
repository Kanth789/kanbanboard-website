import { Box, ListItem, ListItemButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import boardApi from "../../api/boardApis";
import { setFavouriteList } from "../../redux/features/favouriteSlice";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import UI from "../../constants/ui";

const FavoruitesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const list = useSelector((state: RootState) => state.favourites.value);
  const [activeIndex, setActiveIndex] = useState(0);
  const { boardId } = useParams();


  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites()
        dispatch(setFavouriteList(res))
      } catch (err) {
      }
    }
    getBoards()
  }, [])

  useEffect(
    () => {
      const activeItem = list.findIndex((e) => e._id === boardId);
      setActiveIndex(activeItem);
    },
    [list,
    boardId]
  );
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newlist = [...list];
    const [removed] = newlist.splice(source.index, 1);
    newlist.splice(destination.index, 0, removed);

    const activeItem = newlist.findIndex((e) => e._id === boardId);
    setActiveIndex(activeItem);
    dispatch(setFavouriteList(newlist));

    try {
      await boardApi.UpdateFavouritesPosition({ boards: newlist });
    } catch (err) {
      alert(err);
    }
  };
  return (
    <>
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
            {UI.FAVOURITES}
          </Typography>
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          key={"list-board-droppable-key"}
          droppableId={"list-board-droppable"}
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {(list ?? []).map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <ListItemButton
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      selected={index === activeIndex}
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
    </>
  );
};

export default FavoruitesList;
