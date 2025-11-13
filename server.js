// express web server
const express = require('express');
  const app = express();

  app.get('/', (req, res) => {res.send(' Rose Oyaleke');});
 const port = 3000;
 app.listen(process.env.port || 3000);
 console.log('web server is listening at port' + (process.env.port || 3000));