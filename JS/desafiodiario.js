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

  function verificarConclusaoTotal() {
    const concluidas = conquistasSalvas.filter(c => c.desbloqueado).length;

    if (concluidas >= 3) {

        btnDesafio.disabled = true;
        btnDesafio.classList.add("desafio-concluido");
        btnDesafio.textContent = "Desafios Concluídos ✅";

        msgFinal.style.display = "block";

        document.querySelector(".descricao-desafio").style.display = "none";
        document.querySelector(".recompensa").style.display = "none";
    }
}

  function completarDesafio() {
    const hoje = new Date().toISOString().split("T")[0];

    if (ultimaData === hoje) return;

    const proxima = conquistasSalvas.find(c => !c.desbloqueado);
    if (proxima) proxima.desbloqueado = true;

    ultimaData = hoje;
    localStorage.setItem("ultimaConclusao", ultimaData);
    localStorage.setItem("conquistasDiarias", JSON.stringify(conquistasSalvas));

    soltarConfetes();
    settings.playCelebrationSound();

    renderConquistas();
    desativarBotao();
    verificarConclusaoTotal();
  }

  function desativarBotao() {
    btnDesafio.disabled = true;
    btnDesafio.classList.add("desafio-concluido");
    btnDesafio.textContent = "Desafio Concluído ✅";
  }

  renderConquistas();

  const hoje = new Date().toISOString().split("T")[0];

  if (ultimaData === hoje) {
    desativarBotao();
  }

  verificarConclusaoTotal();
  btnDesafio.addEventListener("click", completarDesafio);
});
