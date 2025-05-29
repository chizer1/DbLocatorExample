import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavigationBar from './navigationBar';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <>
      <NavigationBar />
      <div className="container mt-3">
        <ToastContainer />
        <Outlet />
      </div>
    </>
  );
};

export default Layout; 