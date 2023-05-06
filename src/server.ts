import app from './app';

const port = process.env.PORT || 3000;

/**
 * Start Express server.
 */
const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;
