const {
  validateCreateUserPayload,
  validateUpdateUserPayload,
} = require("../src/middleware/validate-user-payload.middleware");
const validateTokenPayload = require("../src/middleware/validate-token-payload.middleware");
const validateCategoryPayload = require("../src/middleware/validate-category-payload.middleware");
const {
  validateCreateProductPayload,
  validateUpdateProductPayload,
} = require("../src/middleware/validate-product-payload.middleware");
const validateIdParam = require("../src/middleware/validate-id-param.middleware");

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("Payload validators", () => {
  it("deve invalidar criação de usuário sem confirmPassword", () => {
    const req = {
      body: { firstname: "A", surname: "B", email: "x@mail.com", password: "123" },
    };
    const res = createMockRes();
    const next = jest.fn();

    validateCreateUserPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve invalidar update de usuário sem email", () => {
    const req = { body: { firstname: "A", surname: "B" } };
    const res = createMockRes();
    const next = jest.fn();

    validateUpdateUserPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deve invalidar token payload sem password", () => {
    const req = { body: { email: "x@mail.com" } };
    const res = createMockRes();
    const next = jest.fn();

    validateTokenPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deve invalidar categoria sem slug", () => {
    const req = { body: { name: "Shoes" } };
    const res = createMockRes();
    const next = jest.fn();

    validateCategoryPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deve invalidar produto sem price", () => {
    const req = {
      body: { name: "P", slug: "p", price_with_discount: 1 },
    };
    const res = createMockRes();
    const next = jest.fn();

    validateCreateProductPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deve invalidar update de produto sem price_with_discount", () => {
    const req = {
      body: { name: "P", slug: "p", price: 10 },
    };
    const res = createMockRes();
    const next = jest.fn();

    validateUpdateProductPayload(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("deve invalidar param id não numérico", () => {
    const req = { params: { id: "abc" } };
    const res = createMockRes();
    const next = jest.fn();

    validateIdParam(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid id param" });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve aceitar param id válido", () => {
    const req = { params: { id: "10" } };
    const res = createMockRes();
    const next = jest.fn();

    validateIdParam(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
