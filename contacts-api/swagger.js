const swaggerAutogen = require('swaggerAutogen')();
const doc ={
  info:{
    title: 'user-Api',
    description: 'user-Api'
  },
  host: 'localhost:3000',
  schemes: ['https','http']

};

const outputFile = './swagger.json'
const endpointsFile = ['./routes/index.js'];
swaggerAutogen( outputFile, endpointsFile, doc);