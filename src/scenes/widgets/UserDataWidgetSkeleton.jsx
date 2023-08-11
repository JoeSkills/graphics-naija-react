import { Box, Skeleton } from '@mui/material';

const UserDataWidgetSkeleton = () => {
  return (
    <Box display="flex" gap="8px">
      <Skeleton variant="circular" width={40} height={40} />
      <Box width={'50%'}>
        <Skeleton variant="text" sx={{ fontSize: '14px' }} />
        <Skeleton variant="text" sx={{ fontSize: '12px' }} />
      </Box>
    </Box>
  );
};

export default UserDataWidgetSkeleton;
