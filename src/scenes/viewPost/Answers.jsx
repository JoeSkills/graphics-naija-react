import { Box, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { createContext, useContext, useMemo } from 'react';
import ContentBox from '../../components/ContentBox';
import { getAnswersFromDb } from '../../utils';
import AnswerWidget from '../widgets/AnswerWidget';
import { QuestionContext } from '.';

export const AnswerContext = createContext(null);

const Answers = () => {
  const { id } = useParams();

  const {
    data: { noOfAnswers },
  } = useContext(QuestionContext) || { data: {} };

  const { data, isLoading, refetch } = useQuery('answers', () =>
    getAnswersFromDb(id)
  );

  useMemo(() => refetch(), [noOfAnswers]);

  if (isLoading) {
    return (
      <ContentBox>
        <Box>
          <Typography fontWeight={'bold'} fontSize="30px">
            Answers
          </Typography>
          Getting Answers...
        </Box>
      </ContentBox>
    );
  }

  return (
    <ContentBox>
      <Box display="flex" flexDirection="column" gap="10px">
        <Typography fontWeight={'bold'} fontSize="30px">
          Answers ({noOfAnswers})
        </Typography>
        {data?.map((answerData) => {
          return (
            <AnswerContext.Provider
              key={answerData?.answerId}
              value={answerData}
            >
              <AnswerWidget refetch={refetch} />
            </AnswerContext.Provider>
          );
        })}
      </Box>
    </ContentBox>
  );
};

export default Answers;
