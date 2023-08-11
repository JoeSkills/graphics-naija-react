import { Avatar, Box, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { deserializeDataFromDb, makeDateReadable } from '../../utils';
import UserDataWidgetSkeleton from './UserDataWidgetSkeleton';

const UserDataWidget = ({
  userImg,
  username,
  createdAt,
  uid,
  repliedTo = null,
  skeleton = false,
}) => {
  const repliedToUser = deserializeDataFromDb(repliedTo?.user);

  const repliedToDisplayName = repliedToUser?.displayName;

  if (skeleton) {
    return <UserDataWidgetSkeleton />;
  }

  return (
    <Box display="flex" gap="8px">
      <Link to={`/profile/${uid}`}>
        {' '}
        <Avatar src={userImg} />
      </Link>
      {repliedTo ? (
        <Box>
          <Typography fontSize={'14px'} fontWeight="bold">
            <Link to={`/profile/${uid}`}>{username}</Link>{' '}
            <Typography component={'span'} fontWeight={'400'}>
              replied to
            </Typography>{' '}
            {repliedToDisplayName}
          </Typography>

          <Typography fontSize="12px">{makeDateReadable(createdAt)}</Typography>
        </Box>
      ) : (
        <Box>
          <Link to={`/profile/${uid}`}>
            <Typography fontSize={'14px'} fontWeight="bold">
              {username}
            </Typography>
          </Link>
          <Typography fontSize="12px">{makeDateReadable(createdAt)}</Typography>
        </Box>
      )}
    </Box>
  );
};

UserDataWidget.propTypes = {
  userImg: PropTypes.string,
  username: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  repliedTo: PropTypes.object,
  skeleton: PropTypes.boolean,
};

export default UserDataWidget;
