// Consultar Funcionário
document.getElementById('getAllEmployeesForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const registration = document.getElementById('employeeSearch').value; // Pega o valor inserido no campo de busca
    if (!registration) {
        alert('Por favor, insira a Matrícula do funcionário.');
        return;
    }

    // Chama a função para buscar os dados do funcionário
    fetchEmployeeData(registration);
});

// Carrega os funcionários ao abrir a página
document.addEventListener('DOMContentLoaded', loadEmployees);

// Adicionar funcionário e recarregar tabela
/*document.getElementById('addEmployeeForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    submitButton.disabled = true;

    try {
        const response = await fetch('/api/enterprise/addEmployee', {
            method: 'POST', // Definindo o método HTTP no fetch
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        
        alert('Funcionário adicionado com sucesso!');
        console.log(data);

        form.reset();
        document.getElementById('employeePhoto').src = '/images/default-avatar.png';
        loadEmployees(); // Atualiza a tabela após adicionar
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
        alert('Funcionário já existe!');
    } finally {
        submitButton.disabled = false;
    }
});*/

// ARMAZENAAMENTO BUFFER: Adicionar funcionário e salvar imagem no localStorage
document.getElementById('addEmployeeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = this;
    const registration = document.getElementById('registration').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const salary = document.getElementById('salary').value;
    const photoInput = document.getElementById('photoUpload');

    // Salva imagem no localStorage, se fornecida
    if (photoInput.files.length > 0) {
        savePhotoToLocalStorage(registration, photoInput.files[0]);
    }

    // Adiciona funcionário à API
    const employeeData = { registration, name, role, salary };
    try {
        const response = await fetch('/api/enterprise/addEmployee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            alert('Funcionário adicionado com sucesso!');
            form.reset();
            document.getElementById('employeePhoto').src = '/images/default-avatar.png';
            loadEmployees(); // Atualiza a tabela
        } else {
            alert('Erro ao adicionar funcionário.');
        }
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
    }
});

// Função para preview da imagem antes do upload
function previewPhoto() {
    const photoInput = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('employeePhoto');
    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            photoPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Função para buscar os dados do funcionário e exibir o modal
function fetchEmployeeData(registration) {
    fetch(`/api/enterprise/${registration}`)
        .then(response => response.json())
        .then(data => {
            if (data.employee) {
                // Busca a foto no localStorage
                const base64Image = localStorage.getItem(`employeePhoto_${registration}`) || '/images/default-avatar.png';

                // Preenche o modal com os dados do funcionário
                document.getElementById('modalPhoto').src = base64Image;
                document.getElementById('modalRegistration').textContent = data.employee.registration;
                document.getElementById('modalName').textContent = data.employee.name;
                document.getElementById('modalRole').textContent = data.employee.role;
                document.getElementById('modalSalary').textContent = `R$ ${data.employee.salary}`;

                // Exibe o modal
                document.getElementById('employeeModal').style.display = 'flex';
            } else {
                alert('Funcionário não encontrado!');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar funcionário:', error);
            alert('Erro ao buscar funcionário!');
        });
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

// ARMAZENAAMENTO BUFFER: Função para salvar imagem em localStorage como Base64
function savePhotoToLocalStorage(registration, file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        localStorage.setItem(`employeePhoto_${registration}`, base64Image); // Salva com a matrícula como chave
    };
    reader.readAsDataURL(file);
}

// Função para carregar funcionários na tabela
/*function loadEmployees() {
    fetch('/api/enterprise/getAllEmployees')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#employeeTable tbody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            data.employees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.registration}</td>
                    <td>${employee.name}</td>
                    <td>${employee.role}</td>
                    <td>R$ ${employee.salary}</td>
                    <td>
                        <button class="button" onclick="fetchEmployeeData(${employee.registration})">Ver</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar funcionários:', error));
}*/

// ARMAZENAAMENTO BUFFER: Função para carregar funcionários na tabela
function loadEmployees() {
    fetch('/api/enterprise/getAllEmployees')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#employeeTable tbody');
            tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

            data.employees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.registration}</td>
                    <td>${employee.name}</td>
                    <td>${employee.role}</td>
                    <td>R$ ${employee.salary}</td>
                    <td>
                        <button class="button" onclick="fetchEmployeeData(${employee.registration})">Ver</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar funcionários:', error));
}

// ARMAZENAAMENTO BUFFER: Função para comprimir e armazenar a imagem
function compressAndStoreImage(file, registration) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const maxWidth = 800; // Defina uma largura máxima para a imagem
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Comprime a imagem para base64 (qualidade ajustável)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Qualidade 70%
            
            // Armazena no LocalStorage
            try {
                localStorage.setItem(`employeePhoto_${registration}`, compressedBase64);
                console.log('Imagem comprimida e armazenada com sucesso.');
            } catch (e) {
                console.error('Erro ao salvar imagem no LocalStorage:', e);
                alert('Falha ao salvar imagem: espaço insuficiente no armazenamento.');
            }
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// ARMAZENAAMENTO BUFFER: Evento de mudança no input de upload de foto
const photoInput = document.getElementById('photoUpload');

photoInput.addEventListener('change', function () {
    const file = this.files[0];
    const registration = document.getElementById('registration').value;

    if (!file) return; // Evita erros se nenhum arquivo for selecionado

    // Validação de matrícula
    if (!registration) {
        alert('Por favor, insira a matrícula antes de enviar a foto.');
        this.value = ''; // Limpa o campo de arquivo
        return;
    }

    // Validação de tamanho do arquivo
    if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        alert('Por favor, envie uma imagem menor que 2MB.');
        this.value = ''; // Limpa o campo de arquivo
        document.getElementById('employeePhoto').src = '/images/default-avatar.png'; // Restaura o avatar padrão
    } else {
        // Comprime e armazena a imagem no LocalStorage
        compressAndStoreImage(file, registration);

        // Exibe o preview da imagem
        previewPhoto(); // Chama a função de preview somente se passar a validação
    }
});


// Função para atualizar salário
function updateSalary() {
    const registration = document.getElementById('modalRegistration').textContent;
    const newSalary = document.getElementById('newSalary').value;

    if (!newSalary) {
        alert('Por favor, insira um novo salário.');
        return;
    }

    fetch('/api/enterprise/changeSalary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration, salary: newSalary })
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                alert(body.message);

                // Atualizar o salário no modal imediatamente
                document.getElementById('modalSalary').textContent = `R$ ${newSalary}`;

                // Atualizar o salário na tabela imediatamente
                updateTableSalary(registration, newSalary);

                // Limpar o campo do novo salário
                document.getElementById('newSalary').value = '';

                // Fechar o modal após atualizar
                closeModal();
            } else {
                alert(body.message || 'Erro ao atualizar o salário!');
            }
        })
        .catch(error => console.error('Erro ao atualizar salário:', error));
}

// Função para atualizar o salário na tabela
function updateTableSalary(registration, newSalary) {
    const tableRows = document.querySelectorAll('#employeeTable tbody tr');
    tableRows.forEach(row => {
        const regCell = row.cells[0].textContent; // Pega o código da primeira coluna
        if (regCell === registration) {
            row.cells[3].textContent = `R$ ${newSalary}`; // Atualiza o salário na tabela
        }
    });
}