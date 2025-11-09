"use client";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hand, User, Pencil, Bot } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return(
    <nav className="bg-[#FAF9F6]">
      <div className="w-full flex flex-wrap items-center justify-between p-1 pb-3 pl-4 pr-8">
        <Link to= "/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/ease.png" className="h-12" alt="EASE Logo" />
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" 
          aria-controls="navbar-default" 
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#FAF9F6] md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#FAF9F6]">
            <li>
              <Link to="/tracing" className="flex items-center gap-2 py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#B794F6] to-[#81C995] bg-clip-text text-transparent hover:from-[#9A75D9] hover:to-[#6BB082] transition-all duration-300" aria-current="page">
                <Hand className="w-5 h-5 stroke-[#B794F6]" />
                Hands
              </Link>
            </li>
            <li>
              <Link to="/posture" className="flex items-center gap-2 py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#B794F6] to-[#81C995] bg-clip-text text-transparent hover:from-[#9A75D9] hover:to-[#6BB082] transition-all duration-300">
                <User className="w-5 h-5 stroke-[#B794F6]" />
                Posture
              </Link>
            </li>
            <li>
              <Link to="/shapecreator" className="flex items-center gap-2 py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#B794F6] to-[#81C995] bg-clip-text text-transparent hover:from-[#9A75D9] hover:to-[#6BB082] transition-all duration-300">
                <Pencil className="w-5 h-5 stroke-[#B794F6]" />
                Create
              </Link>
            </li>
            <li>
              <Link to="/ai" className="flex items-center gap-2 py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#B794F6] to-[#81C995] bg-clip-text text-transparent hover:from-[#9A75D9] hover:to-[#6BB082] transition-all duration-300">
                <Bot className="w-5 h-5 stroke-[#B794F6]" />
                AI Chat
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-b border-[#dbc495]"></div>
    </nav>
  );
}