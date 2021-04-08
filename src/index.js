const express = require('express');

const app = express();

// Garantindo que a API utilize JSON!
app.use(express.json());

app.listen(3333, 
  () => console.log('Server started at http://localhost:3333/')
);