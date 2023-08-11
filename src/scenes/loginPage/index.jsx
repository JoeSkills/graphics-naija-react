import { Box, Typography } from '@mui/material';
import Form from './Form';
import { Link } from 'react-router-dom';

const index = () => {
  return (
    <Box
      padding={'20px'}
      bgcolor={'white'}
      width={{ md: 500 }}
      margin={{ xs: '10px', md: 'auto' }}
    >
      <Typography textAlign={'center'}>
        <b>Welcome back to Graphics Naija Forum!</b> We&apos;re delighted to see
        you again! Log in now to reconnect with our vibrant Nigerian community.
        Engage in insightful discussions, catch up on the latest news, and
        continue building lasting connections. As we strive to improve our user
        interface, your feedback is valuable in shaping the Graphics Naija
        experience! 🇳🇬✨
      </Typography>
      <br />
      <Form />
      <br />
      <Typography textAlign={'center'}>
        If you don&apos;t already have an account{' '}
        <Link to={'/signup'}>
          <Typography component={'span'} fontWeight="bold" color="primary.main">
            {' '}
            SIGNUP
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

export default index;
