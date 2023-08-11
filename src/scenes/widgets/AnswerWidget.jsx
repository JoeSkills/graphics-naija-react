import { Typography, Box, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ContentBox from '../../components/ContentBox';
import UserDataWidget from './UserDataWidget';
import { AnswerContext } from '../viewPost/Answers';
import {
  getRepliesOfAnswerFromDb,
  serializeDataBeforeSendingToDb,
} from '../../utils';
import ReplyWidget from './ReplyWidget';
import AnswerForm from '../viewPost/AnswerForm';
import ReactionWidget from './ReactionWidget';

const AnswerWidget = ({ refetch }) => {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

  const { id } = useParams();

  const answerData = useContext(AnswerContext) || {};

  const { answerId, user, createdAt, answer, reactions, documentId } =
    answerData;

  const { providerData, displayName, uid } = user || {};

  const [{ photoURL }] = providerData || [{}];

  const {
    data,
    isLoading,
    refetch: replyRefetch,
  } = useQuery(answerId, () => getRepliesOfAnswerFromDb(id, answerId));

  if (isLoading) {
    return (
      answerData && (
        <Box display={'flex'} flexDirection={'column'} gap="10px">
          <ContentBox key={answerId}>
            <UserDataWidget
              username={displayName}
              userImg={photoURL}
              createdAt={createdAt}
              uid={uid}
            />
            <Typography marginTop={'10px'}>{answer}</Typography>
          </ContentBox>
          <Typography>Getting Replies...</Typography>
        </Box>
      )
    );
  }

  return (
    answerData && (
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'start'}
        gap="10px"
      >
        <ContentBox key={answerId}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box>
              <UserDataWidget
                username={displayName}
                userImg={photoURL}
                createdAt={createdAt}
                uid={uid}
              />
              <Typography marginTop={'10px'}>{answer}</Typography>
            </Box>
            <ReactionWidget
              questionId={id}
              reactions={reactions}
              answerId={documentId}
              refetch={refetch}
            />
          </Box>
        </ContentBox>
        <Button
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => setIsReplyFormOpen((value) => !value)}
        >
          Reply to answer
        </Button>
        {isReplyFormOpen && (
          <AnswerForm
            pId={answerId}
            repliedTo={{ user: serializeDataBeforeSendingToDb(user), uid }}
            setIsReplyFormOpen={setIsReplyFormOpen}
            refetch={replyRefetch}
          />
        )}
        {data &&
          data.map((reply) => {
            return (
              <ReplyWidget
                reply={reply}
                key={reply?.answerId}
                pId={answerId}
                refetch={replyRefetch}
              />
            );
          })}
      </Box>
    )
  );
};

AnswerWidget.propTypes = {
  refetch: PropTypes.func,
};

export default AnswerWidget;
