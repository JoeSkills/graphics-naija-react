import { Box, Typography, Button } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactionWidget from './ReactionWidget';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useParams } from 'react-router-dom';
import ContentBox from '../../components/ContentBox';
import UserDataWidget from './UserDataWidget';
import AnswerForm from '../viewPost/AnswerForm';
import { serializeDataBeforeSendingToDb } from '../../utils';

const ReplyWidget = ({ reply, pId, refetch }) => {
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

  const { id } = useParams();

  const {
    answerId,
    createdAt,
    user,
    answer,
    repliedTo,
    reactions,
    documentId,
  } = reply || {};

  const { displayName, providerData, uid } = user || {};

  const [{ photoURL }] = providerData || [{}];

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="10px"
      paddingLeft="40px"
      width={'100%'}
      alignItems={'start'}
    >
      <ContentBox key={answerId}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box>
            <UserDataWidget
              username={displayName}
              userImg={photoURL}
              createdAt={createdAt}
              uid={uid}
              repliedTo={repliedTo}
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
          pId={pId}
          repliedTo={{ user: serializeDataBeforeSendingToDb(user), uid }}
          setIsReplyFormOpen={setIsReplyFormOpen}
          refetch={refetch}
        />
      )}
    </Box>
  );
};

ReplyWidget.propTypes = {
  reply: PropTypes.object,
  pId: PropTypes.string,
  refetch: PropTypes.func,
};

export default ReplyWidget;
