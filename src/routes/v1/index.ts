import express from 'express';
// import docsRoute from './docs.route';
// import config from '../../config/config';
import userRoute from './user.route';

const indexRouter = express.Router();

interface RouteConfig {
  path: string;
  route: express.Router;
}

const defaultRoutes: RouteConfig[] = [
  {
    path: '/users',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  indexRouter.use(route.path, route.route);
});

export default indexRouter;
