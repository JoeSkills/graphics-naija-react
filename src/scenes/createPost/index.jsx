import { Box, Typography } from '@mui/material';
import Form from './Form';

const index = () => {
  return (
    <Box padding={'30px'} bgcolor={'white'} margin={'10px'}>
      <Typography component={'div'}>
        <Typography textAlign={'center'} fontWeight={'bold'}>
          Ask and Engage on Graphics Naija! Ready to share your thoughts? Create
          a question and spark meaningful discussions among fellow Nigerians.
          Remember to:
        </Typography>
        <ul>
          <li>
            Be Clear: Provide a descriptive title and detailed content for your
            question.
          </li>
          <li>
            Stay Respectful: Foster a positive environment by respecting diverse
            opinions.
          </li>
          <li>
            Choose Appropriate Tags: Tag your question with relevant topics for
            better visibility.
          </li>
          <li>
            Avoid Repetition: Check if a similar question exists before posting.
          </li>
        </ul>
        <Typography textAlign={'center'} fontWeight={'bold'}>
          Let&apos;s embrace curiosity and grow together on Graphics Naija! 🇳🇬✨
        </Typography>
      </Typography>
      <Form />
    </Box>
  );
};

export default index;
