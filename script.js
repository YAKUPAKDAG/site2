// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Flip cards — toggle on click (mobile friendly)
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// Star picker
let seciliYildiz = 5;
const starIcons = document.querySelectorAll('#starPicker i');

starIcons.forEach(star => {
  star.addEventListener('mouseover', () => {
    const val = parseInt(star.dataset.val);
    starIcons.forEach(s => {
      const sv = parseInt(s.dataset.val);
      s.classList.toggle('fa-solid', sv <= val);
      s.classList.toggle('fa-regular', sv > val);
      s.classList.toggle('active', sv <= val);
    });
  });

  star.addEventListener('mouseleave', () => {
    starIcons.forEach(s => {
      const sv = parseInt(s.dataset.val);
      s.classList.toggle('fa-solid', sv <= seciliYildiz);
      s.classList.toggle('fa-regular', sv > seciliYildiz);
      s.classList.toggle('active', sv <= seciliYildiz);
    });
  });

  star.addEventListener('click', () => {
    seciliYildiz = parseInt(star.dataset.val);
  });
});

// Yorum ekleme
function yorumEkle(e) {
  e.preventDefault();
  const ad = document.getElementById('yorumAd').value.trim();
  const hizmet = document.getElementById('yorumHizmet').value.trim();
  const metin = document.getElementById('yorumMetin').value.trim();

  let yildizHTML = '';
  for (let i = 1; i <= 5; i++) {
    yildizHTML += i <= seciliYildiz
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
  }

  const kart = document.createElement('div');
  kart.className = 'testimonial-card';
  kart.innerHTML = `
    <div class="stars">${yildizHTML}</div>
    <p>"${metin}"</p>
    <div class="testimonial-author">
      <strong>${ad}</strong>
      <span>${hizmet}</span>
    </div>
  `;

  document.getElementById('yorumlar-listesi').appendChild(kart);
  e.target.reset();
  seciliYildiz = 5;
  starIcons.forEach(s => {
    s.classList.add('fa-solid', 'active');
    s.classList.remove('fa-regular');
  });

  kart.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Form submit
function submitForm(e) {
  e.preventDefault();
  alert('Mesajınız alındı! En kısa sürede sizi arayacağız.');
  e.target.reset();
}
