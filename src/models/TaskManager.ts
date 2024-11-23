import { Task } from "./Task";

export class TaskManager {

    private tasks: Array<Task>;

    constructor() {
        this.tasks = new Array<Task>();
    }

    // Métodoo para listar tarefas
    public getAllTasks() {
        //console.log(`[SRV-TASKMANAGER 🟡] Listando tarefas!`);
        return this.tasks;
    }
    addTask(description: string, status: string, project: string): void {
        const tarefa = new Task(description, status, project);
        this.tasks.push(tarefa);
    }

    updateStatus(id: string, status: string): boolean {
        const tarefa = this.tasks.find((t) => t.id === id);
        // console.log(`[SRV-TASKMANAGER 🟡] Atualizando status da tarefa!`);

        if (!tarefa) {
            console.log(`[SRV-TASKMANAGER 🔴] Tarefa não encontrada`);
            
            return false; // Retorna null caso o funcionário não seja encontrado
        }
        
        tarefa.status = status;
        console.log(`[SRV-TASKMANAGER ✅] Tarefa atualizada com sucesso`);
        return true
    }

    consultTasksByProject(project: string): Task[] {
        return this.tasks.filter((t) => t.project === project);
    }
}
