import { Request, Response } from 'express';
import { db } from '../db/JsonDatabase';

export const getAllTasks = (req: Request, res: Response) => {
    const tasks = db.getAllTasks();
    res.json(tasks);
};

export const getTaskById = (req: Request, res: Response) => {
    const task = db.getTaskById(parseInt(req.params.id, 10));
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
};

export const createTask = (req: Request, res: Response) => {
    const { descripcion, completado } = req.body;
    const newTask = db.createTask(descripcion, completado);
    res.status(201).json(newTask);
};

export const updateTask = (req: Request, res: Response) => {
    const updatedTask = db.updateTask(parseInt(req.params.id, 10), req.body);
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).send('Task not found');
    }
};

export const deleteTask = (req: Request, res: Response) => {
    const deletedTask = db.deleteTask(parseInt(req.params.id, 10));
    if (deletedTask) {
        res.json(deletedTask);
    } else {
        res.status(404).send('Task not found');
    }
};
