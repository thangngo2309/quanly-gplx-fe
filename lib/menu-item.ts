import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

export const menuItems = [
  { label: 'Dashboard', icon: HomeIcon, path: '/' },
  { label: 'Quản lý giáo viên', icon: SchoolIcon, path: '/teachers' },
  { label: 'Quản lý học viên', icon: GroupIcon, path: '/students' },
  { label: 'Quản lý xe tập lái', icon: DirectionsCarIcon, path: '/vehicles' },
];

export const bottomMenuItems = [
  { label: 'Thông tin tài khoản', icon: ManageAccountsIcon, path: '/account' },
  { label: 'Thông báo', icon: NotificationsIcon, path: '/notifications' },
  { label: 'Đăng xuất', icon: LogoutIcon, path: '/login', danger: true },
];
