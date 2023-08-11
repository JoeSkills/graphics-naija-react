import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentBox from '../../components/ContentBox';
import {
  getQuestionsForLoggedInUser,
  makeDateReadable,
  pluralizeBasedOnValue,
} from '../../utils';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import PostWidget from '../widgets/PostWidget';
import BiggerAvatar from '../../components/BiggerAvatar';

const Index = () => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state?.user);

  if (!currentUser) {
    navigate('/login');
  }

  const { displayName, providerData, metadata, email, uid } = currentUser || {};

  const [{ photoURL }] = providerData || [{}];

  const { creationTime } = metadata || {};

  const queryData = useQuery('user questions', () =>
    getQuestionsForLoggedInUser(uid)
  );

  const { data, refetch } = queryData || {};

  const { questions, noOfQuestions } = data || {};

  return currentUser ? (
    <Box padding="40px">
      <ContentBox>
        <Box
          display="flex"
          gap="10px"
          flexDirection={'column'}
          alignItems={'center'}
          width="100%"
        >
          <BiggerAvatar src={photoURL} />
          <Typography fontWeight={'bold'} fontSize="30px" textAlign={'center'}>
            {displayName}
          </Typography>
          <Box
            display="flex"
            gap="10px"
            fontSize={'14px'}
            fontWeight={'400'}
            flexDirection={{ xs: 'column', sm: 'row' }}
            textAlign={'center'}
          >
            <Typography>Joined on {makeDateReadable(creationTime)}</Typography>
            <Typography>Email: {email}</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/profile-settings')}
          >
            Update Profile
          </Button>
        </Box>
      </ContentBox>
      {questions ? (
        <Box display="flex" justifyContent={'space-between'} marginTop={'50px'}>
          <Box display="flex" gap="10px" flexDirection={'column'}>
            <ContentBox>
              <Typography fontWeight={'bold'}>
                {noOfQuestions}{' '}
                {pluralizeBasedOnValue(noOfQuestions, 'Question')} Published
              </Typography>
            </ContentBox>
            {questions.map(({ question, documentId }) => {
              return (
                <PostWidget
                  key={documentId}
                  questionData={question}
                  id={documentId}
                  refetch={refetch}
                />
              );
            })}
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent={'center'} marginTop={'50px'}>
          <Typography>Loading questions...</Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box padding="40px">Loading...</Box>
  );
};

export default Index;
