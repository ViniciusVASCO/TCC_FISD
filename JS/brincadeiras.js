document.addEventListener("DOMContentLoaded", () => {
    const gameCards = document.querySelectorAll(".game-card");
    const gamesSelection = document.getElementById("games-selection");
    const gameContainer = document.getElementById("game-container");
    const gameContent = document.getElementById("game-content");
    const gameTitle = document.getElementById("game-title");
    const backButton = document.getElementById("back-to-games");
    const restartButton = document.getElementById("restart-game");
    const scoreDisplay = document.getElementById("score-display");

    let currentGame = "";
    let pontuacao = 0;
    let rodadaForca = 0;

    function atualizarScore(valor = 0, reset = false) {
        if (reset) pontuacao = 0;
        else pontuacao += valor;
        if (scoreDisplay) scoreDisplay.textContent = `Pontuação: ${pontuacao}`;
    }

    function startGame(game) {
        atualizarScore(0, true);
        rodadaForca = 0;
        gameContent.innerHTML = "";

        if (game === "forca") iniciarForca();
        else if (game === "caça-palavras") iniciarCacaPalavras();
        else if (game === "memory-laws") {
            // cria o grid da memória dinamicamente
            gameContent.innerHTML = `
                <div id="memoria-grid" class="memory-grid"></div>
                <p id="resultado" style="text-align:center;color:white;font-weight:bold;margin-top:10px;"></p>
            `;
            iniciarMemoria();
        }
    }

    gameCards.forEach(card => {
        const btn = card.querySelector("button");
        btn.addEventListener("click", () => {
            currentGame = card.dataset.game;
            gameTitle.textContent = card.querySelector("h3").textContent;
            startGame(currentGame);
            gamesSelection.classList.add("hidden");
            gameContainer.classList.remove("hidden");
        });
    });

    backButton.addEventListener("click", () => {
        gameContainer.classList.add("hidden");
        gamesSelection.classList.remove("hidden");
        gameContent.innerHTML = "";
    });

    restartButton.addEventListener("click", () => {
        startGame(currentGame);
    });

    // =======================
    // 🎯 JOGO DA FORCA
    // =======================
    const perguntasForca = [
        { pergunta: "Qual a 1ª Lei de Newton?", resposta: "INERCIA" },
        { pergunta: "Qual lei de Newton que explica o movimento de foguetes?", resposta: "TERCEIRALEI" },
        { pergunta: "Sobre a terceira lei de Newton as forças atuam em corpos iguais ou diferentes?", resposta: "DIFERENTES" },
        { pergunta: "De acordo com a inércia, corpos tendem a manter seu ___ atual.", resposta: "ESTADO" },
        { pergunta: "Força resultante igual a zero mantém em repouso ou em ___?", resposta: "MRU" }

    ];

    function iniciarForca() {
    // Limpa o conteúdo da rodada anterior
    gameContent.innerHTML = "";

    // Checa se já terminou todas as rodadas
    if (rodadaForca >= perguntasForca.length) {
        gameContent.insertAdjacentHTML("beforeend", `
            <p style="color:white;text-align:center;margin-top:20px;">
                🎉 Você completou todas as rodadas!
            </p>
        `);
        return;
    }

    const escolha = perguntasForca[rodadaForca];
    const palavra = escolha.resposta.toUpperCase();
    let erros = 0;
    let acertos = [];

    gameContent.innerHTML = `
        <div id="forca-container" style="text-align:center;margin-top:12px;">
            <p style="color:white;"><strong>Pergunta:</strong> ${escolha.pergunta}</p>
            <canvas id="forca-canvas" width="220" height="220" style="background:#fff;margin:12px auto;display:block;border-radius:6px;"></canvas>
            <div id="palavra-secreta" style="display:flex;justify-content:center;gap:10px;margin:18px 0;"></div>
            <div id="teclado" style="margin-top:8px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:760px;margin-left:auto;margin-right:auto;"></div>
            <p id="mensagem" style="font-weight:bold;margin-top:10px;color:white;"></p>
        </div>
    `;

    const canvas = document.getElementById("forca-canvas");
    const ctx = canvas.getContext("2d");
    const palavraDisplay = document.getElementById("palavra-secreta");
    const teclado = document.getElementById("teclado");
    const mensagem = document.getElementById("mensagem");

    function desenharBase() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(15, 200);
        ctx.lineTo(205, 200);
        ctx.moveTo(55, 200);
        ctx.lineTo(55, 20);
        ctx.lineTo(140, 20);
        ctx.lineTo(140, 40);
        ctx.stroke();
    }

        function desenharBoneco(p) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            if (p === 1) { ctx.beginPath(); ctx.arc(140, 60, 16, 0, Math.PI*2); ctx.stroke(); }
            if (p === 2) { ctx.beginPath(); ctx.moveTo(140, 76); ctx.lineTo(140, 130); ctx.stroke(); }
            if (p === 3) { ctx.beginPath(); ctx.moveTo(140, 90); ctx.lineTo(120, 110); ctx.stroke(); }
            if (p === 4) { ctx.beginPath(); ctx.moveTo(140, 90); ctx.lineTo(160, 110); ctx.stroke(); }
            if (p === 5) { ctx.beginPath(); ctx.moveTo(140, 130); ctx.lineTo(120, 160); ctx.stroke(); }
            if (p === 6) { ctx.beginPath(); ctx.moveTo(140, 130); ctx.lineTo(160, 160); ctx.stroke(); }
        }

        function atualizarPalavra() {
            palavraDisplay.innerHTML = palavra.split("").map(l => {
                const mostra = acertos.includes(l) ? l : "";
                return `<div class="forca-letra" data-letra="${l}">${mostra}</div>`;
            }).join("");
        }

        function criarTeclado() {
            const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            teclado.innerHTML = letras.map(l => `<button class="btn-letra forca-btn">${l}</button>`).join("");
            document.querySelectorAll(".btn-letra.forca-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const letra = btn.textContent;
                    btn.disabled = true;
                    if (palavra.includes(letra)) {
                        acertos.push(letra);
                        btn.classList.add("correct");
                        atualizarPalavra();
                        if (!palavra.split("").some(ch => !acertos.includes(ch))) {
                            mensagem.textContent = "🎉 Acertou! Próxima rodada...";
                            soltarConfetes();
                            atualizarScore(20);
                            rodadaForca++;
                            document.querySelectorAll(".btn-letra.forca-btn").forEach(b => b.disabled = true);
                            setTimeout(() => iniciarForca(), 1100);
                        }
                    } else {
                        erros++;
                        btn.classList.add("wrong");
                        desenharBoneco(erros);
                        atualizarScore(-5);
                        if (erros === 6) {
                            mensagem.textContent = `💀 Você perdeu! A palavra era: ${palavra}`;
                            rodadaForca++;
                            setTimeout(() => iniciarForca(), 1400);
                        }
                    }
                });
            });
        }

        desenharBase();
        atualizarPalavra();
        criarTeclado();
    }

    // =======================
    // 🔍 CAÇA-PALAVRAS
    // =======================
   function iniciarCacaPalavras() {
    const palavras = ["INERCIA","FORCA","ACAO","REACAO","MOVIMENTO"];
    const tamanho = 10;
    const tabuleiro = Array.from({ length: tamanho }, () => Array(tamanho).fill(""));

    palavras.forEach(palavra => {
        let tentativas = 0;
        let colocado = false;
        while(!colocado && tentativas < 200) {
            tentativas++;
            const linha = Math.floor(Math.random() * tamanho);
            const inicio = Math.floor(Math.random() * (tamanho - palavra.length + 1));
            let ok = true;
            for (let i = 0; i < palavra.length; i++) {
                const c = tabuleiro[linha][inicio + i];
                if (c !== "" && c !== palavra[i]) { ok = false; break; }
            }
            if (!ok) continue;
            for (let i = 0; i < palavra.length; i++) tabuleiro[linha][inicio + i] = palavra[i];
            colocado = true;
        }
        if (!colocado) {
            for (let i = 0; i < palavra.length; i++) tabuleiro[0][i] = palavra[i];
        }
    });

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < tamanho; i++)
        for (let j = 0; j < tamanho; j++)
            if (tabuleiro[i][j] === "") tabuleiro[i][j] = letras.charAt(Math.floor(Math.random() * letras.length));

    const listaPalavras = palavras.join(", ");

    gameContent.innerHTML = `
        <div style="text-align:center;margin-bottom:12px;">
            <p style="color:#e6e6e6;margin-top:8px;">Palavras: <strong style="color:#fff">${listaPalavras}</strong></p>
        </div>
        <div id="grid" style="display:grid; grid-template-columns:repeat(${tamanho},50px); gap:8px; justify-content:center;padding:18px;"></div>
        <p id="resultado" style="margin-top:12px;font-weight:bold;color:white;text-align:center;"></p>
    `;

    const grid = document.getElementById("grid");
    const resultado = document.getElementById("resultado");
    const encontrados = new Set();
    let currentSelection = [];

    tabuleiro.forEach((linha, i) => {
        linha.forEach((letra, j) => {
            const cell = document.createElement("div");
            cell.className = "letter-cell";
            cell.textContent = letra;
            cell.dataset.linha = i;
            cell.dataset.coluna = j;
            cell.dataset.letra = letra;
            cell.dataset.selected = "false";
            cell.style.userSelect = "none";
            cell.style.cursor = "pointer";
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            cell.style.fontWeight = "700";
            cell.style.fontSize = "18px";
            cell.style.width = "50px";
            cell.style.height = "50px";
            cell.style.borderRadius = "6px";
            cell.style.background = "rgba(147, 51, 234, 0.5)";
            cell.style.border = "2px solid rgba(147, 51, 234, 0.8)";
            cell.style.transition = "all 0.2s ease";

            cell.addEventListener("click", () => {
                if (cell.classList.contains("found")) return;

                if (cell.dataset.selected === "true") {
                    cell.dataset.selected = "false";
                    cell.classList.remove("selected");
                    cell.style.border = "2px solid rgba(147, 51, 234, 0.8)";
                    currentSelection = currentSelection.filter(c => c !== cell);
                    return;
                }

                currentSelection.push(cell);
                cell.dataset.selected = "true";
                cell.classList.add("selected");
                cell.style.border = "2px solid #fff";

                const selectionString = currentSelection.map(c => c.dataset.letra).join("");
                const encontradaExata = palavras.find(p => p === selectionString);
                if (encontradaExata && !encontrados.has(encontradaExata)) {
                    currentSelection.forEach(c => {
                        c.classList.add("found");
                        c.classList.remove("selected");
                        c.style.background = "#5de56bff";
                        c.style.border = "2px solid #40c449ff";
                    });
                    encontrados.add(encontradaExata);
                    atualizarScore(20);
                    currentSelection = [];
                    if (encontrados.size === palavras.length) {
                        resultado.textContent = "🎉 Você encontrou todas as palavras!";
                        soltarConfetes();
                        settings.playCelebrationSound();
                    }
                    return;
                }

                const isPrefixValid = palavras.some(p => p.startsWith(selectionString));
                if (!isPrefixValid) {
                    currentSelection.forEach(c => {
                        c.classList.add("invalid");
                        c.style.background = "#e74c3c";
                        c.style.border = "2px solid #e74c3c";
                    });
                    atualizarScore(-2);
                    setTimeout(() => {
                        currentSelection.forEach(c => {
                            if (!c.classList.contains("found")) {
                                c.classList.remove("invalid");
                                c.classList.remove("selected");
                                c.dataset.selected = "false";
                                c.style.background = "rgba(147, 51, 234, 0.5)";
                                c.style.border = "2px solid rgba(147, 51, 234, 0.8)";
                            }
                        });
                        currentSelection = [];
                    }, 400);
                }
            });

            grid.appendChild(cell);
        });
    });
}

    // =======================
    // 🧠 JOGO DA MEMÓRIA
    // =======================
    function iniciarMemoria() {
       const pares = [
            ["Inércia", "Tende a permanecer em repouso ou movimento"],
            ["Ação", "Reação"],
            ["1ª Lei", "Lei da Inércia"],
            ["3ª Lei", "Toda ação tem reação"],
            ["Newton", "<img src='img/newton.png' class='carta'>"]
        ];

        let cartas = [];
        pares.forEach(p => cartas.push(p[0], p[1]));
        cartas = cartas.sort(() => 0.5 - Math.random());
        let selecionadas = [];
        let acertos = 0;
        let memLock = false;

        const grid = document.getElementById("memoria-grid");
        const resultado = document.getElementById("resultado");
        grid.innerHTML = "";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(5, 120px)";
        grid.style.gap = "20px";
        grid.style.justifyContent = "center";

        cartas.forEach(texto => {
            const card = document.createElement("div");
            card.className = "memory-card";
            const valorCarta = texto.includes("newton.png") ? "Newton" : texto;
            card.dataset.valor = valorCarta;
            card.style.perspective = "1000px";

            const inner = document.createElement("div");
            inner.className = "memory-card-inner";
            inner.style.transition = "transform 0.6s";
            inner.style.transformStyle = "preserve-3d";
            inner.style.width = "120px";
            inner.style.height = "160px";
            inner.style.cursor = "pointer";

            const front = document.createElement("div");
            front.className = "memory-card-front";
            front.textContent = "?";
            front.style.position = "absolute";
            front.style.width = "100%";
            front.style.height = "100%";
            front.style.background = "#9333ea";
            front.style.color = "#fff";
            front.style.display = "flex";
            front.style.justifyContent = "center";
            front.style.alignItems = "center";
            front.style.borderRadius = "10px";
            front.style.fontSize = "1.5rem";
            front.style.backfaceVisibility = "hidden";

            const back = document.createElement("div");
            back.className = "memory-card-back";
            back.innerHTML = texto;
            back.style.position = "absolute";
            back.style.width = "100%";
            back.style.height = "100%";
            back.style.background = "#d946ef";
            back.style.color = "#fff";
            back.style.display = "flex";
            back.style.justifyContent = "center";
            back.style.alignItems = "center";
            back.style.borderRadius = "10px";
            back.style.fontSize = "1rem";
            back.style.transform = "rotateY(180deg)";
            back.style.backfaceVisibility = "hidden";

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);
            grid.appendChild(card);

            card.addEventListener("click", () => {
                if (memLock || card.classList.contains("matched") || card.classList.contains("flipped")) return;

                inner.style.transform = "rotateY(180deg)";
                card.classList.add("flipped");
                selecionadas.push(card);

                if (selecionadas.length === 2) {
                    memLock = true;
                    setTimeout(() => {
                        const [c1, c2] = selecionadas;
                        const v1 = c1.dataset.valor;
                        const v2 = c2.dataset.valor;
                        const certo = pares.some(p => p.includes(v1) && p.includes(v2));

                        if (certo) {
                            c1.classList.add("matched");
                            c2.classList.add("matched");

                            c1.querySelector(".memory-card-inner").style.transform = "rotateY(180deg)";
                            c2.querySelector(".memory-card-inner").style.transform = "rotateY(180deg)";

                            c1.style.pointerEvents = "none";
                            c2.style.pointerEvents = "none";

                            acertos++;
                            pontuacao += 20;
                            scoreDisplay.textContent = `Pontuação: ${pontuacao}`;

                            if (acertos === pares.length) {
                                resultado.textContent = `🎉 Parabéns! Todos os pares encontrados!`;
                                soltarConfetes();
                                settings.playCelebrationSound();
                            }
                        } else {
                            c1.querySelector(".memory-card-inner").style.transform = "rotateY(0deg)";
                            c2.querySelector(".memory-card-inner").style.transform = "rotateY(0deg)";
                            c1.classList.remove("flipped");
                            c2.classList.remove("flipped");
                        }
                        selecionadas = [];
                        memLock = false;
                    }, 800);

                }
            });
        });
    }
});
