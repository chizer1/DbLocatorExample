import { RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Connections from './pages/Connections';
import DatabaseUsers from './pages/DatabaseUsers';
import Databases from './pages/Databases';
import DatabaseServers from './pages/DatabaseServers';
import DatabaseTypes from './pages/DatabaseTypes';
import Tenants from './pages/Tenants';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/connections',
    element: <Connections />,
  },
  {
    path: '/databaseUsers',
    element: <DatabaseUsers />,
  },
  {
    path: '/databases',
    element: <Databases />,
  },
  {
    path: '/databaseServers',
    element: <DatabaseServers />,
  },
  {
    path: '/databaseTypes',
    element: <DatabaseTypes />,
  },
  {
    path: '/tenants',
    element: <Tenants />,
  },
]; 