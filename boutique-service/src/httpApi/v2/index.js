import routes from './routes';
import * as handlers from './handlers';
import errorHandler from './error';

export default {
    namespace: 'v2',
    routes,
    handlers,
    error: errorHandler
};
