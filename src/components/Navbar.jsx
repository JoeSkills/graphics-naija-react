import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Link, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import { Login, Menu } from '@mui/icons-material';
import { Button, IconButton, ListItemIcon, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout, toggleDrawer } from '../utils';

const NAV_LINKS = [
  { path: '/', name: 'Home', Icon: HomeIcon },
  { path: '/create-post', name: 'Create Post', Icon: AddIcon },
  { path: '/profile', name: 'Profile', Icon: PersonIcon },
  {
    path: '/profile-settings',
    name: 'Profile Settings',
    Icon: SettingsIcon,
  },
];

const NAV_LINKS_LOGOUT = [
  { path: '/', name: 'Home', Icon: HomeIcon },
  { path: '/login', name: 'Login', Icon: Login },
];

const Navbar = ({ children }) => {
  const currentUser = useSelector((state) => state?.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuList = () => (
    <Box
      width={250}
      role="presentation"
      onClick={(event) => toggleDrawer(event, setIsMenuOpen)}
      onKeyDown={(event) => toggleDrawer(event, setIsMenuOpen)}
    >
      {currentUser ? (
        <List>
          {NAV_LINKS.map(({ name, path, Icon }) => (
            <Link to={path} key={name}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
          <ListItem
            disablePadding
            onClick={() => handleLogout(navigate, dispatch)}
          >
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={'Logout'} />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          {NAV_LINKS_LOGOUT.map(({ name, path, Icon }) => (
            <Link to={path} key={name}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        width="100%"
        paddingX="20px"
        justifyContent={'space-between'}
        position={'sticky'}
        bgcolor="primary.main"
        zIndex="8"
        paddingY={'10px'}
      >
        <Typography
          color={'white'}
          variant="h6"
          fontWeight={'bold'}
          justifySelf={'center'}
        >
          <a href="/">Graphics Naija</a>
        </Typography>
        <IconButton
          onClick={(event) => toggleDrawer(event, setIsMenuOpen)}
          size="large"
          sx={{ color: 'white', display: { md: 'none' } }}
        >
          <Menu />
        </IconButton>
        {currentUser ? (
          <Box
            display={{
              xs: 'none',
              md: 'flex',
              color: 'white',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.name} to={link.path}>
                <Typography>{link.name}</Typography>
              </Link>
            ))}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleLogout(navigate, dispatch)}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box
            display={{
              xs: 'none',
              md: 'flex',
              color: 'white',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS_LOGOUT.map((link) => (
              <Link key={link.name} to={link.path}>
                <Typography>{link.name}</Typography>
              </Link>
            ))}
          </Box>
        )}
      </Box>
      <SwipeableDrawer
        anchor={'left'}
        open={isMenuOpen}
        onClose={(event) => toggleDrawer(event, setIsMenuOpen)}
        onOpen={(event) => toggleDrawer(event, setIsMenuOpen)}
      >
        <MenuList />
      </SwipeableDrawer>
      {children}
    </Box>
  );
};

Navbar.propTypes = {
  children: PropTypes.node,
};

export default Navbar;
