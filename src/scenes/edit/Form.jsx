import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { auth, db } from '../../../firebase.config';

const getQuestionData = async (questionId) => {
  const questionDocRef = doc(db, 'questions', questionId);
  return (await getDoc(questionDocRef)).data();
};

const updateQuestion = async ({ question, description }, questionId) => {
  const questionDocRef = doc(db, 'questions', questionId);
  await updateDoc(questionDocRef, {
    ...(await getDoc(questionDocRef)).data(),
    question,
    description,
  }).catch(console.log);
};

const Form = () => {
  const { questionId } = useParams();

  const { data, isLoading } = useQuery(questionId, () =>
    getQuestionData(questionId)
  );

  const { description, question } = data || {};

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
    const updateQuestionFuncRef = updateQuestion(data, questionId);
    reset();
    toast
      .promise(updateQuestionFuncRef, {
        loading:
          '⏳The system is processing the update request, and it may take a few moments.',
        error:
          "❌ Sorry, we couldn't update the question at the moment. Please try again later or contact support if the issue persists.",
        success: '✅The question has been successfully updated.',
      })
      .then(() => navigate('/'));
  };

  if (isLoading) {
    return <Box>Getting question data from Database...</Box>;
  }

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
                defaultValue={question}
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
                defaultValue={description}
                {...register('description')}
                error={errors.description ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.description?.message}
              </Typography>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained">
                Update Question
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default Form;
