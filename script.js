async function fetchRSS() {
    const url = document.getElementById('rssUrl').value;
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const feedContent = document.getElementById('feedContent');

    // Validar URL
    if (!url) {
        showError('Por favor, insira um URL válido');
        return;
    }

    // Mostrar loading e limpar conteúdo anterior
    loading.classList.remove('d-none');
    error.classList.add('d-none');
    feedContent.innerHTML = '';

    try {
        // Usar um serviço de proxy CORS para aceder ao feed
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.status === 'ok') {
            displayFeed(data.items);
        } else {
            showError('Não foi possível carregar o feed. Verifique se o URL está correto.');
        }
    } catch (err) {
        showError('Erro ao carregar o feed: ' + err.message);
    } finally {
        loading.classList.add('d-none');
    }
}

function displayFeed(items) {
    const feedContent = document.getElementById('feedContent');
    feedContent.innerHTML = '';

    const col = document.createElement('div');
    col.className = 'col-md-8';

    items.forEach(item => {
        const article = document.createElement('div');
        article.className = 'feed-item';
        
        const date = new Date(item.pubDate).toLocaleDateString('pt-BR');
        
        article.innerHTML = `
            <h3><a href="${item.link}" target="_blank" class="text-decoration-none">${item.title}</a></h3>
            <p class="text-muted small">Publicado em: ${date}</p>
            <p>${item.description}</p>
            <a href="${item.link}" target="_blank" class="btn btn-outline-primary btn-sm">Ler mais</a>
        `;
        
        col.appendChild(article);
    });

    feedContent.appendChild(col);
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.classList.remove('d-none');
}