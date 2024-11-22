import { Router } from "express";
import { TaskManagerController } from "./../controller/TaskManager.controller";

const router = Router();
const taskManagerController = new TaskManagerController();

// Rota para listar funcionários
router.get('/getAllTasks', taskManagerController.getAllTasks);
router.post("/tasks", (req, res) => taskManagerController.adicionarTarefa(req, res));
router.put("/tasks/:id/status", (req, res) => taskManagerController.atualizarStatus(req, res));
router.get("/tasks/project/:projeto", (req, res) => taskManagerController.consultarTarefasPorProjeto(req, res));

export default router;
