import { CSSObject, styled, Theme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';
import Link from 'next/link';

export const drawerWidth = 240;

export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

export const closedMixin = (theme: Theme): CSSObject => ({
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

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  Height: 64,
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      display: 'flex',
      flexDirection: 'column',
    },
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

export const BoxContainer = styled(Box)({
    display: 'flex',
});

export const BottomListWrapper = styled('div')({
  marginTop: 'auto',
});

export const DrawerIconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    marginRight: 0,
    marginLeft: 0,
    height: 56,
    [theme.breakpoints.up('sm')]: {
      height: 64,
    },
}));

export const ItemButton = styled(ListItemButton)<{ open: boolean }>(
  ({ open }) => ({
  minHeight: 48,
  justifyContent: open ? 'initial' : 'center',
  px: 2.5,
  '&.Mui-selected': {
      backgroundColor: '#d6fbe8',
    },
  '&.Mui-selected:hover': {
      backgroundColor: '#C2E5D3',
    },
}));

export const ItemIcon = styled(ListItemIcon)<{ open: boolean }>(
  ({ open }) => ({
    minWidth: 0,
    justifyContent: 'center',
    mr: open ? 3 : 'auto',
  })
);

export const ItemText = styled(ListItemText)<{ open: boolean }>(
  ({ open }) => ({
    opacity: open ? 1 : 0,
    marginLeft: open ? 20 : 0,
  })
);

export const ListItemm = styled(ListItem)({
  display: 'block',
});

export const LogoImage = styled(Image)({
  marginLeft: 10,
  marginRight: 10,
});

export const NavLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});

export const ItemButtonDanger = styled(ItemButton)({
  color: 'red',
  '& .MuiListItemIcon-root': {
    color: 'red',
  },
});