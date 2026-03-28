# Revisao Endpoint-a-Endpoint

## Seção 02 - Usuarios
- [x] GET /v1/user/:id
  - 200 quando existe
  - 404 quando nao existe
  - 400 para id invalido
- [x] POST /v1/user
  - 201 quando payload valido
  - 400 quando payload invalido
- [x] PUT /v1/user/:id
  - 204 quando atualiza
  - 400 para payload invalido/id invalido/token ausente ou invalido
  - 404 quando usuario nao existe
- [x] DELETE /v1/user/:id
  - 204 quando deleta
  - 400 para id invalido/token ausente ou invalido
  - 404 quando usuario nao existe

## Seção 03 - Categorias
- [x] GET /v1/category/search
  - 200 com filtros suportados
  - 400 para query invalida
- [x] GET /v1/category/:id
  - 200 quando existe
  - 404 quando nao existe
  - 400 para id invalido
- [x] POST /v1/category
  - 201 quando payload valido
  - 400 para payload invalido/token ausente ou invalido
- [x] PUT /v1/category/:id
  - 204 quando atualiza
  - 400 para payload invalido/id invalido/token ausente ou invalido
  - 404 quando categoria nao existe
- [x] DELETE /v1/category/:id
  - 204 quando deleta
  - 400 para id invalido/token ausente ou invalido
  - 404 quando categoria nao existe

## Seção 04 - Produtos
- [x] GET /v1/product/search
  - 200 com filtros suportados
  - 400 para query invalida
- [x] GET /v1/product/:id
  - 200 quando existe
  - 404 quando nao existe
  - 400 para id invalido
- [x] POST /v1/product
  - 201 quando payload valido
  - 400 para payload invalido/token ausente ou invalido
- [x] PUT /v1/product/:id
  - 204 quando atualiza
  - 400 para payload invalido/id invalido/token ausente ou invalido
  - 404 quando produto nao existe
- [x] DELETE /v1/product/:id
  - 204 quando deleta
  - 400 para id invalido/token ausente ou invalido
  - 404 quando produto nao existe

## Seção 05 - Token JWT
- [x] POST /v1/user/token
  - 200 com credenciais validas
  - 400 com payload invalido ou credenciais invalidas
- [x] Metodos protegidos validam Authorization Bearer
  - 400 quando token ausente/invalido

## Observacoes
- A validacao obrigatoria de token segue a regra de rejeicao com 400 para rotas protegidas, conforme Seção 05.
