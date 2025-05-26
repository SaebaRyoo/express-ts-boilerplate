import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
// @ts-expect-error - 类型定义文件缺失
import { xss } from 'express-xss-sanitizer';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import passport from 'passport';
import { jwtStrategy } from './config/passport.strategy.config';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import { setupSwagger } from './config/swagger.config';

const app = express();

// 适用于生产环境，记录每个 HTTP 请求的详细信息
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data against XSS
app.use(xss());

// gzip compression
// @ts-expect-error - 类型定义文件缺失
app.use(compression());

// enable cors
app.use(cors());
// express 5中 通配符 * 必须有一个名称，匹配参数 : 的行为，使用 /*cors 而不是 /*
app.options('/{*cors}', cors());

// jwt authentication
app.use(passport.initialize() as unknown as express.RequestHandler);
passport.use('jwt', jwtStrategy);

// setup swagger docs
if (config.env === 'development') {
  setupSwagger(app);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
