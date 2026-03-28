const request = require("supertest");

const app = require("../src/app");

describe("Protected and validation routes", () => {
  it("deve retornar 400 em PUT /v1/user/:id sem token", async () => {
    const response = await request(app).put("/v1/user/1").send({
      firstname: "Ana",
      surname: "Silva",
      email: "ana@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Authorization token is required");
  });

  it("deve retornar 400 em POST /v1/category sem token", async () => {
    const response = await request(app).post("/v1/category").send({
      name: "Shoes",
      slug: "shoes",
      use_in_menu: true,
    });

    expect(response.status).toBe(400);
  });

  it("deve retornar 400 em POST /v1/product sem token", async () => {
    const response = await request(app).post("/v1/product").send({
      name: "Produto A",
      slug: "produto-a",
      price: 10,
      price_with_discount: 9,
    });

    expect(response.status).toBe(400);
  });

  it("deve retornar 400 em GET /v1/user/:id quando id inválido", async () => {
    const response = await request(app).get("/v1/user/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid id param");
  });

  it("deve retornar 400 em POST /v1/user/token sem payload completo", async () => {
    const response = await request(app).post("/v1/user/token").send({
      email: "ana@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing required fields");
  });
});
