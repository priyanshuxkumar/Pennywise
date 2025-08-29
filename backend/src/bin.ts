import app from './index';
import { config } from './config';

app.listen(config.port, () => {
    console.log(`Server is running at ${config.serverUrl}`);
});
