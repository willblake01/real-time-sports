import express from 'express';
import { eq } from 'drizzle-orm';
import { db, pool } from './db.js';
import { demoUsers } from './schema.js';

const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Real-Time Sports API!' });
});

// CRUD Demo route
app.get('/demo-crud', async (req, res) => {
  try {
    console.log('Performing CRUD operations...');

    // CREATE: Insert a new user
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: 'Demo User', email: `demo${Date.now()}@example.com` })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    
    console.log('✅ CREATE: New user created:', newUser);

    // READ: Select the user
    const foundUser = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ: Found user:', foundUser[0]);

    // UPDATE: Change the user's name
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Updated Demo User' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();
    
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    
    console.log('✅ UPDATE: User updated:', updatedUser);

    // DELETE: Remove the user
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE: User deleted.');

    res.json({ 
      message: 'CRUD operations completed successfully', 
      operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    res.status(500).json({ error: 'Failed to perform CRUD operations', details: error.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  console.log('Database pool closed.');
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
  console.log(`📊 Visit http://localhost:${PORT}/demo-crud to test database operations`);
});