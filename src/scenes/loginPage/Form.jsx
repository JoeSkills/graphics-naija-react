import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Toaster, toast } from 'react-hot-toast';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth, googleProvider } from '../../../firebase.config';
import { sendUserDataToDb, updateCurrentUserState } from '../../utils';
import ContentBox from '../../components/ContentBox';
import googleLogo from '../../assets/google-icon.svg';

const applySignInWithEmailAndPassword = async ({ email, password }) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const Form = () => {
  const navigate = useNavigate();

  const [isPasswordShowing, setIsPasswordShowing] = useState(false);

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (formData) => {
    const applySignInWithEmailAndPasswordFuncRef =
      applySignInWithEmailAndPassword(formData);

    toast
      .promise(applySignInWithEmailAndPasswordFuncRef, {
        loading: 'Logging you in... Just a moment, please!',
        error: 'Uh-oh! Invalid login details. Please try again.',
        success: "Welcome back! You're now logged in and ready to create.",
      })
      .then(({ user }) => {
        updateCurrentUserState(user, dispatch);
        navigate('/');
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
              login
            </Button>
          </Grid>
        </Grid>
      </form>
      <ContentBox
        onClick={() =>
          signInWithPopup(auth, googleProvider).then(() => {
            updateCurrentUserState(auth.currentUser, dispatch);
            sendUserDataToDb(auth.currentUser).then(() => navigate('/'));
          })
        }
        marginTop="15px"
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        sx={{
          '&:hover': {
            cursor: 'pointer',
            color: 'primary.main',
          },
        }}
      >
        <img
          src={googleLogo}
          alt="google-logo"
          style={{ width: 40, height: 40 }}
        />
        Sign In With Google
      </ContentBox>
    </Box>
  );
};

export default Form;
