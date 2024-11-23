import { Request, Response } from "express";
import { TaskManager } from "./../models/TaskManager";

const taskManager = new TaskManager();

export class TaskManagerController {


    // Listar todos os funcionários
    async getAllTasks(req: Request, res: Response) {
        try {
          const tasks = taskManager.getAllTasks();

          if (tasks) {
              res.status(200).json({ message: 'Tarefas do projeto:', tasks: tasks});
          } else {
              res.status(409).json({ message: 'Sem tarefas no momento' });
          }

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

    addTask(req: Request, res: Response): void {
    const { description, status, project } = req.body;

    if (!description || !status || !project) {
      res.status(400).json({
        message: 'Todos os campos obrigatórios devem ser preenchidos: description, status, project',
    });
      return;
    }

    taskManager.addTask(description, status, project);
    res.status(200).json({ message: "Tarefa adicionada com sucesso!",task: taskManager});
  }

  updateStatus(req: Request, res: Response): void {
    const { id } = req.params;
    const { status } = req.body;
    // console.log(`[SRV-TASKMANAGER 🟡] Atualizando status da tarefa: `,id,status);
        

    if (!status) {
      res.status(400).json({ message: "O status é obrigatório." });
      return;
    }

   const result = taskManager.updateStatus(id, status);
    
    if(result) {
      res.status(200).json({ message: "Tarefa atualizada com sucesso" });
    }
    else {
      
      res.status(404).json({ message: "Tarefa não encontrada" });
    }
  }

  consultTasksByProject(req: Request, res: Response): void {
    const { project } = req.body;
  
    if (!project) {
      res.status(400).json({
        message: 'Todos os campos obrigatórios devem ser preenchidos: project',
      });
      return;
    }
  
    const result = taskManager.consultTasksByProject(project);
    // console.log(`[SRV-TASKMANAGER 🟡] Tarefas do projeto`, result);
  
    if (result && result.length > 0) {
      res.status(200).json({ message: "Projeto encontrado", tasks: result });
      return;
    }
  
    // Caso o projeto não tenha tarefas ou não seja encontrado
    res.status(404).json({ message: "Projeto não encontrado ou sem tarefas" });
  }
  
}
