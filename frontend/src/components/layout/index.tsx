import { useState } from 'react';
import { Mail, Menu, X } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import Sidebar from './Sidebar';

export default function Layout({ children, ...props }) {
  const { authenticatedUser } = useAuth();
  const { t, i18n } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };
  return (
    <>
      <Sidebar className={showSidebar ? 'show' : ''} />
      <div className="lg:ml-72 pl-10 lg:px-12 flex items-center text-2xl mb-5 bg-[#e2e1e1] h-20 text-black-900 flex items-center justify-between">
        <h1 className=" ">{props.header || t('dashboard.header')}</h1>
        <select onChange={toggleLanguage} value={i18n.language}>
          <option value="en">{t('language_selector.english')}</option>
          <option value="es">{t('language_selector.spanish')}</option>
        </select>
      </div>
      <div className="lg:ml-72 mx-auto px-5 sm:px-10 pb-5">{children}</div>
      <button
        className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
          showSidebar ? 'right-5' : 'left-5'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={30} /> : <Menu size={30} />}
      </button>
      {authenticatedUser.role === 'user' && (
        <Link
          to="/contact"
          className="fixed bottom-5 right-5 border shadow-md bg-[#c1292e] text-white p-3 rounded-full transition-all focus:outline-none"
        >
          <Mail size={30} />
        </Link>
      )}
    </>
  );
}
