import { Task } from "./Task";

export class TaskManager {

    private tasks: Array<Task>;

    constructor() {
        this.tasks = new Array<Task>();
    }

    // Métodoo para listar funcionários
    public getAllTasks() {
        //console.log(`[SRV-ENTERPRISE 🟡] Listando funcionários!`);
        return this.tasks;
    }
    adicionarTarefa(description: string, status: string, project: string): void {
        const tarefa = new Task(description, status, project);
        this.tasks.push(tarefa);
    }

    atualizarStatus(id: string, status: string): void {
        const tarefa = this.tasks.find((t) => t.id === id);
        if (tarefa) {
        tarefa.status = status;
        } else {
        console.error(`Tarefa com ID ${id} não encontrada.`);
        }
    }

    consultarTarefasPorProjeto(project: string): Task[] {
        return this.tasks.filter((t) => t.project === project);
    }
}
