// --- 1. LÓGICA DE NAVEGAÇÃO (TROCA DE ABAS) ---
document.addEventListener('DOMContentLoaded', () => {
    const botoesMenu = document.querySelectorAll('[data-abrir]');
    const secoes = document.querySelectorAll('.secao-conteudo');

    botoesMenu.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-abrir');

            // Esconde todas as seções
            secoes.forEach(s => s.style.display = 'none');

            // Mostra a seção desejada
            const secaoAlvo = document.getElementById(idAlvo);
            if (secaoAlvo) {
                secaoAlvo.style.display = 'block';
                secaoAlvo.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 2. FUNÇÃO PARA CHAMAR A IA ---
    async function chamarIA(systemPrompt, userPrompt, elementoDestino) {
        // Deixe APENAS esta linha abaixo para a chave:
        const apiKey = '';

        const loader = document.getElementById('loader');

        if (!apiKey || apiKey === '') {
            alert('Chave API não encontrada.');
            return;
        }

        // Mostrar Loader
        if (loader) loader.style.display = 'flex';
        elementoDestino.innerHTML = '<p class="processando">O sentido aranha está captando a resposta...</p>';

try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Erro na resposta da API');
    }

    const data = await response.json();
    const resultado = data.choices[0].message.content;
    elementoDestino.innerHTML = `<p style="white-space: pre-wrap;">${resultado}</p>`;
} catch (error) {
    console.error("Erro detalhado:", error);
    elementoDestino.innerHTML = `<p style="color: #ff4d4d;">Erro: ${error.message}</p>`;
} finally {
    if (loader) loader.style.display = 'none';
}
}

// --- 3. CONFIGURAÇÃO DOS BOTÕES ESPECÍFICOS ---

// Ação: Salvar Chave API
document.getElementById('btn-salvar-chave').addEventListener('click', () => {
    const chave = document.getElementById('chave-api').value;
    if (chave.startsWith('sk-')) {
        localStorage.setItem('openai_key', chave);
        alert('Chave salva com sucesso no seu navegador!');
        document.getElementById('chave-api').value = '';
    } else {
        alert('Chave inválida. Certifique-se de que começa com "sk-"');
    }
});

// Ação: Ajustar Ortografia
document.getElementById('btn-ajustar-ortografia').addEventListener('click', () => {
    const texto = document.getElementById('texto-ortografia').value;
    const destino = document.getElementById('resultado-ortografia');

    const systemPrompt = "Você é o AranhaTCC. Sua tarefa é corrigir a ortografia e gramática do texto acadêmico abaixo, mantendo a norma culta e o padrão ABNT. Retorne apenas o texto corrigido.";

    if (texto.trim()) chamarIA(systemPrompt, texto, destino);
});

// Ação: Pesquisa
document.getElementById('btn-buscar-pesquisa').addEventListener('click', () => {
    const tema = document.getElementById('tema-pesquisa').value;
    const tipo = document.getElementById('tipo-pesquisa').value;
    const destino = document.getElementById('resultado-pesquisa');

    const systemPrompt = `Você é um bibliotecário acadêmico. O usuário busca por: ${tipo}. Forneça informações relevantes e confiáveis sobre o tema.`;

    if (tema.trim()) chamarIA(systemPrompt, `Tema: ${tema}`, destino);
});

// Ação: Redação Natural
document.getElementById('btn-gerar-redacao').addEventListener('click', () => {
    const tema = document.getElementById('tema-redacao').value;
    const instrucoes = document.getElementById('instrucoes-redacao').value;
    const destino = document.getElementById('resultado-redacao');

    const systemPrompt = `Você é um redator acadêmico especialista. Escreva um parágrafo fluido, natural e formal para um TCC sobre o tema solicitado, seguindo as instruções adicionais.`;

    const userPrompt = `Tema: ${tema}. Instruções adicionais: ${instrucoes}`;

    if (tema.trim()) chamarIA(systemPrompt, userPrompt, destino);
});
});