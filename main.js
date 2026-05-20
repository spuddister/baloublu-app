// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Category tab filtering (operates on dynamically rendered cards)
const tabBtns = document.querySelectorAll('.tab-btn');
const artGrid  = document.getElementById('art-grid');

function filterCards(filter) {
    artGrid.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        filterCards(btn.dataset.filter);
    });
});

// Contact form
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const toast     = document.getElementById('toast');

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    try {
        const res = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (res.ok) {
            showToast("✦ Message sent! I'll be in touch soon.");
            form.reset();
        } else {
            showToast('Something went wrong — please try again.');
        }
    } catch {
        showToast('Something went wrong — please try again.');
    } finally {
        submitBtn.textContent = 'Send Message ✦';
        submitBtn.disabled = false;
    }
});

// Etsy listings
const potteryGrid = document.getElementById('pottery-grid');

const POTTERY_TERMS = ['pottery', 'ceramic', 'stoneware', 'porcelain', 'clay', 'mug', 'bowl', 'cup', 'saucer', 'serving dish'];

function getCategory(listing) {
    const tags     = listing.tags.map(t => t.toLowerCase());
    const taxonomy = (listing.taxonomy_path || []).join(' ').toLowerCase();
    if (POTTERY_TERMS.some(t => tags.includes(t) || taxonomy.includes(t))) return 'pottery';
    if (listing.type === 'download') return 'digital';
    if (tags.some(t => t.includes('original'))) return 'original';
    return 'physical';
}

function createCard(listing, category) {
    const image = listing.images?.[0]?.url_570xN;
    const price = `$${(listing.price.amount / listing.price.divisor).toFixed(2)} ${listing.price.currency_code}`;
    const tagLabels = { digital: 'Digital Print', physical: 'Physical Print', original: 'Original', pottery: 'Pottery' };

    const card = document.createElement('div');
    card.className = 'product-card';
    if (category !== 'pottery') card.dataset.category = category;

    const imgDiv = document.createElement('div');
    imgDiv.className = 'product-img';
    if (image) {
        const img = document.createElement('img');
        img.src = image;
        img.alt = listing.title;
        img.loading = 'lazy';
        imgDiv.appendChild(img);
    } else {
        imgDiv.textContent = '🎨';
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';

    const tagEl = document.createElement('div');
    tagEl.className = 'tag';
    tagEl.textContent = tagLabels[category] || 'Art';

    const titleEl = document.createElement('h3');
    titleEl.textContent = listing.title;

    const priceEl = document.createElement('p');
    priceEl.className = 'price';
    priceEl.textContent = price;

    const link = document.createElement('a');
    link.href = listing.url;
    link.className = 'product-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'View on Etsy →';

    infoDiv.append(tagEl, titleEl, priceEl, link);
    card.append(imgDiv, infoDiv);
    return card;
}

function setGridError(grid) {
    grid.innerHTML = '';
    const msg = document.createElement('p');
    msg.className = 'grid-message';
    msg.innerHTML = 'Could not load listings — visit us on <a href="https://www.etsy.com/ca/shop/Baloublu" target="_blank" rel="noopener noreferrer">Etsy</a>.';
    grid.appendChild(msg);
}

async function loadListings() {
    try {
        const res = await fetch('/.netlify/functions/listings');
        if (!res.ok) throw new Error();
        const listings = await res.json();

        artGrid.innerHTML = '';
        potteryGrid.innerHTML = '';

        listings.forEach(listing => {
            const category = getCategory(listing);
            const card = createCard(listing, category);
            (category === 'pottery' ? potteryGrid : artGrid).appendChild(card);
        });

        if (!artGrid.querySelector('.product-card')) {
            artGrid.innerHTML = '<p class="grid-message">No inventory right now — but commissions are always welcome! <a href="#contact">Get in touch.</a></p>';
        }
        if (!potteryGrid.querySelector('.product-card')) {
            potteryGrid.innerHTML = '<p class="grid-message">No inventory right now — but commissions are always welcome! <a href="#contact">Get in touch.</a></p>';
        }
    } catch {
        setGridError(artGrid);
        setGridError(potteryGrid);
    }
}

loadListings();
