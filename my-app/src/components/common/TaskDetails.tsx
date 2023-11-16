import {
  Backdrop,
  Fade,
  IconButton,
  Modal,
  Box,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import taskApi from "../../api/taskApi";

import "../../css/custom-editor.css";

const modalStyle = {
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 1,
  height: "80%",
};

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

interface Props {
  taskDetails?: Task | null;
  boardId?: string;
  onUpdate: Function;
  onClose: Function;
  onDelete: Function;
  shouldModalOpen:boolean
}
let timer: NodeJS.Timeout;
const timeout = 500;
let isModalClosed = false;

const TaskDetails = ({
  taskDetails,
  boardId,
  onUpdate,
  onClose,
  onDelete,
  shouldModalOpen
}: Props) => {
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTask(taskDetails || null);
    setTitle(taskDetails?.title || "");
    setContent(taskDetails?.content || "");
    if (taskDetails) {
      isModalClosed = false;
      updateEditorHeight();
    }
  }, [taskDetails, shouldModalOpen]);

  const updateEditorHeight = () => {
    setTimeout(() => {
      const currentRef = editorWrapperRef.current;
      if (currentRef) {
        const box = currentRef as HTMLDivElement;
        const editableInline = box.querySelector(
          ".ck-editor__editable_inline"
        ) as HTMLElement | null;
        if (editableInline) {
          editableInline.style.height = box.offsetHeight - 50 + "px";
        }
      }
    }, timeout);
  };

  const onCloseModal = () => {
    isModalClosed = true;
    setTask(null);
    onUpdate(task);
    onClose();
  };


  const deleteTask = async () => {
    console.log("called");
    try {
      if (task) {
        await taskApi.delete(boardId, task._id);
        onDelete(task);
        setTask(null);
      }
    } catch (err) {
      alert(err);
    }
  };

  const updateTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (task) {
      clearTimeout(timer);
      const newTitle = e.target.value;
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task._id, { title: newTitle });
        } catch (err) {
          alert(err);
        }
      }, timeout);

      task.title = newTitle;
      setTitle(newTitle);
      onUpdate(task);
    }
  };

  const updateContent = async (event: any, editor: ClassicEditor) => {
    if (task) {
      clearTimeout(timer);
      const data = editor.getData();

      console.log({ isModalClosed });

      if (!isModalClosed) {
        timer = setTimeout(async () => {
          try {
            await taskApi.update(boardId, task._id, { content: data });
          } catch (err) {
            alert(err);
          }
        }, timeout);

        task.content = data;
        setContent(data);
        onUpdate(task);
      }
    }
  };

  

  return (
    <Modal
      open={shouldModalOpen}
      onClose={onCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== null}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <IconButton color="error" onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              padding: "2rem 5rem 5rem",
            }}
          >
            <TextField
              value={title}
              onChange={updateTitle}
              placeholder="Untitled"
              variant="outlined"
              fullWidth
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-input": { padding: 0 },
                "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                "& .MuiOutlinedInput-root": {
                  fontSize: "2.5rem",
                  fontWeight: "700",
                },
                marginBottom: "10px",
              }}
            />

            <Divider sx={{ margin: "1.5rem 0" }} />
            <Box
              ref={editorWrapperRef}
              sx={{
                position: "relative",
                height: "80%",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskDetails;
