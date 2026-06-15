'use client';

import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { menuItems, bottomMenuItems } from '@/constants/menu-item';
import { Drawer, DrawerHeader, BoxContainer, BottomListWrapper, DrawerIconButton, ItemButton, ItemIcon, ItemText, ListItemm, LogoImage, NavLink, ItemButtonDanger } from '@/style object/sidebar.style';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearAuthTokens } from '@/utils/localstorage';
import Tooltip from '@mui/material/Tooltip';

export default function Sidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearAuthTokens();
    router.push("/login");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <BoxContainer>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        {!open && (
          <DrawerIconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <Tooltip title="Danh mục" placement="right" arrow>
              <MenuIcon />
            </Tooltip>
          </DrawerIconButton>)}

        {open && (
          <DrawerHeader className='drawer-header'>
            <LogoImage
              src="/img/pngegg.png"
              width={35}
              height={30}
              alt="Logo"
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
        <List>
          {menuItems.map(({ label, icon: Icon, path }) => (
            <ListItemm key={label} disablePadding>
              <Tooltip
                title={label}
                placement="right"
                disableHoverListener={open}
                arrow
              >
                <NavLink href={path}>
                  <ItemButton
                    open={open}
                    selected={path === '/' ? pathname === '/' : pathname.includes(path)}
                  >
                    <ItemIcon open={open}>
                      <Icon />
                    </ItemIcon>
                    <ItemText
                      primary={label}
                      open={open}
                    />
                  </ItemButton>
                </NavLink>
              </Tooltip>
            </ListItemm>
          ))}
        </List>
        <BottomListWrapper>
          <Divider />
          <List>
            {bottomMenuItems.map(({ label, icon: Icon, path, danger }) => (
              <ListItemm key={label} disablePadding>
                <Tooltip
                  title={label}
                  placement="right"
                  disableHoverListener={open}
                  arrow
                >
                  {danger ? (
                    <ItemButtonDanger open={open} onClick={handleLogout}>
                      <ItemIcon open={open}><Icon /></ItemIcon>
                      <ItemText primary={label} open={open} />
                    </ItemButtonDanger>
                  ) : (
                    <NavLink href={path}>
                      <ItemButton
                        open={open}
                        selected={path === '/' ? pathname === '/' : pathname.includes(path)}
                      >
                        <ItemIcon open={open}>
                          <Icon />
                        </ItemIcon>
                        <ItemText primary={label} open={open} />
                      </ItemButton>
                    </NavLink>
                  )}
                </Tooltip>
              </ListItemm>
            ))}
          </List>
        </BottomListWrapper>
      </Drawer>
    </BoxContainer>
  );
}

