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

- **Consulta todos os livros do acervo**.
- **Retorna todos os livros disponíveis.**.
- **Adicionar novo(s) livro(s) ao acervo**.
- **Registrar empréstimos de livros para os usuários**.
- **Registrar devolução de livros para os usuários**.
- **Consultar a disponibilidade de um livro específico**.

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades Principais
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

### Classe `Book`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `code` (number): Identificador único do livro.
- `title` (string): Título do livro.
- `author` (string): Autor do livro.
- `available` (boolean): Indica se o livro está disponível para empréstimo.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Library`
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
O projeto inclui uma API para testar o sistema:

### **Rotas**

##### **1. Listar acervo**
- **URL:** `/api/library/getAllBooks`  
- **Método:** `GET`  
- **Resposta de sucesso (200):**  
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
- **Resposta de sucesso (200):**  
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
- **URL:** `/api/library/searchBook/:code`  
- **Método:** `POST`  

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
Este módulo é um sistema de gerenciamento de funcionários desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma Empresa:

- **Consulta todos os funcionários da empresa**.
- **Adicionar novo(s) funcionários(s) à empresa**.
- **Alterar salário do funcionário**.
- **Consultar a funcionário por matrícula**.

O projeto simula um cenário real de gerenciamento de funcionários, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades Principais
O sistema possui as seguintes funcionalidades:

1. **Consulta todos os funcionários da empresa**  
   Lista todos os funcionários da empresa.

2. **Adicionar novo(s) funcionários(s) à empresa**  
   Permite adicionar novos funcionários a Empresa.

3. **Alterar Salário do Funcionário**  
   Alterar o salário de um funcionário.

4. **Consultar a funcionário por matrícula**  
   Verificar um funcionário específico.

---

### Estrutura do Projeto

### Classe `Employee`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `registration` (number): Identificador único do funcionário.
- `name` (string): Nome do funcionário.
- `role` (string): Cargo do funcionário.
- `salary` (number): Salário do funcionário.
- `photoPath` (string): Foto do funcionário

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Biblioteca`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`getAllEmployees()`**  
  Consulta todos os funcionários da empresa.

- **`addEmployee(employee: Employee): boolean`**  
  Adiciona um novo funcionário à empresa.
  
- **`addEmployees(employees: Employee[]): { added: number; duplicates: number }`**  
  Adicionar múltiplos funcionários à empresa.

- **`updateSalary(registration: number, salary: number): string`**
  Alterar o salário de um funcionário especificado.
  
- **`findEmployeeByRegistration(registration: number): Employee | null {`**  
  Busca um funcionário e retorna o funcionário se ele existir.

---

### Testando o Sistema
O projeto inclui uma API para testar o sistema:

### **Rotas**

##### **1. Listar funcionários da empresa**
- **URL:** `/api/enterprise/getAllEmployees`  
- **Método:** `GET`  
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Funcionários da Empresa",
      "employees": [
         {
            "registration": 1001,
            "name": "ELISEU RODRIGUES GUIMARAES",
            "role": "DESENVOLVEDOR",
            "salary": 2000,
            "photoPath": ""
         }
      ]
   }

##### **2. Adicionar funcionário(s)**
- **URL:** `/api/enterprise/addEmployee`  
- **Método:** `POST`  
- **Headers:**  
  ```
  Content-Type: application/json
  ```
- **Body:**  
  ```json
  {
      "registration": "1001",
      "name": "ELISEU RODRIGUES GUIMARAES",
      "role": "DESENVOLVEDOR",
      "salary": "2000"
   }
  ```
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Funcionário adicionado com sucesso",
      "employee": "1001 - ELISEU RODRIGUES GUIMARAES (DESENVOLVEDOR)"
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
   "message": "Funcionário já existe",
   "employee": "1001 - ELISEU RODRIGUES GUIMARAES (DESENVOLVEDOR)"
   }
- **Resposta de erro (400):**  
  ```json
   {
      "message": "Todos os campos obrigatórios devem ser preenchidos",
      "fields": "registration, name, role e salary"
   }

##### **3. Alterar salário**
- **URL:** `/api/enterprise/changeSalary`  
- **Método:** `POST`  
- **Headers:**  
  ```
  Content-Type: application/json
  ```
- **Body:**  
  ```json
   {
      "registration": "1001",
      "salary": "3100"
   }
- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Salário alterado com sucesso para R$ 3100",
      "registration": "1001",
      "salary": "3100"
   }
  ```
- **Resposta de BadRequest (400):**  
  ```json
   {
      "message": "Todos os campos obrigatórios devem ser preenchidos",
      "fields": "registration e salary"
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Funcionário não encontrado",
      "registration": "100"
   }

##### **4. Buscar funcionário**
- **URL:** `/api/enterprise/:registration`  
- **Método:** `GET`  

- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Funcionário encontrado",
      "employee": {
         "registration": 1001,
         "name": "ELISEU RODRIGUES GUIMARAES",
         "role": "DESENVOLVEDOR",
         "salary": 3100,
         "photoPath": ""
      }
   }
- **Resposta de erro (404):**  
  ```json
   {
   "message": "Funcionário não encontrado",
   "registration": 1020
   }

A API pode ser consumida via POSTMAN ou similares.

---
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
