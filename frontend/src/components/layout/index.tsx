import { useState } from 'react';
import { Menu, X } from 'react-feather';

import Sidebar from './Sidebar';

export default function Layout({ children, ...props }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Sidebar className={showSidebar ? 'show' : ''} />
      <h1 className="lg:ml-72 pl-10 lg:pl-12 flex items-center text-2xl mb-5 bg-[#e2e1e1] h-20 text-black-900 ">
        {props.header || 'Dashboard'}
      </h1>
      <div className="lg:ml-72 mx-auto px-5 sm:px-10">{children}</div>
      <button
        className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
          showSidebar ? 'right-5' : 'left-5'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={30} /> : <Menu size={30} />}
      </button>
    </>
  );
}
