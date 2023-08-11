import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import UserDataWidget from './UserDataWidget';

const PostWidgetSkeleton = ({ skeleton }) => {
  return (
    <Box
      backgroundColor="white"
      padding="16px"
      border="1px solid  #DEE0E1"
      display={'flex'}
      flexDirection={'column'}
      gap="15px"
    >
      <UserDataWidget skeleton={skeleton} />
      <Skeleton variant="text" sx={{ fontSize: '30px', fontWeight: 'bold' }} />
      <Box width={'50%'}>
        <Skeleton variant="text" sx={{ fontSize: '14px', fontWeight: '400' }} />
      </Box>
    </Box>
  );
};

PostWidgetSkeleton.propTypes = {
  skeleton: PropTypes.boolean,
};

export default PostWidgetSkeleton;
