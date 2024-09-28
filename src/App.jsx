import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './pages/Header';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {
  return (
    <div className='flex flex-col'>
      <BrowserRouter>
      <HeaderWithConditionalRendering />
      
      <Routes>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

const HeaderWithConditionalRendering = () => {
  const location = useLocation();

  return location.pathname !== '/login' ? <Header /> : null;
};

// const Layout = ({ children }) => {
//   return (
//     <div className="bg-gray-900">
//       {children}
//     </div>
//   );
// };

export default App