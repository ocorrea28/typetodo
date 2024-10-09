import { Request, Response } from 'express';
import { db } from '../db/PostgresDatabase';

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await db.getAllTasks();
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await db.getTaskById(parseInt(req.params.id, 10));
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { descripcion, completado } = req.body;
        const newTask = await db.createTask(descripcion, completado);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { descripcion, completado } = req.body;
        const updatedTask = await db.updateTask(parseInt(req.params.id, 10), descripcion, completado);
        if (updatedTask) {
            res.json(updatedTask);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const deletedTask = await db.deleteTask(parseInt(req.params.id, 10));
        if (deletedTask) {
            res.json(deletedTask);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
};
