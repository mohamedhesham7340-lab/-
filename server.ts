import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { products, quotationMeta, users } from "./src/db/schema.ts";
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_QUOTATION_META } from './src/data/initialData.ts';

dotenv.config();

async function seedDatabase() {
  try {
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length === 0) {
      console.log('Seeding initial products...');
      await db.insert(products).values(INITIAL_PRODUCTS);
    }
    
    const existingMeta = await db.select().from(quotationMeta).limit(1);
    if (existingMeta.length === 0) {
      console.log('Seeding initial meta...');
      await db.insert(quotationMeta).values({ data: INITIAL_QUOTATION_META });
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function startServer() {
  await seedDatabase();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Get Products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.json(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get Quotation Meta
  app.get("/api/meta", async (req, res) => {
    try {
      const meta = await db.select().from(quotationMeta).limit(1);
      res.json(meta[0]?.data || null);
    } catch (error) {
      console.error('Error fetching meta:', error);
      res.status(500).json({ error: 'Failed to fetch metadata' });
    }
  });

  // Update Quotation Meta
  app.post("/api/meta", async (req, res) => {
    try {
      const meta = await db.select().from(quotationMeta).limit(1);
      if (meta.length > 0) {
        await db.update(quotationMeta).set({ data: req.body }).where(eq(quotationMeta.id, meta[0].id));
      } else {
        await db.insert(quotationMeta).values({ data: req.body });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating meta:', error);
      res.status(500).json({ error: 'Failed to update metadata' });
    }
  });

  // Update or Create Product
  app.post("/api/products", async (req, res) => {
    try {
      const data = req.body;
      const id = data.id;
      
      const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
      
      if (existing.length > 0) {
        await db.update(products).set(data).where(eq(products.id, id));
      } else {
        await db.insert(products).values(data);
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving product:', error);
      res.status(500).json({ error: 'Failed to save product' });
    }
  });

  // Delete Product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await db.delete(products).where(eq(products.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
