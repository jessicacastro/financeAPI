const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const accounts = [];

// Garantindo que a API utilize JSON!
app.use(express.json());


/**
 * Middleware 
 */

verifyIfAccountExistsByCpf = (request, response, next) => {
  const { cpf } = request.headers;

  
  const accountExists = accounts.find((account) => account.cpf === cpf);

  // Informs that the CPF already exists
  if (!accountExists) return response.status(400).json({ error : "Account not found" });

  request.account = accountExists;

  return next();
}

/**
 * CPF: String
 * Name: String
 * ID: uuid
 * Statement (Extrato): Array 
 */
app.post('/account', (request, response) => {
  const { name } = request.body;
  const { cpf } = request.headers;
  const id = uuidv4();

  const accountExists = accounts.some((account) => account.cpf === cpf);

  if (accountExists) return response.status(400).json({ error: "Account already exists" });

  // Register a new account
  accounts.push({
    id, 
    cpf, 
    name, 
    statement: []
  });

  return response.status(201).send();
});

app.use(verifyIfAccountExistsByCpf);

app.get('/statement/', (request, response) => {
  const { account } = request;
  
  return response.status(200).json(account.statement);
});

app.post('/statement/deposit', (request, response) => {
  const { account } = request;
  const { amount, description } = request.body;

  const statementOperation = {
    description, 
    amount, 
    created_at: new Date(), 
    type: "credit"
  };

  account.statement.push(statementOperation);

  return response.status(201).send();
})



app.listen(3333, 
  () => console.log('Server started at http://localhost:3333/')
);