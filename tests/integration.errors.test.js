const request = require("supertest");

require("dotenv").config();

const app = require("../src/app");
const { waitForDatabase, resetDatabase, closeDatabase } = require("./helpers/db-test-setup");

jest.setTimeout(60000);

describe("Integration API - error scenarios", () => {
  beforeAll(async () => {
    await waitForDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  async function createUserAndGetToken() {
    const userPayload = {
      firstname: "Erro",
      surname: "Teste",
      email: "erro.teste@mail.com",
      password: "123@123",
      confirmPassword: "123@123",
    };

    const userResponse = await request(app).post("/v1/user").send(userPayload);
    expect(userResponse.status).toBe(201);

    const tokenResponse = await request(app).post("/v1/user/token").send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(tokenResponse.status).toBe(200);

    return tokenResponse.body.token;
  }

  it("deve retornar 400 em /v1/user/token com senha incorreta", async () => {
    await request(app).post("/v1/user").send({
      firstname: "Ana",
      surname: "Silva",
      email: "ana.silva@mail.com",
      password: "123@123",
      confirmPassword: "123@123",
    });

    const response = await request(app).post("/v1/user/token").send({
      email: "ana.silva@mail.com",
      password: "senha-errada",
    });

    expect(response.status).toBe(400);
  });

  it("deve retornar 404 ao atualizar usuario inexistente", async () => {
    const token = await createUserAndGetToken();

    const response = await request(app)
      .put("/v1/user/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Novo", surname: "Nome", email: "novo@mail.com" });

    expect(response.status).toBe(404);
  });

  it("deve retornar 400 em category/search com limit invalido", async () => {
    const response = await request(app).get("/v1/category/search?limit=0");

    expect(response.status).toBe(400);
  });

  it("deve retornar 400 em product/search com limit invalido", async () => {
    const response = await request(app).get("/v1/product/search?limit=abc");

    expect(response.status).toBe(400);
  });

  it("deve retornar 400 ao criar categoria com token mas payload invalido", async () => {
    const token = await createUserAndGetToken();

    const response = await request(app)
      .post("/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Sem slug" });

    expect(response.status).toBe(400);
  });

  it("deve retornar 400 ao criar produto com token mas payload invalido", async () => {
    const token = await createUserAndGetToken();

    const response = await request(app)
      .post("/v1/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Produto sem campos obrigatorios" });

    expect(response.status).toBe(400);
  });
});
