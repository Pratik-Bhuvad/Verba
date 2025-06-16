import React, { useContext, useState } from 'react';
import { FaSearch, FaSun, FaMoon, FaBars, FaAngleLeft, FaGlobe } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const Header = () => {
  const [sidebar, setSidebar] = useState(false)
  const [search, setSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  const { toggleTheme } = useContext(ThemeContext)

  return (
    <div className='fixed w-screen z-50'>
      <header className={`sticky w-screen h-[8vh] flex justify-between items-center p-4 py-2 ${search?'shadow-none':'shadow-md shadow-black dark:shadow-gray-600'} z-50 transition-all ease-in-out duration-300 bg-white dark:bg-gray-800 dark:text-white`}>
        <div className='text-2xl font-playwrite font-semibold text-textlight dark:text-textdark'>Verba</div>
        <div className='flex items-center space-x-4'>
          <nav className='hidden h-full items-center justify-evenly lg:flex lg:*:text-sm '>
            <NavLink
              to='/'
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark lg:bg-transparent' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`} >
              Home
            </NavLink>
            <NavLink
              to='/about'
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark lg:bg-transparent' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
              About
            </NavLink>
            <NavLink
              to='/blogs'
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark lg:bg-transparent' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
              Blogs
            </NavLink>
            <NavLink
              to='/auth'
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark lg:bg-transparent' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
              Register
            </NavLink>

          </nav>

          <FaSearch className='cursor-pointer' onClick={() => setSearch(!search)} />
          <button className='' onClick={() => toggleTheme()}>
            <FaSun className='hidden dark:block' />
            <FaMoon className='block dark:hidden' />
          </button>
          <FaBars className='cursor-pointer lg:hidden' onClick={() => setSidebar(true)} />
        </div>
      </header>

      {
        <div className={`w-screen p-2 z-30 transition-all duration-300 ease-in-out ${search ? 'translate-y-0 opacity-100 shadow-md shadow-black dark:shadow-gray-600' : '-translate-y-16 opacity-0 shadow-none'} dark:bg-gray-800 dark:text-white`}>
          <div className='flex items-center justify-evenly rounded-3xl px-1.5 py-2 border-[1px] border-black dark:border-gray-500'>
            <FaSearch size={15} />
            <input type="text" className='w-4/5 focus:outline-none dark:placeholder:text-gray-200' value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Search..' />
            <FaX size={15} onClick={() => setSearchText('')} className={`${(searchText !== '') ? 'block' : 'invisible'}`} />
          </div>
        </div>
      }

      <div className={`absolute top-0 right-0 z-50 w-2/3 h-screen pb-5 backdrop-blur-[2px] border-l-2 transition-all duration-300 ease-in-out ${sidebar ? 'translate-x-0' : 'translate-x-full'} border-l-gray-200/70 bg-gray-200/20 dark:text-textdark lg:hidden`}>
        <button className='w-screen h-[10vh] flex items-center gap-x-2 px-2' onClick={() => setSidebar(false)}>
          <FaAngleLeft className='' />
          <span>Close Menu</span>
        </button>
        <nav className='flex flex-col space-y-6 py-6'>
          <NavLink
            to='/'
            onClick={() => setSidebar(false)}
            className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`} >
            Home
          </NavLink>
          <NavLink
            to='/about'
            onClick={() => setSidebar(false)}
            className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
            About
          </NavLink>
          <NavLink
            to='/blogs'
            onClick={() => setSidebar(false)}
            className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
            Blogs
          </NavLink>
          <NavLink
            to='/auth'
            onClick={() => setSidebar(false)}
            className={({ isActive }) => `${isActive ? 'text-blue-500 font-bold bg-bgdark' : 'text-gray-700 dark:text-gray-300'} p-2 transition-all duration-200 ease-in-out`}>
            Register
          </NavLink>
        </nav>

      </div>
    </div>
  );
};

export default Header;