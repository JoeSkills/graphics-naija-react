import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ContentBox from '../../components/ContentBox';
import {
  deserializeDataFromDb,
  getQuestionsForLoggedInUser,
  getUserDataById,
  makeDateReadable,
  pluralizeBasedOnValue,
} from '../../utils';
import { useQuery } from 'react-query';
import PostWidget from '../widgets/PostWidget';
import BiggerAvatar from '../../components/BiggerAvatar';

const ProfileWithId = () => {
  const { userId } = useParams();

  const { data } = useQuery('specific user data', () =>
    getUserDataById(userId)
  ) || {
    data: {},
  };

  const { data: questionsData } =
    useQuery(userId, () => getQuestionsForLoggedInUser(userId)) || {};

  const user = deserializeDataFromDb(data?.userData);

  const userCreationTime = data?.userCreationTime;

  const { displayName, providerData, email } = user || {};

  const [{ photoURL }] = providerData || [{}];

  const { questions, noOfQuestions } = questionsData || {};

  return user ? (
    <Box padding="40px">
      <ContentBox>
        <Typography textAlign={'center'}>
          Dear Graphics Naija Users, We are aware of a bug that currently limits
          profile visibility to only your own. Our team is actively working on a
          fix. Thank you for your patience and understanding. Best regards,
          Graphics Naija Team
        </Typography>
      </ContentBox>
      <br />
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
            <Typography>
              Joined on {makeDateReadable(userCreationTime)}
            </Typography>
            <Typography>Email: {email}</Typography>
          </Box>
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

export default ProfileWithId;
