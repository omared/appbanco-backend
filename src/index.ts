import 'dotenv/config';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT ?? 4000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:4200';

const app = createApp(ALLOWED_ORIGIN);

app.listen(PORT, () => {
  console.log(`appbanco-backend escuchando en http://localhost:${PORT}`);
});
