// Função para mostrar o modal de carregamento
function showLoading() {
  document.getElementById('loadingModal').style.display = 'flex'; // Exibe o modal com o spinner
}

// Função para esconder o modal de carregamento
function hideLoading() {
  document.getElementById('loadingModal').style.display = 'none'; // Esconde o modal
}

// Adicionando o evento de clique para o botão "Bibliotecas"
document.getElementById('library').addEventListener('click', function() {
  showLoading(); // Exibe o modal de carregamento
  setTimeout(function() {
    window.location.href = '/library'; // Redireciona após 1 segundo
  }, 500); // Atraso de 1 segundo
});

// Adicionando o evento de clique para o botão "Empresa"
document.getElementById('enterprise').addEventListener('click', function() {
  showLoading();
  setTimeout(function() {
    window.location.href = '/enterprise';
  }, 500);
});

// Adicionando o evento de clique para o botão "Hotel"
document.getElementById('hotel').addEventListener('click', function() {
  showLoading();
  setTimeout(function() {
    window.location.href = '/hotel';
  }, 500);
});

// Adicionando o evento de clique para o botão "Tarefas"
document.getElementById('taskManager').addEventListener('click', function() {
  showLoading();
  setTimeout(function() {
    window.location.href = '/taskManager';
  }, 500);
});
