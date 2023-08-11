import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase.config';
import { sendUserDataToDb, updateCurrentUserState } from '../../utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const applyCreateUserWithEmailAndPassword = async ({ email, password }) => {
  return await createUserWithEmailAndPassword(auth, email, password).then(
    (userCredentials) => userCredentials
  );
};

const updateCurrentUserUsername = async (
  currentUser,
  displayName,
  navigate
) => {
  const updateProfileFuncRef = updateProfile(currentUser, {
    displayName,
  });
  toast
    .promise(updateProfileFuncRef, {
      loading: 'Creating your account... Please wait!',
      error: 'Oops! It seems there was a glitch. Please try again.',
      success: "Congratulations! You're now a part of our creative community.",
    })
    .then(() => {
      sendUserDataToDb(currentUser).then(() => navigate('/'));
    })
    .catch(console.error);
};

const Form = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(4, 'Username must be at least 6 characters'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 20 characters'),
  });

  const dispatch = useDispatch();

  const [isPasswordShowing, setIsPasswordShowing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = ({ username, email, password }) => {
    applyCreateUserWithEmailAndPassword({ email, password }).then(() => {
      updateCurrentUserUsername(auth.currentUser, username, navigate);
      updateCurrentUserState(auth.currentUser, dispatch);
    });
  };

  const handleClickShowPassword = () =>
    setIsPasswordShowing((previousValue) => !previousValue);

  const isText = (value) => {
    return value ? 'text' : 'password';
  };

  return (
    <Box>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="username"
              name="username"
              label="Username"
              fullWidth
              margin="dense"
              autoComplete="off"
              {...register('username')}
              error={errors.username ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.username?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              margin="dense"
              type="email"
              autoComplete="off"
              {...register('email')}
              error={errors.email ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.email?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              autoComplete="off"
              type={`${isText(isPasswordShowing)}`}
              fullWidth
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {isPasswordShowing ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
              error={errors.password ? true : false}
            />
            <Typography variant="inherit" color="textSecondary">
              {errors.password?.message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained">
              Signup
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Form;
