import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'taskmanager',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category?: string
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

export const tasksDb = {
  create: async (input: CreateTaskInput): Promise<Task> => {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'INSERT INTO tasks (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [input.title, input.description, input.priority || 'medium', input.category]
      )
      return result.rows[0] as Task
    } finally {
      client.release()
    }
  },

  getAll: async (): Promise<Task[]> => {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM tasks ORDER BY created_at DESC')
      return result.rows as Task[]
    } finally {
      client.release()
    }
  },

  getById: async (id: number): Promise<Task | undefined> => {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id])
      return result.rows[0] as Task | undefined
    } finally {
      client.release()
    }
  },

  update: async (id: number, input: UpdateTaskInput): Promise<Task | undefined> => {
    const client = await pool.connect()
    try {
      const updates: string[] = []
      const values: any[] = []
      let paramIndex = 1
      
      if (input.title !== undefined) {
        updates.push(`title = $${paramIndex}`)
        values.push(input.title)
        paramIndex++
      }
      if (input.description !== undefined) {
        updates.push(`description = $${paramIndex}`)
        values.push(input.description)
        paramIndex++
      }
      if (input.completed !== undefined) {
        updates.push(`completed = $${paramIndex}`)
        values.push(input.completed)
        paramIndex++
      }
      if (input.priority !== undefined) {
        updates.push(`priority = $${paramIndex}`)
        values.push(input.priority)
        paramIndex++
      }
      if (input.category !== undefined) {
        updates.push(`category = $${paramIndex}`)
        values.push(input.category)
        paramIndex++
      }
      
      if (updates.length === 0) return tasksDb.getById(id)
      
      values.push(id)
      const result = await client.query(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      )
      return result.rows[0] as Task | undefined
    } finally {
      client.release()
    }
  },

  delete: async (id: number): Promise<boolean> => {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM tasks WHERE id = $1', [id])
      return result.rowCount ? result.rowCount > 0 : false
    } finally {
      client.release()
    }
  },

  search: async (query: string): Promise<Task[]> => {
    const client = await pool.connect()
    try {
      const searchTerm = `%${query}%`
      const result = await client.query(
        'SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $2 ORDER BY created_at DESC',
        [searchTerm, searchTerm]
      )
      return result.rows as Task[]
    } finally {
      client.release()
    }
  },

  getByStatus: async (completed: boolean): Promise<Task[]> => {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM tasks WHERE completed = $1 ORDER BY created_at DESC',
        [completed]
      )
      return result.rows as Task[]
    } finally {
      client.release()
    }
  },

  getByCategory: async (category: string): Promise<Task[]> => {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM tasks WHERE category = $1 ORDER BY created_at DESC',
        [category]
      )
      return result.rows as Task[]
    } finally {
      client.release()
    }
  },

  getByPriority: async (priority: string): Promise<Task[]> => {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT * FROM tasks WHERE priority = $1 ORDER BY created_at DESC',
        [priority]
      )
      return result.rows as Task[]
    } finally {
      client.release()
    }
  }
}