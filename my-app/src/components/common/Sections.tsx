import { AddOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskDetails from "./TaskDetails";
import UI from "../../constants/ui";

interface Task {
  _id: string;
  section: {
    _id: string;
    board: string;
    title: string;
    description: string;
    __v: number;
    id: string;
  };
  title: string;
  content: string;
  position: number;
  __v: number;
  id: string;
}

interface Section {
  _id: string;
  board: string;
  title: string;
  description: string;
  __v: number;
  tasks: Array<Task>;
}
interface Props {
  sections: Array<Section>;
  boardId?: string;
}

let timer: NodeJS.Timeout;
const timeOut = 500;

const Sections = ({ sections, boardId }: Props) => {
  const [data, setData] = useState<Array<Section>>([]);
  const [selectedItem, setSelectedItem] = useState<Task | null>(null);
  const [shouldModalOpen,setShouldModalOpen] = useState(false)
  useEffect(() => {
    setData(sections);
  }, [sections]);

  const onClickAdd = async () => {
    try {
      const response = await sectionApi.create(boardId);
      const section: Section = response.data;
      setData([...sections, section]);
    } catch (err) {
      alert(err);
    }
  };
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e._id === source.droppableId);
    const endColIndex = data.findIndex(
      (e) => e._id === destination.droppableId
    );
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[endColIndex];

    const sourceSectionId = sourceCol._id;
    const destinationSectionId = destinationCol._id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[endColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed);
      data[endColIndex].tasks = destinationTasks;
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      alert(err);
    }
  };

  const onClickDeleteSection = async (sectionId: string) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter((e) => e._id !== sectionId);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };
  const updateSectionTitle = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e._id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
       
        alert(err);
      }
    }, timeOut);
  };
  const onClickOnAddSection = async (sectionId: string) => {
    try {
      const response = await taskApi.create(boardId, { sectionId });
      const task: Task = response.data;

      const newData = [...data];
      const index = newData.findIndex((e) => e._id === sectionId);
      newData[index].tasks.unshift(task);
      setData(newData);
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateTask = (task: Task) => {
    if (task) {
      const newData = [...data];
      const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
      if (sectionIndex !== -1) {
        const taskIndex = newData[sectionIndex].tasks.findIndex(
          (e) => e._id === task._id
        );
        if (taskIndex !== -1) {
          newData[sectionIndex].tasks[taskIndex] = task;
          setData(newData);
        }
      }
    }
  };
  

  const onDeleteTask = (task: Task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e._id === task.section._id);
    const taskIndex = newData[sectionIndex].tasks.findIndex(
      (e) => e._id === task._id
    );
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };


  const onClose = () =>{
    setSelectedItem(null)
    setShouldModalOpen(false)
  }
  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Button onClick={onClickAdd}>{UI.ADD_SECTION}</Button>
        <Typography variant="body2" fontWeight="600">
          {data.length} {UI.SECTIONS}
        </Typography>
      </Box>
      <Divider sx={{ margin: "10px 0" }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            width: "calc(100vw-400px)",
            overflow: "auto",
            flexWrap: "wrap",
            mb: 1,
          }}
        >
          {data.map((section) => (
            <div key={section._id} className="w-300">
              <Droppable key={section._id} droppableId={section._id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: "300px",
                      p: 2,
                      mr: 1,
                      borderRadius: 1,
                      border: "1px solid",
                      mb:1
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <TextField
                        value={section.title}
                        onChange={(e) =>
                          updateSectionTitle(
                            e as React.ChangeEvent<HTMLInputElement>,
                            section._id
                          )
                        }
                        placeholder="Untitled"
                        variant="outlined"
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-input": { padding: 0 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "unset ",
                          },
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1rem",
                            fontWeight: "700",
                          },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => onClickOnAddSection(section._id)}
                        sx={{ color: "gray", "&:hover": { color: "blue" } }}
                      >
                        <AddOutlined />
                      </IconButton>
                      <IconButton
                        onClick={() => onClickDeleteSection(section._id)}
                        size="small"
                        sx={{ color: "gray", "&:hover": { color: "red" } }}
                      >
                        <DeleteOutlineOutlined />
                      </IconButton>
                    </Box>
                    {section.tasks.map((task: Task, index: number) => (
                      <div key={task._id}>
                        <Draggable draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              sx={{
                                padding: "10px",
                                marginBottom: "10px",
                                cursor: snapshot.isDragging
                                  ? "grab"
                                  : "pointer!important",
                              }}
                              onClick={() => {
                                setSelectedItem(task);
                                setShouldModalOpen(true)
                              }}
                            >
                              <Typography>
                                {task.title === "" ? "Untitled" : task.title}
                              </Typography>
                            </Card>
                          )}
                        </Draggable>
                      </div>
                    ))}
                  </Box>
                )}
              </Droppable>
            </div>
          ))}
        </Box>
      </DragDropContext>
      <TaskDetails
        taskDetails={selectedItem}
        boardId={boardId}
        onDelete={onDeleteTask}
        onUpdate={onUpdateTask}
        onClose={onClose}
        shouldModalOpen={shouldModalOpen}
      />
    </>
  );
};

export default Sections;
