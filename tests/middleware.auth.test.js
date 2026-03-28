const jwt = require("jsonwebtoken");

const authMiddleware = require("../src/middleware/auth.middleware");

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("deve retornar 400 quando header authorization não for enviado", () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Authorization token is required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando token for inválido", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } };
    const res = createMockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid authorization token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next quando token for válido", () => {
    const token = jwt.sign({ id: 1, email: "test@mail.com" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createMockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject({ id: 1, email: "test@mail.com" });
  });
});
