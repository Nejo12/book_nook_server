import app from './app';

// Use port number from the PORT environment variable or 3000 if not specified
const port = process.env.PORT || 3000;

/**
 * Start Express server.
 */
// const server = app.listen(app.get('port'), () => {
//   console.log(
//     '  App is running at http://localhost:%d in %s mode',
//     app.get('port'),
//     app.get('env'),
//   );
//   console.log('  Press CTRL-C to stop\n');
// });

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default server;
