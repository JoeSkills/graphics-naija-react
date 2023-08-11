import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase.config';

const deleteQuestionInDb = async (questionId) => {
  const questionDocRef = doc(db, 'questions', questionId);
  await deleteDoc(questionDocRef);
};

const handleDeleteQuestion = (questionId, refetch) => {
  const deleteQuestionInDbFuncRef = deleteQuestionInDb(questionId);
  toast
    .promise(deleteQuestionInDbFuncRef, {
      loading:
        '⏳The system is processing the deletion request, and it may take a few moments.',
      error:
        "❌ Sorry, we couldn't delete the question at the moment. Please try again later or contact support if the issue persists.",
      success: '✅The question has been successfully deleted.',
    })
    .then(() => refetch());
};

const PostWidgetMoreMenu = ({ id, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Toaster />
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Link to={`/edit/${id}`}>
          <MenuItem onClick={handleClose}>Edit</MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            handleClose();
            handleDeleteQuestion(id, refetch);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

PostWidgetMoreMenu.propTypes = {
  id: PropTypes.string,
  refetch: PropTypes.func,
};

export default PostWidgetMoreMenu;
