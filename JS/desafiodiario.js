document.addEventListener("DOMContentLoaded", () => {
  const btnDesafio = document.getElementById("btn-desafio");
  const lista = document.getElementById("conquista-lista");
  const msgFinal = document.getElementById("mensagem-final");

  const conquistas = [
    { id: 1, nome: "Iniciante", icone: "🌱", descricao: "Primeiro desafio diário concluído", desbloqueado: false },
    { id: 2, nome: "Aprendiz", icone: "🎯", descricao: "Segundo desafio diário concluído", desbloqueado: false },
    { id: 3, nome: "Explorador", icone: "🚀", descricao: "Terceiro desafio diário concluído", desbloqueado: false },
  ];

  let conquistasSalvas = JSON.parse(localStorage.getItem("conquistasDiarias")) || conquistas;
  let ultimaData = localStorage.getItem("ultimaConclusao");

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

  function completarDesafio() {
    const hoje = new Date().toISOString().split("T")[0];

    if (ultimaData === hoje) {
      renderConquistas();
      atualizarBotao();
      return;
    }

      if (proxima) {
      proxima.desbloqueado = true;
      Soltarconfete();
    }

    const todasConcluidas = conquistasSalvas.every(c => c.desbloqueado);
    if (todasConcluidas) {
      Soltarconfete();
    }

    ultimaData = hoje;
    localStorage.setItem("ultimaConclusao", ultimaData);
    localStorage.setItem("conquistasDiarias", JSON.stringify(conquistasSalvas));

    renderConquistas();
    atualizarBotao();
  }

  renderConquistas();
  atualizarBotao();
  btnDesafio.addEventListener("click", completarDesafio);
});
