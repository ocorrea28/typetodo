import { Router } from 'express';
import { db } from '../db/CsvDatabase';

const router = Router();

router.get('/', (req, res) => {
    const tasks = db.getAllTasks();
    
    let taskRows = tasks.map(task => `
        <tr data-id="${task.id}">
            <td>${task.id}</td>
            <td><input type="text" value="${task.descripcion}" readonly /></td>
            <td>${task.completado ? '✔️' : '❌'}</td>
            <td>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </td>
        </tr>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Todo List App</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="container">
            <h1>Todo List App</h1>
            <input type="text" id="new-task" placeholder="Enter a new task">
            <button id="add-task">Add Task</button>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="task-list">
                    ${taskRows}
                </tbody>
            </table>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', () => {

                // Add Task
                document.getElementById('add-task').addEventListener('click', async function() {
                    const taskDesc = (document.getElementById('new-task') as HTMLInputElement).value;
                    if (taskDesc.trim() === '') return;

                    const response = await fetch('/api/tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            descripcion: taskDesc,
                            completado: false
                        })
                    });

                    if (response.ok) {
                        location.reload();  // Recargar la página para mostrar la nueva tarea
                    }
                });

                // Edit Task
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const row = (this as HTMLElement).closest('tr') as HTMLTableRowElement;
                        const input = row.querySelector('input') as HTMLInputElement;
                        input.removeAttribute('readonly');
                        input.focus();

                        // When focus is lost, update the task
                        input.addEventListener('blur', async () => {
                            const taskId = row.getAttribute('data-id');
                            const newDesc = input.value;

                            const response = await fetch(\`/api/tasks/\${taskId}\`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    descripcion: newDesc
                                })
                            });

                            if (response.ok) {
                                input.setAttribute('readonly', 'true');
                            }
                        });
                    });
                });

                // Delete Task
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', async function() {
                        const row = (this as HTMLElement).closest('tr') as HTMLTableRowElement;
                        const taskId = row.getAttribute('data-id');

                        const response = await fetch(\`/api/tasks/\${taskId}\`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            row.remove();  // Eliminar la fila de la tabla
                        }
                    });
                });

            });
        </script>
    </body>
    </html>
    `;

    res.send(html);
});

export default router;
