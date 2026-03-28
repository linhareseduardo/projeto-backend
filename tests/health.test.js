const request = require("supertest");

const app = require("../src/app");

describe("Health endpoint", () => {
  it("deve retornar 200 com status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
