import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TestPage from './pages/TestPage';
import MyFiles from './pages/MyFiles';
import VerifyDocs from './pages/VerifyDocs';
import Login from './Login';
import MyOrgs from './pages/MyOrgs';
import Certificate from './pages/Certificate';
import Requests from './pages/Requests';
import OrgPage from './pages/OrgPage';
import Members from './pages/Members';
import Copy from './copy';
import Header from './pages/Header';
import IpfsHash from './pages/ipfshash'
import Firepage from './pages/Firepage';
import PredictionForm from './pages/Prediction';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className='flex flex-col'>
      <BrowserRouter>
      <HeaderWithConditionalRendering />

        <Routes>
          <Route path='/' element={<HomePage />} />
          {/* <Route path='/firepage' element={<Firepage />} /> */}
          {/* <Route path='/prediction' element={<PredictionForm/>}/> */}
          
          <Route path="/myfiles" element={<MyFiles />} />
          <Route path="/verifydocs" element={<VerifyDocs />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/certificate/:userAddress/:requestId/type/:docType' element={ 
            <Layout>
                <Certificate />
              </Layout>
            }/>
          {/* <Route path='/certificate' element={<Certificate />} /> */}
          <Route path="/myorgs" element={<MyOrgs />} />
          <Route path='/requests' element={<Requests />} />1
          <Route path="/org/:orgAddress" element={<OrgPage/>} />
          <Route path='/members' element={<Members />} />
          {/* <Route path='/copy' element={<Copy/>}/> */}
          {/* <Route path='/ipfshash' element={<IpfsHash/>}/> */}
        </Routes>
    </BrowserRouter>
    </div>
  )
}

const HeaderWithConditionalRendering = () => {
  const location = useLocation();

  return location.pathname !== '/login' ? <Header /> : null;
};

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-900">
      {children}
    </div>
  );
};

export default App