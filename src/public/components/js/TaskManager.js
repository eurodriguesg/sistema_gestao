document.addEventListener('DOMContentLoaded', () => {
    // Adicionar tarefa
    document.getElementById('addTaskForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;
        const project = document.getElementById('project').value;

        const response = await fetch('/api/taskManager/addTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, status, project })
        });

        if (response.status === 200) {
            alert('Tarefa adicionada com sucesso!');
            document.getElementById('addTaskForm').reset();
            loadTasks();
        } else {
            alert('Erro ao adicionar tarefa.');
        }
    });

    // Atualizar status da tarefa
    document.getElementById('updateTaskForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const taskId = document.getElementById('taskId').value;
        const newStatus = document.getElementById('newStatus').value;

        const response = await fetch(`/api/taskManager/updateStatus/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.status === 200) {
            alert('Status atualizado com sucesso!');
            document.getElementById('updateTaskForm').reset();
            loadTasks();
        }  else if (response.status === 404) {
            alert('Tarefa não encontrada');
        } else {
            alert('Erro ao atualizar status.');
        }
    });

    // Consultar tarefas por projeto
    document.getElementById('searchTaskForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const projectName = document.getElementById('projectName').value;

        const response = await fetch(`/api/taskManager/consultTasksByProject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project: projectName })
        });

        if (response.status === 200) {
            
            const tasks = await response.json();
            renderTasks(tasks); // Renderizar diretamente as tarefas retornadas
        } else if (response.status === 404) {
            alert('Projeto não encontrado ou sem tarefas');
        } else {
            alert('Erro desconhecido');
            
        }
    });


    // Carregar todas as tarefas
    async function loadTasks() {
        const response = await fetch('/api/taskManager/getAllTasks');
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            console.error('Erro ao carregar tarefas.');
        }
    }

    // Renderizar lista de tarefas na tabela
    function renderTasks(tasks) {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        // Verificar se a resposta é um objeto com a propriedade "tasks" ou um array
        const taskArray = Array.isArray(tasks) ? tasks : tasks.tasks;

        taskArray.forEach((task) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${task.id}</td>
                <td>${task.description}</td>
                <td>${task.status}</td>
                <td>${task.project}</td>
            `;
            tasksList.appendChild(tr);
        });
    }


    // Carregar as tarefas na inicialização
    loadTasks();
});
