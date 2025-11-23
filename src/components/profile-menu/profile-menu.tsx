import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '../ui/profile-menu/profile-menu';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      navigate('/login');
    }
  };

  return (
    <ProfileMenuUI pathname={location.pathname} handleLogout={handleLogout} />
  );
};

export default ProfileMenu;
