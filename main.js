// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close nav when a link is clicked on mobile
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Category tab filtering
const tabBtns = document.querySelectorAll('.tab-btn');
const artCards = document.querySelectorAll('#art-grid .product-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        artCards.forEach(card => {
            card.style.display =
                (filter === 'all' || card.dataset.category === filter)
                ? 'block' : 'none';
        });
    });
});

// Contact form feedback
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const toast      = document.getElementById('toast');

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
            body: new URLSearchParams(new FormData(form)).toString()
        });
        if (res.ok) {
            showToast('✦ Message sent! I\'ll be in touch soon.');
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
