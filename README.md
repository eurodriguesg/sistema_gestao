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
Este projeto é um sistema de gerenciamento de biblioteca desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Cadastrar novos livros no acervo**.
- **Registrar empréstimos de livros para os usuários**.
- **Consultar a disponibilidade de um livro específico**.

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades
O sistema possui as seguintes funcionalidades:

1. **Cadastrar Livros**  
   Permite adicionar novos livros ao acervo da biblioteca.

2. **Registrar Empréstimos**  
   Marca um livro como indisponível para empréstimos.

3. **Consultar Disponibilidade**  
   Verifica se um livro específico está disponível ou não.

---

### Estrutura do Projeto

### Classe `Livro`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `codigo` (number): Identificador único do livro.
- `titulo` (string): Título do livro.
- `autor` (string): Autor do livro.
- `disponivel` (boolean): Indica se o livro está disponível para empréstimo.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Biblioteca`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`adicionarLivro(livro: Livro): void`**  
  Adiciona um novo livro ao acervo.

- **`registrarEmprestimo(codigo: number): void`**  
  Marca o livro especificado como indisponível.

- **`consultarDisponibilidade(codigo: number): boolean`**  
  Retorna `true` se o livro estiver disponível, ou `false` caso contrário.

### Testando o Sistema
O projeto inclui funções para testar o sistema:

1. **Cadastrar Livros**  
   Três instâncias de `Livro` são criadas e adicionadas ao acervo.

2. **Registrar Empréstimos**  
   Um dos livros cadastrados é emprestado.

3. **Consultar Disponibilidade**  
   Verifica a disponibilidade de um livro pelo código e imprime o resultado no console.

As funções podem ser executadas diretamente no arquivo principal (`index.ts`).

---

## Módulo: Empresa

### Descrição do Projeto
Este projeto é um sistema de gerenciamento de biblioteca desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Cadastrar novos livros no acervo**.
- **Registrar empréstimos de livros para os usuários**.
- **Consultar a disponibilidade de um livro específico**.

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades
O sistema possui as seguintes funcionalidades:

1. **Cadastrar Livros**  
   Permite adicionar novos livros ao acervo da biblioteca.

2. **Registrar Empréstimos**  
   Marca um livro como indisponível para empréstimos.

3. **Consultar Disponibilidade**  
   Verifica se um livro específico está disponível ou não.

---

### Estrutura do Projeto

### Classe `Livro`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `codigo` (number): Identificador único do livro.
- `titulo` (string): Título do livro.
- `autor` (string): Autor do livro.
- `disponivel` (boolean): Indica se o livro está disponível para empréstimo.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Biblioteca`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`adicionarLivro(livro: Livro): void`**  
  Adiciona um novo livro ao acervo.

- **`registrarEmprestimo(codigo: number): void`**  
  Marca o livro especificado como indisponível.

- **`consultarDisponibilidade(codigo: number): boolean`**  
  Retorna `true` se o livro estiver disponível, ou `false` caso contrário.

### Testando o Sistema
O projeto inclui funções para testar o sistema:

1. **Cadastrar Livros**  
   Três instâncias de `Livro` são criadas e adicionadas ao acervo.

2. **Registrar Empréstimos**  
   Um dos livros cadastrados é emprestado.

3. **Consultar Disponibilidade**  
   Verifica a disponibilidade de um livro pelo código e imprime o resultado no console.

As funções podem ser executadas diretamente no arquivo principal (`index.ts`).

---

### Objetivos de Aprendizado
Este projeto foi desenvolvido com os seguintes objetivos:

- Praticar a definição e utilização de classes em TypeScript.
- Implementar e invocar funções para manipular objetos e classes.
- Aplicar conceitos de encapsulamento e tipagem estática.
- Simular um cenário real de gerenciamento de biblioteca.

---

### Contato
Caso tenha dúvidas ou sugestões, entre em contato:

- **Nome:** Eliseu Rodrigues Guimarães
- **Email:** eliseu.rguimaraes@gmail.com
- **GitHub:** eurodriguesg
