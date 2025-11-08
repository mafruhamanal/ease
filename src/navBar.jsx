export default function NavBar() {
    return(
<nav className="bg-[#FAF9F6]">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-1 pb-3">
    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/ease.png" className="h-12" alt="EASE Logo" />
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-[#FAF9F6] md:flex-row md:space-x-12 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#FAF9F6]">
        <li>
          <a href="#" className="block py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#C5B3E6] to-[#8EDBB9] bg-clip-text text-transparent hover:from-[#9D82C7] hover:to-[#5FB88F] transition-all duration-300" aria-current="page">Hand Exercises</a>
        </li>
        <li>
          <a href="#" className="block py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#C5B3E6] to-[#8EDBB9] bg-clip-text text-transparent hover:from-[#9D82C7] hover:to-[#5FB88F] transition-all duration-300">Posture</a>
        </li>
        <li>
          <a href="#" className="block py-1 px-3 text-xl rounded-sm md:p-0 bg-gradient-to-r from-[#C5B3E6] to-[#8EDBB9] bg-clip-text text-transparent hover:from-[#9D82C7] hover:to-[#5FB88F] transition-all duration-300">Tool</a>
        </li>
      </ul>
    </div>
  </div>
  <div className="border-b border-[#dbc495]"></div>
</nav>
    );
}