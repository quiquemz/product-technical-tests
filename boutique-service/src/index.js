import dotenv from 'dotenv';
import boot from './boot';

// Adding .env variables 
dotenv.config();

boot({
    environment: process.env.NODE_ENV || 'development',
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING
}).then(outputs => {
    const port = process.env.PORT || 3050;
    outputs.api.listen(port);
    console.info(`Listening on port ${port}`);
});
