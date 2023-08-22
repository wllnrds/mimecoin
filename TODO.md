## Features

- **1. Básicos**
    - [x] 1.1. `GET /api/core` Teste de API
    - [x] 1.2. `GET /passwordSet` Configura senha na conta criada
    - [ ] 1.3. `GET /confirm/transfer` Confirma uma transferência (via front-end)

- **2. Core**
    - [x] 2.1. `GET /api/core/account` Pega as informações de uma conta
    - [x] 2.2. `GET /api/core/request/deposit` Faz um depósito em uma conta
    - [ ] 2.3. `GET /api/core/order` Pega uma ordem de pagamento

- **3. Account**
    - [x] 3.1. `POST /api/core/account` Cria uma conta
    - [x] 3.2. `POST /api/account/login` Fazer login com conta
    - [x] 3.3. `GET /api/account/info` Recurpera informações da conta
    - [x] 3.4. `GET /api/account/balance` Recurpera saldo da conta
    - [x] 3.5. `GET /api/account/statement` Recurpera extrato da conta
    - [x] 3.6. `POST /api/account/request/transfer` Realiza uma transferência
    - [x] 3.7. `PATCH /api/account/request/transfer` Confirma uma transferência (via API)
    - [x] 3.8. `POST /api/account/request/order` Solicita uma ordem de pagamento
    - [ ] 3.9. `POST /api/account/request/payment` Realiza um pagamento
    - [x] 3.10. `GET /api/account/request` Pega transações pendentes
    - [x] 3.12. `GET /api/account/wallet/google` Pega o cartão google Wallet