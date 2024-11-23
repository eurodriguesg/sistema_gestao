# Sistema de Gestão

### Requisitos Técnicos
- Desenvolvido em TypeScript.
- Utiliza conceitos de classes, encapsulamento e tipagem estática.
- Inclui tratamento de erros, como consultas e valores inexistentes.


## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado em sua máquina.
- TypeScript configurado (instale com `npm install -g typescript`).

### Passo a Passo

1. Clone este repositório:
   ```bash
   git clone https://github.com/eurodriguesg/sistema_gestao.git
   cd sistema_gestao
    ```

2. Instale as dependências:
    ```bash
   npm install
    ```

3. Compile o código TypeScript:
    ```bash
   tsc
    ```

3. Execute o programa:
    ```bash
   npm run dev ou npm start
    ```

---

## Módulo: Biblioteca

### Descrição do Projeto
Este módulo é um sistema de gerenciamento de biblioteca desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Cadastrar novos livros no acervo**.
- **Registrar empréstimos de livros para os usuários**.
- **Registrar devolução de livros para os usuários**.
- **Consultar a disponibilidade de um livro específico**.

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades
O sistema possui as seguintes funcionalidades:

1. **Cadastrar Livros**  
   Permite adicionar novos livros ao acervo da biblioteca.

2. **Registrar Empréstimos**  
   Marca um livro como indisponível para empréstimos.

3. **Registrar Empréstimos**  
   Marca um livro como disponível para empréstimos.

4. **Consultar Disponibilidade**  
   Verifica se um livro específico está disponível ou não.

---

### Estrutura do Projeto

### Classe `Livro`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `code` (number): Identificador único do livro.
- `title` (string): Título do livro.
- `author` (string): Autor do livro.
- `available` (boolean): Indica se o livro está disponível para empréstimo.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Biblioteca`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`getAllBooks(): Array<Book>`**  
  Consulta todos os livros do acervo.

- **`addBook(book: Book): boolean`**  
  Adiciona um novo livro ao acervo.
  
- **`addBooks(books: Book[]): { added: number; duplicates: number }`**  
  Adicionar múltiplos livros ao acervo.

- **`registerLoan(code: number): string`**
  Marca o livro especificado como indisponível.

- **`registerReturn(code: number): string`**
  Marca o livro especificado como disponível.

- **`checkAvailability(code: number): boolean {`**  
  Retorna `true` se o livro estiver disponível, ou `false` caso contrário.
  
- **`listAvailableBooks(): Array<Book> {`**  
  Retorna todos os livros disponíveis.
  
- **`searchBook(): void {`**  
  Busca um livro e retorna o livro se ele existir.

---

### Testando o Sistema
O projeto inclui funções para testar o sistema:

### **Rotas**

##### **1. Listar acervo**
- **URL:** `/api/library/getAllBooks`  
- **Método:** `GET`  
- **Resposta de sucesso (201):**  
  ```json
  {
   "message": "Livros do Acervo:",
   "allBooks": [
      {
         "code": 1001,
         "title": "O Príncipe",
         "author": "NICOLAU MAQUIAVEL",
         "available": true
      }
   ]
   }

##### **2. Listar livros disponíveis**
- **URL:** `/api/library/listAvailableBooks`  
- **Método:** `GET`  
- **Resposta de sucesso (200):**  
  ```json
  {
   "message": "Livro(s) encontrado(s).",
   "books": [
      {
         "code": 1001,
         "title": "O Príncipe",
         "author": "NICOLAU MAQUIAVEL",
         "available": true
      }
   ]
   }

##### **3. Adicionar livro(s)**
- **URL:** `/api/library/addBooks`  
- **Método:** `POST`  
- **Headers:**  
  ```
  Content-Type: application/json
  ```
- **Body:**  
  ```json
  {
      "code": "1001",
      "title": "O Príncipe",
      "author": "NICOLAU MAQUIAVEL"
  }
  ```
- **Resposta de sucesso (201):**  
  ```json
  {
      "message": "Livro adicionado com sucesso",
      "book": "1001 - O Príncipe (NICOLAU MAQUIAVEL)"
  }
  ```
- **Resposta de conflito (409):**  
  ```json
  {
      "message": "Livro já existe",
      "book": "1001 - O Príncipe (NICOLAU MAQUIAVEL)"
  }
- **Resposta de erro (400):**  
  ```json
   {
      "message": "Todos os campos obrigatórios devem ser preenchidos: code, title, author"
   }

##### **4. Empréstimo de livro**
- **URL:** `/api/library/bookLoan/:code`  
- **Método:** `POST`  
- **Headers:**  
 
  ```
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Empréstimo registrado",
      "code": 1001
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **5. Devolução de livro**
- **URL:** `/api/library/bookReturn/:code`  
- **Método:** `POST`  
- **Headers:**  
 
  ```
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Devolução registrada",
      "code": 1001
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **6. Consultar Disponibilidade de livro**
- **URL:** `/api/library/checkAvailability/:code`  
- **Método:** `POST`  
- **Headers:**  
 
  ```
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Livro disponível",
      "code": 1001
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **7. Buscar livro**
- **URL:** `/api/library/searchBook/1001`  
- **Método:** `POST`  
- **Headers:**  
 
  ```
- **Resposta de sucesso (200):**  
  ```json
   {
   "message": "Livro encontrado.",
   "book": {
      "code": 1001,
      "title": "O Príncipe",
      "author": "NICOLAU MAQUIAVEL",
      "available": true
   }
   }
  ```
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

A API pode ser consumida via POSTMAN ou similares.

---

## Módulo: Empresa

### Descrição do Projeto
Este módulo é um sistema de gerenciamento de funcionários desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Cadastrar Funcionários na Empresa**.
- **Alterar salário do Funcionário**.
- **Consultar um funcionário específico**.

O projeto simula um cenário real de gerenciamento de funcionários, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades
O sistema possui as seguintes funcionalidades:

1. **Cadastrar Funcionários**  
   Permite adicionar novos funcionários a Empresa.

2. **Alterar Salário do Funcionário**  
   Alterar o salário de um funcionário.

3. **Consultar Disponibilidade**  
   Verificar um funcionário específico.

---

### Classe `Funcionario`
Representa um Funcionário no acervo da Empresa. Possui as seguintes propriedades:

- `matricula` (number): Identificador único do funcionário.
- `nome` (string): Nome do funcionário.
- `cargo` (string): Cargo do funcionário.
- `salario` (number): Salário do funcionário.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Empresa`
Gerencia os Funcionários da Empresa e oferece os seguintes métodos:

- **`adicionarFuncionario(funcionario: Funcionario): void`**  
  Adiciona um novo funcionário à empresa.

- **`atualizarSalario(matricula: number, salario: number): void`**  
  Atualiza o salário do funcionário com a matrícula
especificada.

- **`consultarFuncionario(matricula: number): Funcionario | undefined`**  
  Atualiza o salário do funcionário com a matrícula especificada.

### Testando o Sistema
O projeto inclui funções para testar o sistema:

1. **Cadastrar Funcionário**  
   É possível criar quantas instâncias de `Funcionário` desejar adicionar a empresa.

2. **Alterar Salário**  
   É possível atualizar o salário de duas formas, selecionando um funcionário na listagem, por veio da ação `ver`ou por meio da consulta de um determinado Funcionário.

3. **Consultar Funcionário**  
   Verifica um Funcionário pela matricula e apresenta o resultado no modal.

As funções podem ser executadas diretamente na instância do servidor local que será criado (`http://127.0.0.1:31063`) ou demais interfaces de rede local.

---

### Objetivos de Aprendizado
Este projeto foi desenvolvido com os seguintes objetivos:

- Praticar a definição e utilização de classes em TypeScript.
- Implementar e invocar funções para manipular objetos e classes.
- Aplicar conceitos de encapsulamento e tipagem estática.
- Simular um cenário real de gerenciamento de biblioteca.

---

### Classe `Reserva`
Representa uma Reserva no Hotel. Possui as seguintes propriedades:

- `numeroQuarto` (number): número do quarto.
- `nomeHospede` (string): nome do hóspede.
- `dataEntrada` (Date): data de entrada.
- `dataSaida` (Date): data de saída.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Hotel`
Gerencia os Funcionários da Hotel e oferece os seguintes métodos:

- **`registrarReserva(reserva: Reserva): void`**  
  Adiciona uma nova reserva à Hotel.

- **`cancelarReserva(numeroQuarto: numeroQuarto): void`**  
  Remove a reserva do quarto especificado.
- **`consultarStatusQuarto(numeroQuarto: number): Reserva | undefined`**  
  Retorna "Reservado" ou "Disponível" para o quarto especificado.


### **Erros Comuns**
- **400 Bad Request:** Dados inválidos na requisição.  
- **404 Not Found:** Recurso não encontrado.  
- **409 Conflict:** Recurso não disponível.  
- **500 Internal Server Error:** Erro interno da aplicação.  

### Contato
Caso tenha dúvidas ou sugestões, entre em contato:

- **Nome:** Eliseu Rodrigues Guimarães
- **Email:** eliseu.rguimaraes@gmail.com
- **GitHub:** https://github.com/eurodriguesg
