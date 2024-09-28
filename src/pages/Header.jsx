import { useState, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import './header.css';

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Updating user role from localStorage');
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []); // Add empty dependency array to run only once on component mount

  const handleMenuClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setToggleMenu(false);
      setIsClosing(false);
    }, 300); // Delay matches animation duration
  };

  const handleLogout = () => {
    // Add any required logic for logout, such as clearing localStorage
    localStorage.removeItem('role'); // Example: removing user role on logout
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  // Menu items based on userRole
  const renderMenuItems = () => {
    switch (userRole) {
      case 'user':
        return (
          <>
            <div className={`hover:cursor-pointer ${isActive('/myfiles')}`} onClick={() => navigate('/myfiles')}>All Files</div>
            <div className={`hover:cursor-pointer ${isActive('/myorgs')}`} onClick={() => navigate('/myorgs')}>My Organisations</div>
            <div className={`hover:cursor-pointer ${isActive('/verifydocs')}`} onClick={() => navigate('/verifydocs')}>Verify NFTs</div>
          </>
        );
      case 'org':
        return (
          <>
            <div className={`hover:cursor-pointer ${isActive('/members')}`} onClick={() => navigate('/members')}>Members</div>
            <div className={`hover:cursor-pointer ${isActive('/requests')}`} onClick={() => navigate('/requests')}>Doc Requests</div>
            <div className={`hover:cursor-pointer ${isActive('/verifydocs')}`} onClick={() => navigate('/verifydocs')}>Verify NFTs</div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-16 w-full bg-gray-800 flex justify-between items-center md:px-12 py-6 text-white">
      {/* Brand Name */}
      <div className="hover:cursor-pointer text-[10px] md:text-[20px] text-primaryGreen font-semibold">docVault</div>

      {/* Desktop Menu */}
      <div className='md:flex justify-evenly gap-20 text-[16px] font-medium hidden'>
        {renderMenuItems()}
      </div>

      {/* Logout Button */}
      <div className="hover:cursor-pointer hidden md:block font-medium" onClick={handleLogout}>
        <FaSignOutAlt />
      </div>

      {/* Mobile Menu Button */}
      <div className="bg-gray-200 rounded-full p-1 md:hidden">
        {!toggleMenu ? (
          <IoMenu fontSize={26} color="black" className="cursor-pointer" onClick={() => setToggleMenu(true)} />
        ) : (
          <div className={`fixed right-0 top-1.5 p-3 h-auto shadow-2xl px-4 flex flex-col items-center rounded-3xl bg-gray-300 text-black ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
            {renderMenuItems()}
            <div onClick={handleMenuClose} className="flex justify-center px-4 py-1.5 bg-black text-white rounded cursor-pointer">
              <AiOutlineCloseCircle fontSize={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;