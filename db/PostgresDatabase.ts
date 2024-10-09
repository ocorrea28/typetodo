import pool from './dbConfig';
import { Task } from '../models/Task';

export class PostgresDatabase {
    async getAllTasks(): Promise<Task[]> {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        return result.rows;
    }

    async getTaskById(id: number): Promise<Task | null> {
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    async createTask(descripcion: string, completado: boolean): Promise<Task> {
        const result = await pool.query(
            'INSERT INTO tasks (descripcion, completado) VALUES ($1, $2) RETURNING *',
            [descripcion, completado]
        );
        return result.rows[0];
    }

    async updateTask(id: number, descripcion?: string, completado?: boolean): Promise<Task | null> {
        // Primero, obtén la tarea actual para verificar los valores existentes
        const existingTask = await this.getTaskById(id);
        if (!existingTask) return null;
    
        // Utiliza los valores proporcionados o mantiene los valores existentes
        const newDescripcion = descripcion ?? existingTask.descripcion;
        const newCompletado = completado ?? existingTask.completado;
    
        const result = await pool.query(
            'UPDATE tasks SET descripcion = $1, completado = $2 WHERE id = $3 RETURNING *',
            [newDescripcion, newCompletado, id]
        );
        return result.rows[0] || null;
    }

    async deleteTask(id: number): Promise<Task | null> {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] || null;
    }
}

export const db = new PostgresDatabase();
