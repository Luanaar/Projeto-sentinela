(() => {
  "use strict";
  if (document.getElementById("sentinela-dev-dialog")) return;

  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href = "/css/dev-console.css";
  document.head.appendChild(cssLink);

  const dialog = document.createElement("dialog");
  dialog.id = "sentinela-dev-dialog";
  dialog.setAttribute("aria-labelledby", "sd-title");
  dialog.innerHTML =
    '<header class="sd-head">' +
      '<div class="sd-brand"><div class="sd-mark" aria-hidden="true">S</div><div>' +
      '<h2 class="sd-title" id="sd-title">Sentinela · Central do Desenvolvedor</h2>' +
      '<p class="sd-subtitle">Atalhos de navegação e diagnóstico básico</p></div></div>' +
      '<button class="sd-close" type="button" data-close>Fechar ✕</button></header>' +
    '<main class="sd-body">' +
      '<p class="sd-intro">Acesse rapidamente as telas do sistema. Este painel é uma ferramenta de navegação: não concede privilégios administrativos nem executa alterações no banco de dados.</p>' +
      '<h3 class="sd-section-title">Telas do sistema</h3>' +
      '<nav class="sd-grid" aria-label="Atalhos das telas">' +
        '<a class="sd-link" href="/index.html"><span class="sd-icon">⌂</span><span><strong>Login</strong><small>Entrada do sistema</small></span></a>' +
        '<a class="sd-link" href="/atendimento.html"><span class="sd-icon">＋</span><span><strong>Atendimento</strong><small>Cadastro de pacientes</small></span></a>' +
        '<a class="sd-link" href="/triagem.html"><span class="sd-icon">♡</span><span><strong>Triagem</strong><small>Fila e classificação</small></span></a>' +
        '<a class="sd-link" href="/medico.html"><span class="sd-icon">✚</span><span><strong>Painel médico</strong><small>Consultas e atendimentos</small></span></a>' +
        '<a class="sd-link" href="/medicacoes.html"><span class="sd-icon">▤</span><span><strong>Medicações</strong><small>Histórico de prescrições</small></span></a>' +
        '<a class="sd-link" href="/tv.html" target="_blank" rel="noopener"><span class="sd-icon">▣</span><span><strong>Tela da TV</strong><small>Chamadas de pacientes</small></span></a>' +
      '</nav>' +
      '<h3 class="sd-section-title">Ferramentas rápidas</h3>' +
      '<div class="sd-tools"><button class="sd-action" type="button" data-check>Verificar API</button>' +
      '<button class="sd-action" type="button" data-copy>Copiar endereço desta tela</button>' +
      '<button class="sd-action" type="button" data-reload>Atualizar página</button></div>' +
      '<div class="sd-status" role="status" aria-live="polite"><span class="sd-dot" data-dot></span><span data-status>Verificando conexão com a API...</span></div>' +
      '<p class="sd-foot">Atalho: <kbd class="sd-key">Alt</kbd> + <kbd class="sd-key">A</kbd> para abrir/fechar · <kbd class="sd-key">Esc</kbd> para fechar. Os links também permitem navegar sem o atalho.</p>' +
    '</main>';
  document.body.appendChild(dialog);

  const statusText = dialog.querySelector("[data-status]");
  const statusDot = dialog.querySelector("[data-dot]");

  async function checkApi() {
    statusText.textContent = "Verificando API...";
    statusDot.className = "sd-dot";
    try {
      const response = await fetch("/health", { cache: "no-store" });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      statusDot.className = "sd-dot ok";
      statusText.textContent = "API online · " + (data.service || "Sentinela API");
    } catch (error) {
      statusDot.className = "sd-dot bad";
      statusText.textContent = "API indisponível · confira se o servidor está iniciado.";
    }
  }

  function togglePanel() {
    if (dialog.open) dialog.close();
    else { dialog.showModal(); checkApi(); }
  }

  document.addEventListener("keydown", (event) => {
    if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === "KeyA") {
      event.preventDefault();
      event.stopPropagation();
      togglePanel();
    }
  }, true);

  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-check]").addEventListener("click", checkApi);
  dialog.querySelector("[data-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      statusText.textContent = "Endereço copiado.";
      statusDot.className = "sd-dot ok";
    } catch (error) {
      statusText.textContent = "Não foi possível copiar neste navegador.";
      statusDot.className = "sd-dot bad";
    }
  });
  dialog.querySelector("[data-reload]").addEventListener("click", () => window.location.reload());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();