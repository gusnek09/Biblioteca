// Dados iniciais ou recuperados do LocalStorage
let livros = JSON.parse(localStorage.getItem('biblioteca_livros')) || [];
let usuarios = JSON.parse(localStorage.getItem('biblioteca_usuarios')) || [];
let emprestimos = JSON.parse(localStorage.getItem('biblioteca_emprestimos')) || [];

// Alternar abas sem recarregar a página
function navegarPara(nomePagina) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const paginaAlvo = document.getElementById(`page-${nomePagina}`);
    const btnAlvo = document.querySelector(`.nav-btn[data-page="${nomePagina}"]`);

    if (paginaAlvo && btnAlvo) {
        paginaAlvo.classList.add('active');
        btnAlvo.classList.add('active');
    }

    window.location.hash = nomePagina;

    if (nomePagina === 'emprestimos') {
        atualizarSelectsEmprestimo();
    }
}

function salvarDados() {
    localStorage.setItem('biblioteca_livros', JSON.stringify(livros));
    localStorage.setItem('biblioteca_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('biblioteca_emprestimos', JSON.stringify(emprestimos));
}

// 1. GERENCIAMENTO DE LIVROS
document.getElementById('form-livro').addEventListener('submit', function (e) {
    e.preventDefault();

    const novoLivro = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        categoria: document.getElementById('categoria').value.trim(),
        ano: document.getElementById('ano').value.trim()
    };

    livros.push(novoLivro);
    salvarDados();
    renderizarLivros();
    atualizarSelectsEmprestimo();
    this.reset();
});

function renderizarLivros(listaParaExibir = livros) {
    const container = document.getElementById('lista-livros');
    container.innerHTML = '';

    if (listaParaExibir.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhum livro encontrado.</p>';
        return;
    }

    listaParaExibir.forEach(livro => {
        const card = document.createElement('div');
        card.className = 'card card-livro';
        card.innerHTML = `
            <div class="card-info">
                <h4>📖 ${livro.titulo}</h4>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Gênero:</strong> ${livro.categoria}</p>
                <p><strong>Ano:</strong> ${livro.ano}</p>
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="removerLivro(${livro.id})">Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função de Filtro / Busca Dinâmica
function filtrarLivros() {
    const termo = document.getElementById('busca-livros').value.toLowerCase().trim();
    const campo = document.getElementById('filtro-campo').value;

    if (!termo) {
        renderizarLivros(livros);
        return;
    }

    const livrosFiltrados = livros.filter(livro => {
        if (campo === 'todos') {
            return livro.titulo.toLowerCase().includes(termo) ||
                   livro.autor.toLowerCase().includes(termo) ||
                   livro.categoria.toLowerCase().includes(termo) ||
                   livro.ano.toString().includes(termo);
        } else if (campo === 'ano') {
            return livro.ano.toString().includes(termo);
        } else {
            return livro[campo] && livro[campo].toLowerCase().includes(termo);
        }
    });

    renderizarLivros(livrosFiltrados);
}

function removerLivro(id) {
    livros = livros.filter(l => l.id !== id);
    salvarDados();
    filtrarLivros(); // Mantém o filtro ativo após excluir
    atualizarSelectsEmprestimo();
}

// 2. GERENCIAMENTO DE USUÁRIOS
document.getElementById('form-usuario').addEventListener('submit', function (e) {
    e.preventDefault();

    const novoUsuario = {
        id: Date.now(),
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.trim()
    };

    usuarios.push(novoUsuario);
    salvarDados();
    renderizarUsuarios();
    atualizarSelectsEmprestimo();
    this.reset();
});

function renderizarUsuarios() {
    const container = document.getElementById('lista-usuarios');
    container.innerHTML = '';

    if (usuarios.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhum usuário cadastrado.</p>';
        return;
    }

    usuarios.forEach(usuario => {
        const card = document.createElement('div');
        card.className = 'card card-usuario';
        card.innerHTML = `
            <div class="card-info">
                <h4>👤 ${usuario.nome}</h4>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Telefone:</strong> ${usuario.telefone}</p>
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="removerUsuario(${usuario.id})">Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function removerUsuario(id) {
    usuarios = usuarios.filter(u => u.id !== id);
    salvarDados();
    renderizarUsuarios();
    atualizarSelectsEmprestimo();
}

// 3. GERENCIAMENTO DE EMPRÉSTIMOS
function atualizarSelectsEmprestimo() {
    const selectUsuario = document.getElementById('select-usuario');
    const selectLivro = document.getElementById('select-livro');

    if (!selectUsuario || !selectLivro) return;

    selectUsuario.innerHTML = '<option value="">-- Selecione o Usuário --</option>';
    selectLivro.innerHTML = '<option value="">-- Selecione o Livro --</option>';

    usuarios.forEach(u => {
        const option = document.createElement('option');
        option.value = u.nome;
        option.textContent = u.nome;
        selectUsuario.appendChild(option);
    });

    livros.forEach(l => {
        const option = document.createElement('option');
        option.value = l.titulo;
        option.textContent = l.titulo;
        selectLivro.appendChild(option);
    });
}

document.getElementById('form-emprestimo').addEventListener('submit', function (e) {
    e.preventDefault();

    const novoEmprestimo = {
        id: Date.now(),
        usuario: document.getElementById('select-usuario').value,
        livro: document.getElementById('select-livro').value,
        dataDevolucao: document.getElementById('data-devolucao').value
    };

    emprestimos.push(novoEmprestimo);
    salvarDados();
    renderizarEmprestimos();
    this.reset();
});

function renderizarEmprestimos() {
    const container = document.getElementById('lista-emprestimos');
    container.innerHTML = '';

    if (emprestimos.length === 0) {
        container.innerHTML = '<p class="empty-msg">Nenhum empréstimo registrado.</p>';
        return;
    }

    emprestimos.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'card card-emprestimo';

        let dataFormatada = emp.dataDevolucao;
        if (emp.dataDevolucao) {
            const partes = emp.dataDevolucao.split('-');
            if (partes.length === 3) {
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }
        }

        card.innerHTML = `
            <div class="card-info">
                <h4>📘 ${emp.livro}</h4>
                <p><strong>Usuário:</strong> ${emp.usuario}</p>
                <p><strong>Devolução prevista:</strong> ${dataFormatada}</p>
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="removerEmprestimo(${emp.id})">Concluir / Devolver</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function removerEmprestimo(id) {
    emprestimos = emprestimos.filter(e => e.id !== id);
    salvarDados();
    renderizarEmprestimos();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarLivros();
    renderizarUsuarios();
    renderizarEmprestimos();
    atualizarSelectsEmprestimo();

    const paginaInicial = window.location.hash.replace('#', '') || 'livros';
    navegarPara(paginaInicial);
});

window.addEventListener('hashchange', () => {
    const paginaAtual = window.location.hash.replace('#', '') || 'livros';
    navegarPara(paginaAtual);
});