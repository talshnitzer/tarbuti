const {app} = require('./server/server')
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });