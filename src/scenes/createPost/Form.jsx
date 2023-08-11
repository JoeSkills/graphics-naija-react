import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from '../../../firebase.config';
import { serializeDataBeforeSendingToDb } from '../../utils';

const submitQuestion = async ({ question, description }) => {
  const questionsCollectionRef = collection(db, 'questions');
  await addDoc(questionsCollectionRef, {
    question,
    description,
    createdAt: new Date().toString(),
    user: serializeDataBeforeSendingToDb(auth.currentUser),
    uid: auth.currentUser.uid,
    noOfAnswers: 0,
  }).catch(console.log);
};

const Form = () => {
  const navigate = useNavigate();

  if (!auth.currentUser) {
    navigate('/login');
  }

  const validationSchema = Yup.object().shape({
    question: Yup.string().required('Question title is required'),
    description: Yup.string().required('Description is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    const submitQuestionFuncRef = submitQuestion(data);
    reset();
    toast
      .promise(submitQuestionFuncRef, {
        loading:
          "Just a moment! We're preparing your question for the community. ⏳🔧",
        error:
          ' Uh-oh! Unable to create the question right now. Please try again later. 🚫😔',
        success:
          'Hooray! Your question is live for the community to engage with! 🎉🚀',
      })
      .then(() => navigate('/'));
  };

  return (
    <div>
      <Toaster />
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                id="question"
                name="question"
                label="Question"
                fullWidth
                margin="dense"
                autoComplete="off"
                {...register('question')}
                error={errors.question ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.question?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="description"
                name="description"
                label="Description"
                fullWidth
                margin="dense"
                autoComplete="off"
                multiline
                rows={5}
                {...register('description')}
                error={errors.description ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.description?.message}
              </Typography>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">
                Ask
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default Form;
