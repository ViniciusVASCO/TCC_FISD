document.addEventListener("DOMContentLoaded", () => {
  const btnDesafio = document.getElementById("btn-desafio");
  const lista = document.getElementById("conquista-lista");
  const msgFinal = document.getElementById("mensagem-final");

  // Definição das conquistas
  const conquistas = [
    { id: 1, nome: "Iniciante", icone: "🌱", descricao: "Primeiro desafio diário concluído", desbloqueado: false },
    { id: 2, nome: "Aprendiz", icone: "🎯", descricao: "Segundo desafio diário concluído", desbloqueado: false },
    { id: 3, nome: "Explorador", icone: "🚀", descricao: "Terceiro desafio diário concluído", desbloqueado: false },
  ];

  // Recupera conquistas e data da última conclusão do localStorage
  let conquistasSalvas = JSON.parse(localStorage.getItem("conquistasDiarias")) || conquistas;
  let ultimaData = localStorage.getItem("ultimaConclusao");

  // Função para renderizar conquistas na tela
  function renderConquistas() {
    lista.innerHTML = "";
    conquistasSalvas.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("conquista");
      if (!c.desbloqueado) div.classList.add("bloqueado");
      div.innerHTML = `
        <div class="icone">${c.desbloqueado ? c.icone : "🔒"}</div>
        <p class="nome">${c.desbloqueado ? c.nome : "Bloqueado"}</p>
      `;
      lista.appendChild(div);
    });
  }

  // Função para atualizar o estado do botão
  function atualizarBotao() {
    const concluidas = conquistasSalvas.filter(c => c.desbloqueado).length;
    const hoje = new Date().toISOString().split("T")[0];

    if (concluidas === conquistasSalvas.length) {
      btnDesafio.disabled = true;
      btnDesafio.classList.add("desafio-concluido");
      btnDesafio.classList.remove("desafio-hoje");
      btnDesafio.textContent = "Todos os desafios foram completos!";
      msgFinal.style.display = "block";
      document.querySelector(".descricao-desafio").style.display = "none";
      document.querySelector(".recompensa").style.display = "none";
      return;
    }

    if (ultimaData === hoje) {
      btnDesafio.disabled = true;
      btnDesafio.classList.add("desafio-hoje");
      btnDesafio.classList.remove("desafio-concluido");
      btnDesafio.textContent = "Desafio do dia concluído!";
      msgFinal.style.display = "none";
      return;
    }

    btnDesafio.disabled = false;
    btnDesafio.classList.remove("desafio-hoje", "desafio-concluido");
    btnDesafio.textContent = "Completar Desafio";
    msgFinal.style.display = "none";
  }

  // Função que marca a conquista do dia
  function completarDesafio() {
    const hoje = new Date().toISOString().split("T")[0];

    if (ultimaData === hoje) {
      renderConquistas();
      atualizarBotao();
      return;
    }

    // Pega a primeira conquista ainda bloqueada
    const proxima = conquistasSalvas.find(c => !c.desbloqueado);

    if (proxima) {
      proxima.desbloqueado = true;
      Soltarconfete(); // chama animação de confete
    }

    // Checa se todas as conquistas foram concluídas
    const todasConcluidas = conquistasSalvas.every(c => c.desbloqueado);
    if (todasConcluidas) {
      Soltarconfete();
    }

    // Salva a data e o estado das conquistas
    ultimaData = hoje;
    localStorage.setItem("ultimaConclusao", ultimaData);
    localStorage.setItem("conquistasDiarias", JSON.stringify(conquistasSalvas));

    renderConquistas();
    atualizarBotao();
  }

  // Inicialização da tela
  renderConquistas();
  atualizarBotao();
  btnDesafio.addEventListener("click", completarDesafio);
});
