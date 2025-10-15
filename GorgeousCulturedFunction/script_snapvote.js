let snaps = [
    {
        id: 1,
        username: '@snapqueen',
        image: 'attached_assets/stock_images/happy_young_woman_ta_aea3fd72.jpg',
        votes: 245,
        holds: 89
    },
    {
        id: 2,
        username: '@coolvibes',
        image: 'attached_assets/stock_images/cool_person_with_sun_2fe1f5d5.jpg',
        votes: 189,
        holds: 67
    },
    {
        id: 3,
        username: '@sunsetlover',
        image: 'attached_assets/stock_images/beautiful_sunset_lan_102e32ee.jpg',
        votes: 156,
        holds: 54
    },
    {
        id: 4,
        username: '@adventurer',
        image: 'attached_assets/stock_images/adventure_travel_mou_1baf697c.jpg',
        votes: 203,
        holds: 72
    },
    {
        id: 5,
        username: '@foodiesnap',
        image: 'attached_assets/stock_images/delicious_food_photo_53e61652.jpg',
        votes: 134,
        holds: 48
    },
    {
        id: 6,
        username: '@naturephoto',
        image: 'attached_assets/stock_images/nature_photography_f_14139507.jpg',
        votes: 178,
        holds: 61
    }
];

let uploadedImage = null;

function scrollToParticipate() {
    document.getElementById('participate').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('uploadPreview').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = event.target.result;
            const preview = document.getElementById('uploadPreview');
            preview.innerHTML = `<img src="${uploadedImage}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadPreview').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.currentTarget.style.background = 'rgba(255, 252, 0, 0.2)';
});

document.getElementById('uploadPreview').addEventListener('dragleave', (e) => {
    e.currentTarget.style.background = '';
});

document.getElementById('uploadPreview').addEventListener('drop', (e) => {
    e.preventDefault();
    e.currentTarget.style.background = '';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = event.target.result;
            const preview = document.getElementById('uploadPreview');
            preview.innerHTML = `<img src="${uploadedImage}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

function uploadSnap() {
    const username = document.getElementById('username').value.trim();
    
    if (!uploadedImage) {
        alert('Please upload an image first! 📸');
        return;
    }
    
    if (!username) {
        alert('Please enter your username! 😊');
        return;
    }
    
    const newSnap = {
        id: snaps.length + 1,
        username: username.startsWith('@') ? username : '@' + username,
        image: uploadedImage,
        votes: 0,
        holds: 0
    };
    
    snaps.unshift(newSnap);
    
    createConfetti();
    
    renderGallery();
    renderLeaderboard();
    
    document.getElementById('uploadPreview').innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click or drag to upload your snap</p>
    `;
    document.getElementById('username').value = '';
    uploadedImage = null;
    
    alert('Your snap has been uploaded successfully! 🎉');
    
    document.getElementById('photos').scrollIntoView({ behavior: 'smooth' });
}

function voteSnap(id) {
    const snap = snaps.find(s => s.id === id);
    if (snap) {
        snap.votes++;
        createConfetti();
        renderGallery();
        renderLeaderboard();
    }
}

function holdSnap(id, event) {
    const snap = snaps.find(s => s.id === id);
    if (snap) {
        snap.holds++;
        createSparkle(event.target);
        renderGallery();
        renderLeaderboard();
    }
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = snaps.map(snap => `
        <div class="photo-card">
            <img src="${snap.image}" alt="${snap.username}" onerror="this.src='extracted_assets/snapchat.com-542/images/deeplink-snapcode'">
            <div class="photo-info">
                <div class="username">${snap.username}</div>
                <div class="actions">
                    <button class="vote-btn" onclick="voteSnap(${snap.id})">
                        ❤️ Vote <span>${snap.votes}</span>
                    </button>
                    <button class="hold-btn" onclick="holdSnap(${snap.id}, event)">
                        🔥 Hold <span>${snap.holds}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const sortedSnaps = [...snaps].sort((a, b) => (b.votes + b.holds) - (a.votes + a.holds));
    const top5 = sortedSnaps.slice(0, 5);
    
    const grid = document.getElementById('leaderboardGrid');
    grid.innerHTML = top5.map((snap, index) => `
        <div class="leaderboard-item ${index === 0 ? 'top-1' : ''}">
            ${index === 0 ? '<div class="crown">👑</div>' : ''}
            <div class="rank">#${index + 1}</div>
            <img src="${snap.image}" alt="${snap.username}" onerror="this.src='extracted_assets/snapchat.com-542/images/deeplink-snapcode'">
            <div class="leaderboard-info">
                <div class="leaderboard-username">${snap.username}</div>
                <div class="leaderboard-stats">
                    <span>❤️ ${snap.votes} votes</span>
                    <span>🔥 ${snap.holds} holds</span>
                </div>
            </div>
        </div>
    `).join('');
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#FFFC00', '#FF6B9D', '#FFA06B', '#00D4FF', '#A06BFF'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function createSparkle(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    const sparkle = document.createElement('div');
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.position = 'absolute';
    sparkle.style.fontSize = '24px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'confetti-fall 2s linear forwards';
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = rect.left + 'px';
    sparkle.style.top = rect.top + 'px';
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    renderLeaderboard();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
