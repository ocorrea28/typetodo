// models/Task.ts
export interface Task {
    id: number;
    descripcion: string;
    completado: boolean;
}

export class Task implements Task {
    static latestId: number = 1;

    constructor(descripcion: string, completado: boolean = false) {
        this.id = Task.incrementId();  // Asignación automática del ID
        this.descripcion = descripcion;
        this.completado = completado;
    }

    // Método estático para incrementar el ID único
    static incrementId(): number {
        this.latestId++;
        return this.latestId;
    }
}
