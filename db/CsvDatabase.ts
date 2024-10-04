import { createReadStream, createWriteStream, existsSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { join } from 'path';
import { Database } from './Database';
import { Task } from '../models/Task';

export class CsvDatabase extends Database {
    private filePath: string;
    private tasks: Task[] = [];

    constructor() {
        super();
        this.filePath = join(__dirname, 'tasks.csv');
        this.initializeDatabase();  // Asegurarnos de que el archivo exista
        this.loadData();            // Cargar datos del archivo CSV
        Task.latestId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) : 0;
    }

    // Validamos si el archivo existe, y si no, lo creamos con la cabecera
    private initializeDatabase(): void {
        if (!existsSync(this.filePath)) {
            console.log('Archivo CSV no encontrado. Creando nuevo archivo...');
            // Crear el archivo CSV con las cabeceras
            writeFileSync(this.filePath, 'id,descripcion,completado\n', 'utf-8');
        }
    }

    // Cargar los datos desde el archivo CSV
    private loadData(): void {
        createReadStream(this.filePath)
            .pipe(parse({ columns: true }))
            .on('data', (row) => {
                this.tasks.push({
                    id: parseInt(row.id, 10),
                    descripcion: row.descripcion,
                    completado: row.completado === 'true'
                });
            })
            .on('end', () => {
                console.log('Datos del archivo CSV cargados correctamente.');
            });
    }

    // Guardar los datos en el archivo CSV
    private saveData(): void {
        const csvStringifier = stringify({ header: true });
        const writableStream = createWriteStream(this.filePath);

        csvStringifier.pipe(writableStream);
        this.tasks.forEach(task => {
            csvStringifier.write({
                id: task.id.toString(),
                descripcion: task.descripcion,
                completado: task.completado.toString()
            });
        });
        csvStringifier.end();
    }

    // Obtener todas las tareas
    getAllTasks(): Task[] {
        return this.tasks;
    }

    // Obtener una tarea por su ID
    getTaskById(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    // Crear una nueva tarea
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

export const db = new CsvDatabase();
