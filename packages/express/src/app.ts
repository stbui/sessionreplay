import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { bootstrap } from './bootstrap';

const app = express();
app.use(cors());
app.use(bodyParser.json());

bootstrap(app, {});

app.listen(8888, () => {
    console.log(`Example app listening on port ${8888}`);
});
