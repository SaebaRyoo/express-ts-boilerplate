import express from 'express';
// import docsRoute from './docs.route';
// import config from '../../config/config';
import authRoute from './auth.route';
import userRoute from './user.route';
import roleRoute from './role.route';
import permissionRoute from './permission.route';
import menuRoute from './menu.route';

const indexRouter = express.Router();

interface RouteConfig {
  path: string;
  route: express.Router;
}

const defaultRoutes: RouteConfig[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute,
  },
  {
    path: '/menus',
    route: menuRoute,
  },
];

defaultRoutes.forEach((route) => {
  indexRouter.use(route.path, route.route);
});

export default indexRouter;
