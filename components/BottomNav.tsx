
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, HeartIcon, CogIcon, ROUTES } from '../constants';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full py-2 px-1 transition-colors duration-200
         ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary-light'}`
      }
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-muted dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto flex justify-around items-center h-16">
        <NavItem to={ROUTES.HOME} icon={<HomeIcon className="w-6 h-6" />} label="Home" />
        <NavItem to={ROUTES.FAVORITES} icon={<HeartIcon className="w-6 h-6" />} label="Favorites" />
        <NavItem to={ROUTES.SETTINGS} icon={<CogIcon className="w-6 h-6" />} label="Settings" />
      </div>
    </nav>
  );
};

export default BottomNav;