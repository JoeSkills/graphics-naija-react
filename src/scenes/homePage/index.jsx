import { Box } from '@mui/material';
import PostWidget from '../widgets/PostWidget';
import { Masonry } from '@mui/lab';
import { useQuery } from 'react-query';
import { getQuestions } from '../../utils';

const Index = () => {
  const { isLoading, data, error, refetch } = useQuery('questions', () =>
    getQuestions()
  );

  if (isLoading) {
    return (
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        padding="16px"
      >
        <Masonry
          columns={{ xs: 1, sm: 2, lg: 3 }}
          spacing={2}
          sx={{ margin: 0 }}
        >
          <PostWidget skeleton />
          <PostWidget skeleton />
          <PostWidget skeleton />
          <PostWidget skeleton />
        </Masonry>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
        <div>
          Error getting questions from database. This is might related to your
          network connectivity
        </div>
      </Box>
    );
  }

  return (
    data && (
      <Box padding="16px">
        <Masonry
          columns={{ xs: 1, sm: 2, lg: 3 }}
          spacing={2}
          sx={{ margin: 0 }}
        >
          {data.map(({ question, documentId }) => (
            <PostWidget
              questionData={question}
              key={documentId}
              id={documentId}
              refetch={refetch}
            />
          ))}
        </Masonry>
      </Box>
    )
  );
};

export default Index;
