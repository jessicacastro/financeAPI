const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const accounts = [];

// Garantindo que a API utilize JSON!
app.use(express.json());

/**
 * CPF: String
 * Name: String
 * ID: uuid
 * Statement (Extrato): Array 
 */
app.post('/account', (req, res) => {
  const { cpf, name } = req.body;
  const id = uuidv4();

  // Verify if the CPF already exists on accounts
  const cpfExists = accounts.some(
    (account) => account.cpf === cpf
  );

  // Informs that the CPF already exists
  if (cpfExists) return res.status(400).json({ error: 'CPF already exists.' });


  // Register a new account
  accounts.push({
    id, 
    cpf, 
    name, 
    statement: []
  });

  return res.status(201).send();

});

app.get('/account/statements', (req, res) => {
  
})

app.listen(3333, 
  () => console.log('Server started at http://localhost:3333/')
);