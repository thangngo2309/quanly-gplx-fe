'use client';

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { menuItems } from '../lib/menu-item';
import Image from 'next/image';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box className="flex">
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        {!open && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className='flex items-center justify-center h-16! w-full mx-0!'
          >
            <MenuIcon/>
          </IconButton>
        )}

        {open && (
          <DrawerHeader className='h-16!'>
            <Image
              src="/img/pngegg.png"
              alt="Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <Typography variant='h6'>
              Quản lý GPLX
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        )}

        <Divider />
        <Divider />
        <List>
          {menuItems.map(({ label, icon: Icon }) => (
            <ListItem key={label} disablePadding className='block'>
              <ListItemButton
                className={`min-h-12 px-2.5 ${open ? 'justify-start' : 'mui-button-center'}`}
              >
                <ListItemIcon
                  className={`${open ? 'mr-3' : 'mr-auto'} min-w-0 justify-center`}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  className={`${open ? 'opacity-100' : 'opacity-0'}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />  

        <List className='list-auto-margin'>
          {['Thông tin tài khoản', 'Thông báo', 'Đăng xuất'].map((text, index) => (
            <ListItem key={text} disablePadding className='block'>
              <ListItemButton
                className={`min-h-12 px-2.5 ${open ? 'justify-start' : 'mui-button-center'}`}
              >
                <ListItemIcon
                  className={`${open ? 'mr-3' : 'mr-auto'} min-w-0 justify-center`}
                >
                  {index === 0 ? <ManageAccountsIcon /> : index === 1 ? <NotificationsIcon /> : <LogoutIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  className={`${open ? 'opacity-100' : 'opacity-0'}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
