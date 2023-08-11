import { Box, IconButton, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase.config';

const hasUserAlreadyReacted = (reactions, uid) => {
  return reactions[uid] === null || undefined ? false : true;
};

const isFirstReaction = (reactions) => {
  return reactions === undefined ? true : false;
};

const getCurrentData = async (questionId, answerId) => {
  let currentDataDocRef = doc(db, 'questions', questionId);
  if (answerId !== null)
    currentDataDocRef = doc(db, 'questions', questionId, 'answers', answerId);
  const DataRes = await getDoc(currentDataDocRef);
  const data = DataRes.data();
  return data;
};

const updateLikeReaction = ({
  reactions,
  uid,
  prevUserReaction,
  data,
  currentDataDocRef,
}) => {
  if (hasUserAlreadyReacted(reactions, uid) && reactions[uid] <= 0) {
    const userReaction = prevUserReaction + 1;

    updateDoc(currentDataDocRef, {
      ...data,
      reactions: {
        ...reactions,
        [uid]: userReaction,
      },
    });
  } else {
    updateDoc(currentDataDocRef, {
      ...data,
      reactions: {
        ...reactions,
        [uid]: 1,
      },
    });
  }
};

const updateDislikeReaction = ({
  reactions,
  uid,
  prevUserReaction,
  data,
  currentDataDocRef,
}) => {
  if (hasUserAlreadyReacted(reactions, uid) && reactions[uid] >= 0) {
    const userReaction = prevUserReaction - 1;

    updateDoc(currentDataDocRef, {
      ...data,
      reactions: {
        ...reactions,
        [uid]: userReaction,
      },
    });
  } else {
    updateDoc(currentDataDocRef, {
      ...data,
      reactions: {
        ...reactions,
        [uid]: -1,
      },
    });
  }
};

const updateCurrentReactions = async ({
  questionId,
  data,
  uid,
  reactionType,
  answerId,
}) => {
  let currentDataDocRef = doc(db, 'questions', questionId);

  if (answerId !== null)
    currentDataDocRef = doc(db, 'questions', questionId, 'answers', answerId);

  let { reactions } = data || { reactions: {} };

  if (isFirstReaction(reactions)) reactions = { [uid]: 0 };

  const prevUserReaction = reactions[uid] || 0;

  if (reactionType === 'LIKE') {
    updateLikeReaction({
      reactions,
      uid,
      prevUserReaction,
      data,
      currentDataDocRef,
    });
  } else if (reactionType === 'DISLIKE') {
    updateDislikeReaction({
      reactions,
      uid,
      prevUserReaction,
      data,
      currentDataDocRef,
    });
  }
};

const handleReactionClick = async ({
  questionId,
  reactionType,
  uid,
  answerId,
  navigate,
  refetch,
}) => {
  if (uid === 0) navigate('/login');
  else {
    getCurrentData(questionId, answerId).then((data) => {
      updateCurrentReactions({
        questionId,
        data,
        uid,
        reactionType,
        answerId,
      }).then(() => refetch());
    });
  }
};

const calcNoOfReactions = (reactions) => {
  let reactionCount = 0;

  if (reactions) {
    Object.keys(reactions).map((key) => (reactionCount += reactions[key]));
    return reactionCount;
  } else if (reactions === null || undefined) {
    return reactionCount;
  }
};

const showUserReactionState = (reaction) => {
  if (reaction) return 'primary.main';
  else return '#0707078a';
};

const ReactionWidget = ({
  questionId,
  uid = auth?.currentUser?.uid || 0,
  reactions,
  answerId = null,
  refetch,
}) => {
  const navigate = useNavigate();
  if (reactions === undefined) reactions = { uid: 0 };
  const noOfReactions = calcNoOfReactions(reactions);
  const userLike = reactions[uid] === 1;
  const userDislike = reactions[uid] === -1;

  return (
    <Box>
      <IconButton
        sx={{
          color: showUserReactionState(userLike),
        }}
        onClick={() =>
          handleReactionClick({
            questionId,
            uid,
            reactionType: 'LIKE',
            answerId,
            navigate,
            refetch,
          })
        }
      >
        {' '}
        <KeyboardArrowUpIcon />
      </IconButton>
      <Typography textAlign="center">{noOfReactions}</Typography>
      <IconButton
        sx={{
          color: showUserReactionState(userDislike),
        }}
        onClick={() =>
          handleReactionClick({
            questionId,
            uid,
            reactionType: 'DISLIKE',
            answerId,
            navigate,
            refetch,
          })
        }
      >
        {' '}
        <KeyboardArrowDownIcon />
      </IconButton>
    </Box>
  );
};

ReactionWidget.propTypes = {
  questionId: PropTypes.string,
  uid: PropTypes.string,
  reactions: PropTypes.object,
  answerId: PropTypes.string,
  refetch: PropTypes.func,
};

export default ReactionWidget;
