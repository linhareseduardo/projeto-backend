# 🚀 Projeto Backend - Guia Completo para Execução

**Ecommerce de Produtos Esportivos** - API REST com Node.js, Express, JWT e MySQL

---

## 📋 Sumário Rápido

- **Tecnologias**: Node.js, Express, Sequelize ORM, MySQL 8.0, JWT, Jest
- **Porta**: `3000` (configurável via `PORT` no `.env`)
- **Auto-População**: ✅ Banco popula automaticamente com 10 usuários + 5 categorias + 15 produtos na primeira execução
- **Autenticação**: JWT Bearer Token
- **Testes**: 26 testes (17 unitários + 9 integração) - todos passando ✅

---

## 🎯 Execução Passo a Passo (Para a Examinadora)

### 1️⃣ Clonar e Instalar

```bash
# Clonar repositório
git clone https://github.com/linhareseduardo/projeto-backend.git
cd projeto-backend

# Instalar dependências
npm install
```

### 2️⃣ Subir o Banco de Dados

```bash
# Inicia MySQL via Docker (requer Docker Desktop instalado)
npm run db:up

# ✅ Aguarde até ver: "projeto-backend-mysql Up ... (healthy)"
```

**O que acontece**: Container MySQL 8.0 é iniciado na porta `3306`

### 3️⃣ Iniciar a API

```bash
# Inicia servidor em modo desenvolvimento
npm run start

# ✅ Você verá logs como:
# Server running on port 3000
# Seed aplicado: +10 users, +5 categories, +15 products
```

**O que acontece automaticamente**:
1. Database sincroniza (cria tabelas)
2. **Auto-seed dispara**: Popula banco com dados realistas de esportes
3. API fica pronta em `http://localhost:3000`

### 4️⃣ Validar que Está Funcionando

#### Opção A: Health Check (sem autenticação)
```bash
curl http://localhost:3000/health
# Resposta: {"status":"ok"}
```

#### Opção B: Usar Postman (Recomendado!)
Importe a coleção pronta:
```
postman/projeto-backend.postman_collection.json
```

Ou acesse: `http://localhost:3000/health` no navegador

### 5️⃣ Parar o Banco (quando terminar)

```bash
npm run db:down
```

---

## 🔑 Fluxo de Autenticação

Todos os endpoints de **escrita** (POST/PUT/DELETE) exigem **JWT Bearer Token**.

### Token de Teste Pré-Configurado

Email: `joao.silva.1@sportstore.com`  
Senha: `123@123`

### Obter Token (Fluxo)

**1. Fazer login (gera token)**
```bash
POST http://localhost:3000/v1/user/token

Body JSON:
{
  "email": "joao.silva.1@sportstore.com",
  "password": "123@123"
}

Response:
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**2. Usar token em requisições protegidas**
```bash
Authorization: Bearer <seu_token_aqui>
```

---

## 📡 Todas as Rotas Disponíveis

### Health Check (Bem-vindo / Status)
| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| GET | `/health` | ❌ | Status da API |

### Autenticação
| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| POST | `/v1/user/token` | ❌ | Gerar token JWT |

---

### 👤 Usuários (Users)

| Método | Rota | Autenticação | Descrição | Status |
|--------|------|:---:|-----------|--------|
| POST | `/v1/user` | ❌ | Criar novo usuário | 201 |
| GET | `/v1/user/:id` | ❌ | Obter usuário por ID | 200/404 |
| PUT | `/v1/user/:id` | ✅ | Atualizar usuário | 204/400/401/404 |
| DELETE | `/v1/user/:id` | ✅ | Deletar usuário | 204/401/404 |

**Exemplo: Criar Usuário**
```bash
POST http://localhost:3000/v1/user
Content-Type: application/json

{
  "firstname": "João",
  "surname": "Silva",
  "email": "joao@mail.com",
  "password": "123@123",
  "confirmPassword": "123@123"
}
```

**Exemplo: Obter Usuário**
```bash
GET http://localhost:3000/v1/user/1
```

---

### 📂 Categorias (Categories)

| Método | Rota | Autenticação | Descrição | Status |
|--------|------|:---:|-----------|--------|
| GET | `/v1/category/search` | ❌ | Listar categorias | 200/400 |
| GET | `/v1/category/:id` | ❌ | Obter categoria por ID | 200/404 |
| POST | `/v1/category` | ✅ | Criar categoria | 201/400/401 |
| PUT | `/v1/category/:id` | ✅ | Atualizar categoria | 204/400/401/404 |
| DELETE | `/v1/category/:id` | ✅ | Deletar categoria | 204/401/404 |

**Categorias Pré-Carregadas:**
1. Futebol & Futsal
2. Corrida & Atletismo
3. Musculação & Fitness
4. Tênis & Raquetes
5. Natação & Esportes Aquáticos

**Exemplo: Listar Categorias**
```bash
GET http://localhost:3000/v1/category/search?limit=10&page=1

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Futebol & Futsal",
      "slug": "futebol-futsal",
      "use_in_menu": true
    },
    ...
  ],
  "total": 5,
  "limit": 10,
  "page": 1
}
```

**Exemplo: Criar Categoria (com token)**
```bash
POST http://localhost:3000/v1/category
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Esportes de Praia",
  "slug": "esportes-praia",
  "use_in_menu": false
}
```

---

### 🛍️ Produtos (Products)

| Método | Rota | Autenticação | Descrição | Status |
|--------|------|:---:|-----------|--------|
| GET | `/v1/product/search` | ❌ | Listar produtos | 200/400 |
| GET | `/v1/product/:id` | ❌ | Obter produto por ID | 200/404 |
| POST | `/v1/product` | ✅ | Criar produto | 201/400/401 |
| PUT | `/v1/product/:id` | ✅ | Atualizar produto | 204/400/401/404 |
| DELETE | `/v1/product/:id` | ✅ | Deletar produto | 204/401/404 |

**Produtos Pré-Carregados (15 produtos):**

**Futebol (3)**
- Chuteira Nike Phantom GX (R$ 599,90 → R$ 479,90)
- Bola Oficial FIFA (R$ 349,90 → R$ 279,90)
- Uniforme de Treino Masculino (R$ 189,90 → R$ 149,90)

**Corrida (3)**
- Tênis Running Asics Gel Nimbus (R$ 549,90 → R$ 429,90)
- Mochila Esportiva 30L (R$ 229,90 → R$ 179,90)
- Relógio GPS Garmin Forerunner (R$ 1.299,90 → R$ 999,90)

**Musculação (3)**
- Halteres Ajustáveis 20kg (R$ 449,90 → R$ 349,90)
- Colchonete Yoga Premium 10mm (R$ 189,90 → R$ 149,90)
- Fone Bluetooth Sem Fio (R$ 279,90 → R$ 219,90)

**Tênis (3)**
- Raquete Head Titanium Pro (R$ 799,90 → R$ 599,90)
- Bola de Tênis Pressurizada Wilson (R$ 79,90 → R$ 59,90)
- Grips Anti-Suor para Raquete (R$ 49,90 → R$ 39,90)

**Natação (3)**
- Óculos Speedo Mariner (R$ 129,90 → R$ 99,90)
- Sunga Competition Speedo (R$ 199,90 → R$ 159,90)
- Touca em Látex Impermeável (R$ 49,90 → R$ 39,90)

**Exemplo: Listar Produtos**
```bash
GET http://localhost:3000/v1/product/search?limit=5&page=1

Response:
{
  "data": [
    {
      "id": 1,
      "enabled": true,
      "name": "Chuteira Nike Phantom GX",
      "slug": "chuteira-nike-phantom-gx",
      "stock": 12,
      "description": "Chuteira profissional para futebol...",
      "price": 599.90,
      "price_with_discount": 479.90,
      "category_ids": [1],
      "images": [...],
      "options": [...]
    },
    ...
  ],
  "total": 15,
  "limit": 5,
  "page": 1
}
```

---

## 🧪 Executar Testes

### Testes Unitários (4 suites, 17 testes)
```bash
npm run test
```

### Testes de Integração (2 suites, 9 testes)
```bash
npm run test:integration
```

### Todos os Testes
```bash
npm run test:all
```

**Resultado esperado**: ✅ Todos os 26 testes passando

---

## 🛠️ Scripts Úteis

```bash
# Desenvolvimento
npm run dev           # Inicia com nodemon (hot-reload)
npm run start         # Inicia normalmente

# Testes
npm run test          # Testes unitários
npm run test:integration  # Testes integração
npm run test:all      # Ambos

# Banco de Dados
npm run db:up         # Inicia MySQL Docker
npm run db:down       # Para MySQL Docker
npm run db:reset      # Reseta e reapopula banco

# Seed
npm run seed:extra    # Popula extra dados (manual)
```

---

## 📮 Demo com Postman (Recomendado)

A coleção Postman está pronta em:
```
postman/projeto-backend.postman_collection.json
```

### Como Importar:
1. Abra Postman
2. Click em "Import"
3. Selecione `postman/projeto-backend.postman_collection.json`
4. A coleção carrega com todas as rotas + token capturado automaticamente

### Ordem Recomendada de Teste:
1. **Health Check**: `GET /health`
2. **Gerar Token**: `POST /v1/user/token` (salva token automaticamente)
3. **Listar Categorias**: `GET /v1/category/search`
4. **Listar Produtos**: `GET /v1/product/search`
5. **Criar Categoria**: `POST /v1/category` (usa token)
6. **Criar Produto**: `POST /v1/product` (usa token)

---

## 📊 Estrutura do Banco de Dados

```
projeto_backend
├── users (10 registros)
│   ├── id (PK)
│   ├── firstname
│   ├── surname
│   ├── email (UNIQUE)
│   ├── password (hashed com bcrypt)
│   └── timestamps
│
├── categories (5 registros)
│   ├── id (PK)
│   ├── name
│   ├── slug
│   ├── use_in_menu
│   └── timestamps
│
├── products (15 registros)
│   ├── id (PK)
│   ├── enabled
│   ├── name
│   ├── slug
│   ├── stock
│   ├── description
│   ├── price
│   ├── price_with_discount
│   ├── use_in_menu
│   └── timestamps
│
├── product_images
│   ├── id (PK)
│   ├── product_id (FK)
│   ├── path
│   ├── enabled
│   └── timestamps
│
├── product_options
│   ├── id (PK)
│   ├── product_id (FK)
│   ├── title
│   ├── shape
│   ├── radius
│   ├── type
│   └── values
│
└── product_categories (tabela de junção)
    ├── product_id (FK)
    └── category_id (FK)
```

---

## ✅ Checklist de Validação

Antes de apresentar à examinadora:

- [x] `npm run db:up` → MySQL rodando
- [x] `npm run start` → API iniciada com seed automático
- [x] `GET /health` → Responde 200
- [x] `POST /v1/user/token` → Retorna token válido
- [x] `GET /v1/category/search` → Retorna 5 categorias
- [x] `GET /v1/product/search` → Retorna 15 produtos
- [x] `npm run test:all` → 26 testes passando
- [x] Postman collection importada → Todas as rotas testáveis
- [x] Dados de esportes realistas → Confirmado ✅

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to MySQL"
```bash
# Verifique se Docker está rodando
docker ps

# Se não estiver, inicie:
npm run db:up

# Aguarde ~5 segundos
```

### Erro: "Port 3000 already in use"
```bash
# Mude a porta no .env
PORT=3001
```

### Erro: "AUTO_SEED_ON_START not working"
```bash
# Reset e repopule:
npm run db:reset
```

### Teste falhou
```bash
# Certifique-se que MySQL está UP:
npm run db:up

# Depois rode os testes:
npm run test:all
```

---

## 📚 Referências

- **Express.js**: https://expressjs.com
- **Sequelize**: https://sequelize.org
- **JWT**: https://jwt.io
- **MySQL**: https://www.mysql.com
- **Docker**: https://www.docker.com

---

## 📝 Notas Importantes

1. **Auto-Seed**: A primeira inicialização popula automaticamente com 10 usuários, 5 categorias e 15 produtos realistas de esportes.

2. **Tokens JWT**: Expiram em **24 horas**. Para gerar novo, fazer login novamente.

3. **Senhas**: Todas as contas de demonstração usam senha `123@123`.

4. **Dados Realistas**: Todos os produtos, categorias e usuários são baseados em um ecommerce real de esportes.

5. **Ambiente Docker**: Requer Docker Desktop instalado e rodando.

---

**Projeto pronto para apresentação à examinadora! 🚀**

Contato: [LinkedIn](https://linkedin.com/in/linhareseduardo)
