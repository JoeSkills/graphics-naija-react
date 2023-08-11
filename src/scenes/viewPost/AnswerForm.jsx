import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { QuestionContext } from '.';
import { isAvailable, uploadAnswerToDb } from '../../utils';
import { auth } from '../../../firebase.config';
import { Toaster, toast } from 'react-hot-toast';

const AnswerForm = ({
  pId = null,
  repliedTo = null,
  setIsReplyFormOpen,
  refetch,
}) => {
  const validationSchema = Yup.object().shape({
    answer: Yup.string().required('Answer is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { isLoading, id } = useContext(QuestionContext);

  const currentUser = useSelector((state) => state?.user);

  const { providerData } = currentUser || {};

  const [{ photoURL }] = providerData || [{}];

  if (isLoading) return;

  const onSubmit = ({ answer }) => {
    const uploadAnswerToDbFuncRef = uploadAnswerToDb(
      answer,
      id,
      pId,
      repliedTo
    );
    toast
      .promise(uploadAnswerToDbFuncRef, {
        loading: 'Hold tight! Answers are on their way... ⏳🔄',
        error: 'Oops! Something went wrong. Please try again later. 🚫😔',
        success:
          'Great news! Your answers have been uploaded successfully! 🎉🙌.',
      })
      .then(() => {
        reset();
        isAvailable(setIsReplyFormOpen) &&
          setIsReplyFormOpen((value) => !value);
        refetch();
      });
  };

  return (
    auth && (
      <>
        <Toaster />
        <Box width={'100%'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              display="flex"
              gap="8px"
              flexDirection={{ xs: 'column', sm: 'row' }}
            >
              <Avatar src={photoURL} />
              <Box
                width={'100%'}
                display={'flex'}
                flexDirection={'column'}
                gap="8px"
                alignItems={'start'}
              >
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  placeholder="Add To Discussion"
                  label="Answer"
                  name="answer"
                  {...register('answer')}
                  error={errors.answer ? true : false}
                />
                <Typography variant="inherit" color="textSecondary">
                  {errors.answer?.message}
                </Typography>
                <Button variant="contained" type="submit">
                  Answer
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </>
    )
  );
};

AnswerForm.propTypes = {
  pId: PropTypes.string,
  repliedTo: PropTypes.object,
  setIsReplyFormOpen: PropTypes.func,
  refetch: PropTypes.func,
};

export default AnswerForm;
