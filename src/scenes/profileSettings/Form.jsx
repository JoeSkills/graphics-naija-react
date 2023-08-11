import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { updateProfile } from 'firebase/auth';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  getQuestions,
  getUserDataById,
  isAvailable,
  serializeDataBeforeSendingToDb,
  updateCurrentUserState,
} from '../../utils';
import { auth, db, storage } from '../../../firebase.config';
import ImageInputWidget from '../widgets/ImageInputWidget';
import { Toaster, toast } from 'react-hot-toast';

const updateUserDetailsInDb = async (user) => {
  getUserDataById(user.uid).then(async ({ documentId }) => {
    const userDocRef = doc(db, 'users', documentId);
    const usersDbRef = await getDoc(userDocRef);
    const userCreationTime = usersDbRef.data().userCreationTime;
    updateDoc(userDocRef, {
      uid: user.uid,
      user: serializeDataBeforeSendingToDb(user),
      userCreationTime,
    });
  });
};

const updateCurrentUserProfileDetails = async (
  updatedProfileData,
  dispatch
) => {
  await updateProfile(auth.currentUser, updatedProfileData)
    .then(() => {
      updateCurrentUserState(auth.currentUser, dispatch);
      updateFeedProfileInDatabase(auth.currentUser);
      updateAnswersProfileInDatabase(auth.currentUser);
      updateRepliesProfileInDatabase(auth.currentUser);
      updateUserDetailsInDb(auth.currentUser);
    })
    .catch(console.error);
};

const handleImageUpload = async (file, updateUrlState) => {
  const storageRef = ref(storage, `/files/${file?.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    'state_changed',
    () => {},
    console.error,
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        updateUrlState(url);
      });
    }
  );
  return;
};

const updateFeedProfileInDatabase = async (user) => {
  const questionsCollectionRef = collection(db, 'questions');
  const databaseResponse = await getDocs(
    query(questionsCollectionRef, where('uid', '==', user.uid))
  );
  const questions = databaseResponse.docs;

  if (isAvailable(databaseResponse.size)) {
    questions.map((question) =>
      updateQuestionProfileByIdInDatabase(
        question,
        serializeDataBeforeSendingToDb(user)
      )
    );
  }
};

const updateAnswersProfileInDatabase = async (user) => {
  getQuestions().then((questions) => {
    questions.map((question) => {
      updateAnswerProfileInDatabaseByQuestionId(user, question.documentId);
    });
  });
};

const updateRepliesProfileInDatabase = async (user) => {
  getQuestions().then((questions) => {
    questions.map((question) => {
      updateReplyProfileInDatabaseByQuestionId(user, question.documentId);
    });
  });
};

const updateReplyProfileInDatabaseByQuestionId = async (user, questionId) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const databaseResponse = await getDocs(
    query(answersCollectionRef, where('repliedTo.uid', '==', user.uid))
  );
  const answers = databaseResponse.docs;
  if (isAvailable(databaseResponse.size)) {
    answers.map((answer) =>
      updateSpecificReplyProfileInDatabase({
        questionId,
        answer,
        user: serializeDataBeforeSendingToDb(user),
        uid: user.uid,
      })
    );
  }
};

const updateAnswerProfileInDatabaseByQuestionId = async (user, questionId) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const databaseResponse = await getDocs(
    query(answersCollectionRef, where('uid', '==', user.uid))
  );
  const answers = databaseResponse.docs;
  if (isAvailable(databaseResponse.size)) {
    answers.map((answer) =>
      updateSpecificAnswerProfileInDatabase({
        questionId,
        answer,
        user: serializeDataBeforeSendingToDb(user),
      })
    );
  }
};

const updateSpecificAnswerProfileInDatabase = ({
  questionId,
  answer,
  user,
}) => {
  const answerDocRef = doc(db, 'questions', questionId, 'answers', answer.id);
  updateDoc(answerDocRef, { ...answer.data(), user });
};

const updateSpecificReplyProfileInDatabase = ({
  questionId,
  answer,
  user,
  uid,
}) => {
  const answerDocRef = doc(db, 'questions', questionId, 'answers', answer.id);
  updateDoc(answerDocRef, { ...answer.data(), user, repliedTo: { user, uid } });
};

const updateQuestionProfileByIdInDatabase = (question, user) => {
  const questionDocRef = doc(db, 'questions', question.id);
  updateDoc(questionDocRef, { ...question.data(), user });
};

const Form = () => {
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state?.user);

  if (!currentUser) {
    navigate('/login');
  }

  const displayName = currentUser?.displayName;

  const [photoURL, setPhotoURL] = useState();

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    displayName: Yup.string(),
  });

  const methods = useForm({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = ({ displayName, profileImg }) => {
    if (isAvailable(profileImg)) {
      handleImageUpload(profileImg[0], setPhotoURL);
      updateCurrentUserProfileDetails({ displayName }, dispatch);
    } else {
      const updateCurrentUserProfileDetailsFuncRef =
        updateCurrentUserProfileDetails({ displayName }, dispatch);

      toast
        .promise(updateCurrentUserProfileDetailsFuncRef, {
          success: 'Success! Your profile has been updated.',
          loading: 'Updating your profile... Please wait.',
          error: 'Oops! Something went wrong. Please try again later.',
        })
        .then(() => navigate('/'));
    }
  };

  useEffect(() => {
    if (photoURL) {
      const updateCurrentUserProfileDetailsFuncRef =
        updateCurrentUserProfileDetails({ photoURL }, dispatch);
      toast
        .promise(updateCurrentUserProfileDetailsFuncRef, {
          success: 'Hooray! Your profile has been updated successfully! 🎉🙌',
          loading: 'Hold tight! Updating your profile... ⏳🔄',
          error: 'Uh-oh! Profile update failed. Please try again later. 🚫😔',
        })
        .then(() => navigate('/'));
    }
  }, [photoURL]);

  return (
    <Box>
      <Toaster />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="username"
                name="displayName"
                label="Username"
                fullWidth
                margin="dense"
                autoComplete="off"
                defaultValue={displayName}
                {...register('displayName')}
                error={errors.displayName ? true : false}
              />
              <Typography variant="inherit" color="textSecondary">
                {errors.displayName?.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ImageInputWidget
                accept="image/png, image/jpg, image/jpeg, image/gif"
                name="profileImg"
                label="Update Your Profile Picture"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Form;
