# Conceito
Uma plataforma de *Token as a Service* que qualquer pessoa possa criar seu próprio sistema monetário personalizado. A ideia é que cada sistema monetário criado seja gerenciado pelo serviço principal tratando cada um deles como se fossem moedas diferentes. Os gestores de sistemas monetário podem consumir as informações via API e criarem suas proprias aplicações e gerir contas de seus usuários e fazer o *mint* de novos tokens.

# Funcionalidades
Ação | Usuário Gestor | Usuário final
-- | -- | --
Criar sistema monetário | sim | não
Criar conta | sim | sim
Fazer deposito | sim | sim
Gerar bônus | sim | não
Fazer transferência | não | sim
Ver saldo | sim | sim
Ver extrato | sim | não

# Pontos de Saída Principais
Método | Caminho | Descrição
-- | -- | --
POST | /account/create | Cria uma conta dentro do sistema monetário
POST | /account/login | Faz login no sistema monetário
POST | /account/pin | Configura o pin da conta
POST | /bank/deposit | Faz um depósito
POST | /bank/transfer | Faz uma transferência
GET | /bank/balance | Ve o saldo da conta
GET | /bank/statement | Ve o extrato do mes

# Autenticação
As requisições são autenticadas usando header *X-Resource-Token* da conta a ser usada na transação.
Antes disso, um *Integration-Token* deve ser informado.

O *Integration-Token* é o código de API do gerenciador do sistema.
O *X-Resource-Token* é derivado do usuário logado.

Exemplo de token decodificado (uso interno)
ˋˋˋ
{
    "account": "numero da conta",
    "bank": "codigo do sistema monetário",
    "expiresAt": "",
}
ˋˋˋ

Em ações que envolvam movimentação é necessário 