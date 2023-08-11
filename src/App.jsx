import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import signupPage from './scenes/signupPage';
import loginPage from './scenes/loginPage';
import createPost from './scenes/createPost';
import homePage from './scenes/homePage';
import profileSettings from './scenes/profileSettings';
import viewPost from './scenes/viewPost';
import profile from './scenes/profile';
import ProfileWithId from './scenes/profile/ProfileWithId';
import edit from './scenes/edit';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route Component={signupPage} path="/signup" />
        <Route Component={loginPage} path="/login" />
        <Route Component={createPost} path="/create-post" />
        <Route Component={homePage} path="/" />
        <Route Component={profileSettings} path="/profile-settings" />
        <Route path="/profile">
          <Route Component={ProfileWithId} path=":userId" />
          <Route Component={profile} index />
        </Route>
        <Route Component={viewPost} path="/view-post/:id" />
        <Route Component={edit} path="/edit/:questionId" />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
