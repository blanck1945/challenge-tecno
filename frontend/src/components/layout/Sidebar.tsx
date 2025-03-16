import { BookOpen, Home, LogOut, Star, User, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div
      style={{
        backgroundImage: "url('/assets/sidemenu-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className={'sidebar ' + className}
    >
      <div className="absolute inset-0 bg-black opacity-[0.55]"></div>
      <Link to="/" className="no-underline text-black relative z-10">
        <img
          className="w-full px-4"
          src="assets/urbano-logo-white.png"
          alt="urbano-logo"
        />
      </Link>
      <nav className="mt-24 flex flex-col gap-8 flex-grow px-6 relative z-10">
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
        <SidebarItem to="/profile">
          <User /> Profile
        </SidebarItem>
        <SidebarItem to="/favorites">
          <Star /> Favorites
        </SidebarItem>
      </nav>
      <button
        className="text-red-500 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none relative z-10"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
