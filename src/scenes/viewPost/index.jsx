import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Box, Skeleton, Typography } from '@mui/material';
import { createContext } from 'react';
import { useSelector } from 'react-redux';
import { deserializeDataFromDb, getQuestionById } from '../../utils';
import UserDataWidget from '../widgets/UserDataWidget';
import ContentBox from '../../components/ContentBox';
import AnswerForm from './AnswerForm';
import Answers from './Answers';
import ReactionWidget from '../widgets/ReactionWidget';

export const QuestionContext = createContext({});

const Index = () => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state?.user);

  if (!currentUser) {
    navigate('/login');
  }

  const { id } = useParams();

  const { isLoading, data, error, refetch } = useQuery('question', () =>
    getQuestionById(id)
  );

  const { question, description, createdAt, user, reactions } = data || {};

  const { displayName, providerData, uid } = deserializeDataFromDb(user) || {};

  const [{ photoURL }] = providerData || [{}];

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems={'center'}
        paddingInline={{ xs: '8px', sm: '40px' }}
        paddingBlock={{ xs: '8px', sm: '20px' }}
        flexDirection="column"
        gap="10px"
      >
        <ContentBox>
          <UserDataWidget
            userImg={photoURL}
            username={displayName}
            createdAt={createdAt}
            uid={uid}
            skeleton={true}
          />
          <Skeleton
            variant="text"
            sx={{ marginTop: '15px', fontWeight: 'bold' }}
          />
        </ContentBox>
        <ContentBox>
          <Skeleton variant="text" />
        </ContentBox>
      </Box>
    );
  }

  if (error) {
    <Box display="flex" justifyContent={'center'} alignItems={'center'}>
      <Typography fontSize={'30px'} fontWeight={'bold'}>
        There was an error retrieving data from the database. Your internet
        connection might be slow
      </Typography>
    </Box>;
  }

  return (
    data && (
      <QuestionContext.Provider value={{ data, isLoading, id }}>
        <Box
          display="flex"
          alignItems={'center'}
          paddingInline={{ xs: '8px', sm: '40px' }}
          paddingBlock={{ xs: '8px', sm: '20px' }}
          flexDirection="column"
          gap="10px"
        >
          <ContentBox>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box>
                <UserDataWidget
                  userImg={photoURL}
                  username={displayName}
                  createdAt={createdAt}
                  uid={uid}
                />
                <Typography marginTop={'15px'} fontWeight="bold">
                  {question}
                </Typography>
              </Box>
              <ReactionWidget
                questionId={id}
                reactions={reactions}
                refetch={refetch}
              />
            </Box>
          </ContentBox>
          <ContentBox>{description}</ContentBox>
          <ContentBox>
            <Typography fontWeight="bold" fontSize={'30px'} marginBottom="15px">
              Add To Discussion
            </Typography>
            <AnswerForm refetch={refetch} />
          </ContentBox>
          <Answers />
        </Box>
      </QuestionContext.Provider>
    )
  );
};

export default Index;
