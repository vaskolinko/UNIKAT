import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({ default: prismaMock }));

import app from "../src/server.js";

describe("Prijava uporabnika", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.user.findUnique.mockResolvedValue(null);
  });

  it("zavrne prijavo brez e-poštnega naslova", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "VarnoGeslo123" });

    expect(res.status).toBe(400);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("zavrne prijavo brez gesla", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ana@example.com" });

    expect(res.status).toBe(400);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("zavrne prijavo neobstoječega uporabnika", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nihce@example.com", password: "VarnoGeslo123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Napačen e-poštni naslov ali geslo.");
  });

  it("zavrne napačno geslo", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      firstName: "Ana",
      lastName: "Novak",
      email: "ana@example.com",
      role: "CUSTOMER",
      passwordHash: await bcrypt.hash("PravoGeslo123", 4),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ana@example.com", password: "NapacnoGeslo123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Napačen e-poštni naslov ali geslo.");
  });

  it("pri prijavi normalizira e-poštni naslov", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: "  ANA@Example.COM ", password: "VarnoGeslo123" });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "ana@example.com" } })
    );
  });
});

describe("Registracija – dodatni primeri", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.user.findUnique.mockResolvedValue(null);
  });

  it("e-poštni naslov shrani z malimi črkami in vlogo CUSTOMER", async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      firstName: "Ana",
      lastName: "Novak",
      email: "ana@example.com",
      role: "CUSTOMER",
    });

    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ana",
      lastName: "Novak",
      email: "  ANA@Example.COM ",
      password: "VarnoGeslo123",
    });

    expect(res.status).toBe(201);
    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "ana@example.com",
          role: "CUSTOMER",
        }),
      })
    );
  });

  it("vrne 500, če pride do napake v bazi", async () => {
    prismaMock.user.create.mockRejectedValue(new Error("DB napaka"));

    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ana",
      lastName: "Novak",
      email: "ana@example.com",
      password: "VarnoGeslo123",
    });

    expect(res.status).toBe(500);
  });
});

describe("Zaščitene poti", () => {
  it("GET /api/auth/me brez prijave vrne 401", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Uporabnik ni prijavljen.");
  });

  it("GET /api/protected brez prijave vrne 401", async () => {
    const res = await request(app).get("/api/protected");

    expect(res.status).toBe(401);
  });
});