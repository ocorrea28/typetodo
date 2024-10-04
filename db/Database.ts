import { Task } from "../models/Task";

// db/Database.ts
export abstract class Database {
    constructor() {
        if (new.target === Database) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }

    abstract getAllTasks(): Task[];
    abstract getTaskById(id: number): Task | undefined;
    abstract createTask(descripcion: string, completado: boolean): Task;
    abstract updateTask(id: number, task: Partial<Task>): Task | null;
    abstract deleteTask(id: number): Task | null;
}
