import { Request, Response } from "express";
import { TaskManager } from "./../models/TaskManager";

const taskManager = new TaskManager();

export class TaskManagerController {


    // Listar todos os funcionários
    async getAllTasks(req: Request, res: Response) {
        try {
            const tasks = taskManager.getAllTasks();
            console.log(tasks)
            res.status(200).json({ 
                message: 'Tarefas do projeto', 
                tasks: tasks
            });
        } catch (error: any) {
            console.error("[SRV-ENTERPRISE 🔴] Erro ao listar tarefas:", error);
            res.status(500).json({ 
                message: "Erro interno do servidor", 
                function: "getAllTasks", 
                stage: "Erro ao listar tarefas", 
                error: error
            });
        }
    }

  adicionarTarefa(req: Request, res: Response): void {
    const { description, status, project } = req.body;

    if (!description || !status || !project) {
      res.status(400).json({ message: "Todos os campos são obrigatórios." });
      return;
    }

    taskManager.adicionarTarefa(description, status, project);
    res.status(201).json({ message: "Tarefa adicionada com sucesso!" });
  }

  atualizarStatus(req: Request, res: Response): void {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "O status é obrigatório." });
      return;
    }

    taskManager.atualizarStatus(id, status);
    res.status(200).json({ message: "Status atualizado com sucesso!" });
  }

  consultarTarefasPorProjeto(req: Request, res: Response): void {
    const { projeto } = req.params;
    const tarefas = taskManager.consultarTarefasPorProjeto(projeto);
    res.status(200).json(tarefas);
  }
}
