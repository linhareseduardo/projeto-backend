const request = require("supertest");

require("dotenv").config();

const app = require("../src/app");
const { waitForDatabase, resetDatabase, closeDatabase } = require("./helpers/db-test-setup");

jest.setTimeout(60000);

describe("Integration API (MySQL)", () => {
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
      firstname: "Ana",
      surname: "Silva",
      email: "ana@mail.com",
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
    expect(typeof tokenResponse.body.token).toBe("string");

    return {
      token: tokenResponse.body.token,
      userId: userResponse.body.id,
    };
  }

  it("deve executar fluxo completo de usuario", async () => {
    const payload = {
      firstname: "Joao",
      surname: "Souza",
      email: "joao@mail.com",
      password: "123@123",
      confirmPassword: "123@123",
    };

    const created = await request(app).post("/v1/user").send(payload);
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      firstname: payload.firstname,
      surname: payload.surname,
      email: payload.email,
    });

    const login = await request(app).post("/v1/user/token").send({
      email: payload.email,
      password: payload.password,
    });
    expect(login.status).toBe(200);

    const getUser = await request(app).get(`/v1/user/${created.body.id}`);
    expect(getUser.status).toBe(200);

    const updated = await request(app)
      .put(`/v1/user/${created.body.id}`)
      .set("Authorization", `Bearer ${login.body.token}`)
      .send({ firstname: "Joao2", surname: "Souza2", email: "joao2@mail.com" });

    expect(updated.status).toBe(204);

    const afterUpdate = await request(app).get(`/v1/user/${created.body.id}`);
    expect(afterUpdate.status).toBe(200);
    expect(afterUpdate.body).toMatchObject({
      firstname: "Joao2",
      surname: "Souza2",
      email: "joao2@mail.com",
    });

    const deleted = await request(app)
      .delete(`/v1/user/${created.body.id}`)
      .set("Authorization", `Bearer ${login.body.token}`);

    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).get(`/v1/user/${created.body.id}`);
    expect(afterDelete.status).toBe(404);
  });

  it("deve executar fluxo completo de categoria", async () => {
    const { token } = await createUserAndGetToken();

    const created = await request(app)
      .post("/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Shoes", slug: "shoes", use_in_menu: true });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: "Shoes", slug: "shoes" });

    const search = await request(app).get("/v1/category/search?limit=-1");
    expect(search.status).toBe(200);
    expect(Array.isArray(search.body.data)).toBe(true);
    expect(search.body.total).toBe(1);

    const byId = await request(app).get(`/v1/category/${created.body.id}`);
    expect(byId.status).toBe(200);

    const updated = await request(app)
      .put(`/v1/category/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Running", slug: "running", use_in_menu: false });

    expect(updated.status).toBe(204);

    const afterUpdate = await request(app).get(`/v1/category/${created.body.id}`);
    expect(afterUpdate.status).toBe(200);
    expect(afterUpdate.body).toMatchObject({ name: "Running", slug: "running" });

    const deleted = await request(app)
      .delete(`/v1/category/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).get(`/v1/category/${created.body.id}`);
    expect(afterDelete.status).toBe(404);
  });

  it("deve executar fluxo completo de produto", async () => {
    const { token } = await createUserAndGetToken();

    const category = await request(app)
      .post("/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Roupas", slug: "roupas", use_in_menu: true });

    expect(category.status).toBe(201);

    const created = await request(app)
      .post("/v1/product")
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: true,
        name: "Camiseta",
        slug: "camiseta",
        stock: 10,
        description: "Camiseta basica",
        price: 49.9,
        price_with_discount: 39.9,
        category_ids: [category.body.id],
        images: [{ type: "image/png", content: "https://img.local/camisa.png" }],
        options: [
          {
            title: "Tamanho",
            shape: "square",
            type: "text",
            values: ["P", "M", "G"],
          },
        ],
      });

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: "Camiseta", slug: "camiseta" });
    expect(Array.isArray(created.body.category_ids)).toBe(true);

    const search = await request(app).get("/v1/product/search?limit=-1");
    expect(search.status).toBe(200);
    expect(search.body.total).toBe(1);

    const byId = await request(app).get(`/v1/product/${created.body.id}`);
    expect(byId.status).toBe(200);
    expect(byId.body.name).toBe("Camiseta");

    const updated = await request(app)
      .put(`/v1/product/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: true,
        name: "Camiseta Premium",
        slug: "camiseta-premium",
        stock: 12,
        description: "Atualizada",
        price: 59.9,
        price_with_discount: 49.9,
        category_ids: [category.body.id],
        images: [],
        options: [],
      });

    expect(updated.status).toBe(204);

    const afterUpdate = await request(app).get(`/v1/product/${created.body.id}`);
    expect(afterUpdate.status).toBe(200);
    expect(afterUpdate.body).toMatchObject({
      name: "Camiseta Premium",
      slug: "camiseta-premium",
    });

    const deleted = await request(app)
      .delete(`/v1/product/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).get(`/v1/product/${created.body.id}`);
    expect(afterDelete.status).toBe(404);
  });
});
