module.exports = verifyIfAccountExistsByCpf = (request, response, next) => {
  const { cpf } = request.headers;
  
  const accountExists = accounts.find((account) => account.cpf === cpf);

  // Informs that the CPF already exists
  if (!accountExists) return response.status(400).json({ error : "Account not found" });

  request.account = accountExists;

  return next();
}