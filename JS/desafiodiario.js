// desafio-diario.js
(function() {
  function iniciarDesafioDiario() {
    const lista = document.getElementById("conquista-lista");
    const msgFinal = document.getElementById("mensagem-final");

    if (!lista || !msgFinal) {
      console.error("Elementos necessários não encontrados!");
      return;
    }

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
      const btn = document.getElementById("btn-desafio");
      if (!btn) return;

      const concluidas = conquistasSalvas.filter(c => c.desbloqueado).length;
      const hoje = new Date().toISOString().split("T")[0];

      if (concluidas === conquistasSalvas.length) {
        btn.disabled = true;
        btn.classList.add("desafio-concluido");
        btn.classList.remove("desafio-hoje");
        btn.textContent = "Todos os desafios foram completos!";
        msgFinal.style.display = "block";
        const desc = document.querySelector(".descricao-desafio");
        const rec = document.querySelector(".recompensa");
        if (desc) desc.style.display = "none";
        if (rec) rec.style.display = "none";
        return;
      }

      if (ultimaData === hoje) {
        btn.disabled = true;
        btn.classList.add("desafio-hoje");
        btn.classList.remove("desafio-concluido");
        btn.textContent = "Desafio do dia concluído!";
        msgFinal.style.display = "none";
        return;
      }

      btn.disabled = false;
      btn.classList.remove("desafio-hoje", "desafio-concluido");
      btn.textContent = "Marcar como Completo";
      msgFinal.style.display = "none";
    }

    function completarDesafio() {
      const hoje = new Date().toISOString().split("T")[0];

      if (ultimaData === hoje) return; // Já completou hoje

      const proxima = conquistasSalvas.find(c => !c.desbloqueado);
      if (proxima) {
        proxima.desbloqueado = true;
        if (typeof Soltarconfete === "function") Soltarconfete();
      }

      const todasConcluidas = conquistasSalvas.every(c => c.desbloqueado);
      if (todasConcluidas && typeof Soltarconfete === "function") Soltarconfete();

      ultimaData = hoje;
      localStorage.setItem("ultimaConclusao", ultimaData);
      localStorage.setItem("conquistasDiarias", JSON.stringify(conquistasSalvas));

      renderConquistas();
      atualizarBotao();
    }

    
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "btn-desafio") {
        completarDesafio();
      }
    });

    document.addEventListener("touchend", (e) => {
      if (e.target && e.target.id === "btn-desafio") {
        completarDesafio();
      }
    });

    renderConquistas();
    atualizarBotao();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarDesafioDiario);
  } else {
    iniciarDesafioDiario();
  }
})();
