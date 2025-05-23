import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! 你好，世界！');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
