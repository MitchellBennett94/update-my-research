// Image rotation logic for library page
let currentImageIndex = 0;
const images = [
    'images/library.jpg',
    'images/book.jpg',
    'images/peerReview.jpg'
];

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const img = document.getElementById('myImage');
    if (img) {
        img.src = images[currentImageIndex];
    }
}

// Discussion board logic (merged from discussion.js)
(function () {
    const STORAGE_KEY = 'discussionBoardPosts';
    const form = document.getElementById('discussion-form');
    const titleInput = document.getElementById('discussion-title');
    const bodyInput = document.getElementById('discussion-body');
    const list = document.getElementById('discussion-list');
    const submitBtn = document.getElementById('discussion-submit');

    if (!form || !titleInput || !bodyInput || !list || !submitBtn) return;

    function loadPosts() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function savePosts(posts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    function escapeHtml(str) {
        return (str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function render() {
        const posts = loadPosts();
        list.innerHTML = '';
        posts.forEach((post, idx) => {
            const card = document.createElement('div');
            card.className = 'discussion-post';
            card.innerHTML = `
                <h3>${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(post.body)}</p>
                <p class="meta">Posted just now</p>
                <button type="button" data-idx="${idx}" class="delete-post">Delete</button>
            `;
            list.appendChild(card);
        });
    }

    function addPost() {
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();
        if (!title || !body) return;
        const posts = loadPosts();
        posts.unshift({ title, body });
        savePosts(posts);
        titleInput.value = '';
        bodyInput.value = '';
        render();
    }

    function handleDelete(idx) {
        const posts = loadPosts();
        posts.splice(idx, 1);
        savePosts(posts);
        render();
    }

    submitBtn.addEventListener('click', addPost);
    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-post')) {
            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
            if (!Number.isNaN(idx)) handleDelete(idx);
        }
    });

    render();
})();

// Library search logic
(function () {
    const queryInput = document.getElementById('library-query');
    const searchBtn = document.getElementById('library-search-btn');
    const resultsEl = document.getElementById('library-results');

    if (!queryInput || !searchBtn || !resultsEl) return;

    // Simple in-memory catalog; extend with real data or fetch as needed
    const catalog = [
        { title: 'Planning on adding more Titles for scientific research', description: 'Information about the title.' },
    ];

    function renderResults(list) {
        if (!list.length) {
            resultsEl.innerHTML = '<p>No results found.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        list.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'library-result';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            fragment.appendChild(card);
        });
        resultsEl.innerHTML = '';
        resultsEl.appendChild(fragment);
    }

    function runSearch() {
        const q = queryInput.value.trim().toLowerCase();
        if (!q) {
            renderResults(catalog);
            return;
        }
        const hits = catalog.filter((item) =>
            item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        );
        renderResults(hits);
    }

    searchBtn.addEventListener('click', runSearch);
    queryInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearch();
        }
    });

    renderResults(catalog);
})();

// Help desk ticket logic
(function () {
    const TICKETS_KEY = 'helpDeskTickets';
    const form = document.getElementById('help-desk-form');
    const nameInput = document.getElementById('ticket-name');
    const emailInput = document.getElementById('ticket-email');
    const categorySelect = document.getElementById('ticket-category');
    const descriptionInput = document.getElementById('ticket-description');
    const confirmationEl = document.getElementById('ticket-confirmation');

    if (!form || !nameInput || !emailInput || !categorySelect || !descriptionInput || !confirmationEl) return;

    function loadTickets() {
        try {
            const raw = localStorage.getItem(TICKETS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveTickets(tickets) {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }

    function generateTicketId() {
        return 'TKT-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    function showConfirmation(ticketId) {
        confirmationEl.innerHTML = `
            <h3>Ticket Submitted Successfully!</h3>
            <p>Your ticket ID is: <strong>${ticketId}</strong></p>
            <p>We'll review your request and respond to <strong>${emailInput.value}</strong> within 24 hours.</p>
        `;
        confirmationEl.style.display = 'block';
        setTimeout(() => {
            confirmationEl.style.display = 'none';
        }, 8000);
    }

    function submitTicket(e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();

        if (!name || !email || !category || !description) {
            alert('Please fill in all fields.');
            return;
        }

        const ticketId = generateTicketId();
        const ticket = {
            id: ticketId,
            name,
            email,
            category,
            description,
            timestamp: new Date().toISOString(),
            status: 'open'
        };

        const tickets = loadTickets();
        tickets.push(ticket);
        saveTickets(tickets);

        showConfirmation(ticketId);
        form.reset();
    }

    form.addEventListener('submit', submitTicket);
})();