const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

//Here we not use customers, we use accounts.
const accounts = [];

// Garantindo que a API utilize JSON!
app.use(express.json());


/**
 * Middlewares 
 */

verifyIfAccountExistsByCpf = (request, response, next) => {
  const { cpf } = request.headers;

  
  const accountExists = accounts.find((account) => account.cpf === cpf);

  // Informs that the CPF already exists
  if (!accountExists) return response.status(400).json({ error : "Account not found" });

  request.account = accountExists;

  return next();
}

getBalance = (statement) => {
  const balance = statement.reduce((accumulator, operation) => {
    if (operation.type === 'credit') return accumulator + operation.amount;

    return accumulator - operation.amount;
  }, 0);

  return balance;
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

app.put('/account', (request, response) => {
  const { account } = request;

  const { name } = request.body;

  account.name = name;

  return response.status(201).send();
});

app.get('/account', (request, response) => {
  const { account } = request;
  
  return response.status(200).json(account);
});

app.delete('/account', (request, response) => {
  const { account } = request;


  accounts.splice(account, 1);

  return response.status(200).json(accounts);
});


app.get('/statement/', (request, response) => {
  const { account } = request;
  
  return response.status(200).json(account.statement);
});

app.get('/statement/date', (request, response) => {
  const { account } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statementByDate = account.statement.filter((statement) => 
    statement.created_at.toDateString() === dateFormat.toDateString()
  );

  return response.json(statementByDate)
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
});

app.post('/statement/withdraw', (request, response) => {
  const { account } = request;
  const { amount } = request.body;

  const balance = getBalance(account.statement);

  if (balance < amount) {
    return response.status(400).json({ error: 'You cannot withdraw more than the amount available!' });
  }

  const statementOperation = {
    amount, 
    created_at: new Date(),
    type: "debit"
  };

  account.statement.push(statementOperation);

  return response.status(201).send();
});

app.get('/balance', (request, response) => {
  const { account } = request;

  const balance = getBalance(account.statement);

  return response.status(200).json(balance);
})



app.listen(3333, 
  () => console.log('Server started at http://localhost:3333/')
);