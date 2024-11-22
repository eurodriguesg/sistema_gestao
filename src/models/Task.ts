export class Task {

    id: string;          // Identificador único de 5 caracteres
    description: string; // Descrição da tarefa
    status: string;      // status atual da tarefa (e.g., "Pendente", "Em Andamento", "Concluída")
    project: string;     // Nome do projeto ao qual a tarefa pertence.

    constructor(description: string, status: string, project: string) {
        this.id = generateUniqueId(); // Gera um ID alfanumérico curto
        this.description = description;
        this.status = status;
        this.project = project;
    }
}

// Função para gerar um ID alfanumérico de 5 caracteres
function generateUniqueId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Conjunto de caracteres
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}
    

