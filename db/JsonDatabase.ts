import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Database } from './Database';
import { Task } from '../models/Task';

export class JsonDatabase extends Database {
    private filePath: string;
    private tasks: Task[] = [];

    constructor() {
        super();
        this.filePath = join(__dirname, 'tasks.json');
        this.loadData();

        // Asignar el ID más alto de las tareas existentes a Task.latestId
        Task.latestId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) : 0;
    }

    // Cargar datos del archivo JSON
    private loadData(): void {
        if (existsSync(this.filePath)) {
            const data = readFileSync(this.filePath, 'utf-8');
            this.tasks = JSON.parse(data);
        } else {
            this.tasks = [];
        }
    }

    // Guardar los datos de las tareas en el archivo JSON
    private saveData(): void {
        writeFileSync(this.filePath, JSON.stringify(this.tasks, null, 2));
    }

    // Obtener todas las tareas
    getAllTasks(): Task[] {
        return this.tasks;
    }

    // Obtener una tarea por su ID
    getTaskById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    // Crear una nueva tarea con un nuevo ID
    createTask(descripcion: string, completado: boolean): Task {
        const newTask = new Task(descripcion, completado);
        this.tasks.push(newTask);
        this.saveData();
        return newTask;
    }

    // Actualizar una tarea existente
    updateTask(id: number, updatedTask: Partial<Task>): Task | null {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            this.saveData();
            return this.tasks[index];
        }
        return null;
    }

    // Eliminar una tarea por su ID
    deleteTask(id: number): Task | null {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const [deletedTask] = this.tasks.splice(index, 1);
            this.saveData();
            return deletedTask;
        }
        return null;
    }
}

export const db = new JsonDatabase();
