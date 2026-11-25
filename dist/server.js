// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

// src/middleware/authMiddleware.ts
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Za dostop se mora\u0161 prijaviti."
    });
  }
  next();
}

// src/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcrypt";

// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var prisma_default = prisma;

// src/routes/auth.ts
var router = Router();
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || typeof password !== "string" || !firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      return res.status(400).json({
        message: "Vsa polja so obvezna."
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Vnesi veljaven e-po\u0161tni naslov."
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Geslo mora vsebovati vsaj 8 znakov."
      });
    }
    const existingUser = await prisma_default.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Uporabnik s tem e-po\u0161tnim naslovom \u017Ee obstaja."
      });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma_default.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "CUSTOMER"
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });
    return res.status(201).json({
      message: "Registracija je bila uspe\u0161na.",
      user
    });
  } catch (error) {
    console.error("Napaka pri registraciji:", error);
    return res.status(500).json({
      message: "Pri registraciji je pri\u0161lo do napake."
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({
        message: "Vnesi e-po\u0161tni naslov in geslo."
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma_default.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (!user) {
      return res.status(401).json({
        message: "Napa\u010Den e-po\u0161tni naslov ali geslo."
      });
    }
    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Napa\u010Den e-po\u0161tni naslov ali geslo."
      });
    }
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    req.session.userId = user.id;
    await new Promise((resolve, reject) => {
      req.session.save((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    return res.status(200).json({
      message: "Prijava je bila uspe\u0161na.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Napaka pri prijavi:", error);
    return res.status(500).json({
      message: "Pri prijavi je pri\u0161lo do napake."
    });
  }
});
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Uporabnik ni prijavljen."
      });
    }
    const user = await prisma_default.user.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });
    if (!user) {
      return res.status(401).json({
        message: "Uporabnik ne obstaja."
      });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Napaka pri preverjanju uporabnika:", error);
    return res.status(500).json({
      message: "Pri preverjanju uporabnika je pri\u0161lo do napake."
    });
  }
});
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Napaka pri odjavi:", error);
      return res.status(500).json({
        message: "Pri odjavi je pri\u0161lo do napake."
      });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({
      message: "Uspe\u0161no si se odjavil/a."
    });
  });
});
var auth_default = router;

// src/server.ts
dotenv.config();
var app = express();
var isProduction = process.env.NODE_ENV === "production";
var frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.set("trust proxy", 1);
var PORT = process.env.PORT || 3e3;
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET ni nastavljen v .env datoteki.");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ni nastavljen v .env datoteki.");
}
var pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var PgSessionStore = connectPgSimple(session);
var sessionStore = new PgSessionStore({
  pool: pgPool,
  tableName: "user_sessions",
  createTableIfMissing: true
});
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1e3 * 60 * 60 * 24
    }
  })
);
app.use("/api/auth", auth_default);
app.get("/", (_req, res) => {
  res.json({
    message: "UNIKAT API deluje!"
  });
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    project: "UNIKAT"
  });
});
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({
    message: "Dostop dovoljen.",
    userId: req.session.userId
  });
});
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`UNIKAT API poslu\u0161a na portu ${PORT}`);
  });
}
var server_default = app;
export {
  server_default as default
};
