import { Box, Typography } from '@mui/material';
import Form from './Form';

const index = () => {
  return (
    <Box padding="16px" bgcolor={'white'} margin={'10px'}>
      <Typography component={'div'}>
        <Typography textAlign={'center'} fontWeight={'bold'}>
          Profile Settings - Graphics Naija
        </Typography>
        Manage your profile and preferences here! While we work to enhance your
        experience, please note:
        <ol>
          <li>
            {' '}
            <b>Profile Picture Bug:</b>We&apos;re fixing an issue with updating
            profile images. Apologies for any inconvenience caused.
          </li>
          <li>
            {' '}
            <b>Coming Soon:</b> Some settings are not available yet, but
            we&apos;re actively working on adding new features to enrich your
            Graphics Naija journey. Your feedback matters! Together, we&apos;ll
            shape a thriving community. 🇳🇬✨{' '}
          </li>
        </ol>
      </Typography>
      <Form />
    </Box>
  );
};

export default index;
