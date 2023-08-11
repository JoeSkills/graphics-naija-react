import { Box, Typography } from '@mui/material';
import UserDataWidget from './UserDataWidget';
import { PropTypes } from 'prop-types';
import { NavLink } from 'react-router-dom';
import { deserializeDataFromDb, pluralizeBasedOnValue } from '../../utils';
import ReactionWidget from './ReactionWidget';
import PostWidgetSkeleton from './PostWidgetSkeleton';
import PostWidgetMoreMenu from './PostWidgetMoreMenu';
import { auth } from '../../../firebase.config';

const PostWidget = ({ questionData, id, skeleton = false, refetch, ref }) => {
  const { question, createdAt, user, noOfAnswers, reactions } =
    questionData || {};

  const { displayName, uid, providerData } = deserializeDataFromDb(user) || {};

  const [{ photoURL }] = providerData || [{}];

  if (skeleton) {
    return <PostWidgetSkeleton skeleton={true} />;
  }

  return (
    <Box
      display={'flex'}
      backgroundColor="white"
      padding="16px"
      border="1px solid  #DEE0E1"
      justifyContent={'space-between'}
      ref={ref}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap="15px"
        justifyContent={'center'}
      >
        <UserDataWidget
          username={displayName}
          createdAt={createdAt}
          userImg={photoURL}
          uid={uid}
        />

        <NavLink to={`/view-post/${id}`}>
          <Typography fontSize="30px" fontWeight={'bold'} lineHeight={'37.5px'}>
            {question}
          </Typography>
        </NavLink>

        <Typography fontSize={'14px'} fontWeight={'400'}>
          {noOfAnswers} {pluralizeBasedOnValue(noOfAnswers, 'Answer')}
        </Typography>
      </Box>
      <Box display={'flex'} flexDirection={'column'}>
        <ReactionWidget
          questionId={id}
          reactions={reactions}
          refetch={refetch}
        />
        {auth?.currentUser?.uid === uid && (
          <PostWidgetMoreMenu id={id} refetch={refetch} />
        )}
      </Box>
    </Box>
  );
};

PostWidget.propTypes = {
  questionData: PropTypes.object,
  id: PropTypes.string,
  skeleton: PropTypes.boolean,
  refetch: PropTypes.func,
  ref: PropTypes.object,
};

export default PostWidget;
