import { Router } from "express";
import { TaskManagerController } from "./../controller/TaskManager.controller";

const router = Router();
const taskManagerController = new TaskManagerController();

// Rota para listar funcionários
router.get('/getAllTasks', taskManagerController.getAllTasks);
router.post("/addTask", (req, res) => taskManagerController.addTask(req, res));
router.put("/status/:id", (req, res) => taskManagerController.updateStatus(req, res));
router.post("/consultTasksByProject", (req, res) => taskManagerController.consultTasksByProject(req, res));

export default router;
