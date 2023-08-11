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
        <b>Welcome to Graphics Naija Forum!</b> Join our vibrant Nigerian
        community for engaging discussions, connections & news! Exciting topics
        await, though <b> we&apos;re working hard to fix bugs & improve UI </b>.
        Embrace the passion of Graphics Naija! 🇳🇬✨
      </Typography>
      <Form />
      <br />
      <Typography textAlign={'center'}>
        If you already have an account{' '}
        <Link to={'/login'}>
          <Typography component={'span'} fontWeight="bold" color="primary.main">
            {' '}
            LOGIN
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

export default index;
