/* ===== CONFIGURATION ===== */
const CONFIG = {
  weddingDate: new Date('2027-06-05T11:00:00+09:00'),
  weddingYear: 2027,
  weddingMonth: 6,  // 1-indexed
  weddingDay: 5,
  // Vercel API base URL - 배포 후 변경하세요
  apiBaseUrl: '/api',
  // Naver Map 좌표 (예시: 청담동 부근)
  mapLat: 37.5199,
  mapLng: 127.0475,
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCalendar();
  initCountdown();
  initGallery();
  initDirectionTabs();
  initAccountToggles();
  initCopyButtons();
  initGuestbook();
  initMap();
});

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ===== CALENDAR ===== */
function initCalendar() {
  const container = document.getElementById('calendarDays');
  if (!container) return;

  const year = CONFIG.weddingYear;
  const month = CONFIG.weddingMonth - 1; // JS는 0-indexed

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';

  // 빈 칸
  for (let i = 0; i < firstDay; i++) {
    html += '<span class="calendar-day empty"></span>';
  }

  // 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (firstDay + d - 1) % 7;
    let classes = 'calendar-day';
    if (dayOfWeek === 0) classes += ' sun';
    if (dayOfWeek === 6) classes += ' sat';
    if (d === CONFIG.weddingDay) classes += ' wedding-day';
    html += `<span class="${classes}">${d}</span>`;
  }

  container.innerHTML = html;
}

/* ===== COUNTDOWN ===== */
function initCountdown() {
  function update() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      document.getElementById('dday-days').textContent = '0';
      document.getElementById('dday-hours').textContent = '0';
      document.getElementById('dday-minutes').textContent = '0';
      document.getElementById('dday-seconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('dday-days').textContent = days;
    document.getElementById('dday-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('dday-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('dday-seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===== GALLERY (Swiper) ===== */
function initGallery() {
  const swiper = new Swiper('.gallery-swiper', {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 12,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      400: { slidesPerView: 1.3 },
    },
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.gallery-placeholder').forEach(el => {
    el.addEventListener('click', () => {
      const img = el.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    });
  }
}

/* ===== DIRECTION TABS ===== */
function initDirectionTabs() {
  document.querySelectorAll('.direction-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.direction-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.direction-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

/* ===== ACCOUNT TOGGLES ===== */
function initAccountToggles() {
  document.querySelectorAll('.account-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const isOpen = btn.classList.contains('open');

      // 다른 열린 것 닫기
      document.querySelectorAll('.account-toggle.open').forEach(other => {
        if (other !== btn) {
          other.classList.remove('open');
          document.getElementById(other.dataset.target).classList.remove('open');
        }
      });

      btn.classList.toggle('open', !isOpen);
      target.classList.toggle('open', !isOpen);
    });
  });
}

/* ===== COPY BUTTONS ===== */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.clipboard;
      try {
        await navigator.clipboard.writeText(text);
        showToast('계좌번호가 복사되었습니다');
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('계좌번호가 복사되었습니다');
      }
    });
  });
}

/* ===== TOAST ===== */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* ===== NAVER MAP ===== */
function initMap() {
  if (typeof naver === 'undefined' || !naver.maps) {
    // API가 로드되지 않은 경우 placeholder 표시
    const mapEl = document.getElementById('naverMap');
    if (mapEl) {
      mapEl.style.display = 'flex';
      mapEl.style.alignItems = 'center';
      mapEl.style.justifyContent = 'center';
      mapEl.style.color = '#8A8A8A';
      mapEl.style.fontSize = '0.85rem';
      mapEl.innerHTML = '<span>네이버 지도 API 키를 설정해주세요<br>(index.html의 ncpClientId)</span>';
      mapEl.style.textAlign = 'center';
    }
    return;
  }

  const position = new naver.maps.LatLng(CONFIG.mapLat, CONFIG.mapLng);
  const map = new naver.maps.Map('naverMap', {
    center: position,
    zoom: 16,
    zoomControl: false,
    mapTypeControl: false,
  });

  new naver.maps.Marker({
    position: position,
    map: map,
  });
}

/* ===== GUESTBOOK ===== */
function initGuestbook() {
  loadGuestbook();

  const form = document.getElementById('guestbookForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('gbName').value.trim();
    const password = document.getElementById('gbPassword').value;
    const message = document.getElementById('gbMessage').value.trim();

    if (!name || !password || !message) return;

    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '등록 중...';

    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, message }),
      });

      if (!res.ok) throw new Error('등록 실패');

      form.reset();
      showToast('축하 메시지가 등록되었습니다');
      loadGuestbook();
    } catch (err) {
      showToast('등록에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '등록하기';
    }
  });
}

async function loadGuestbook() {
  const list = document.getElementById('guestbookList');
  const loading = document.getElementById('guestbookLoading');

  loading.style.display = 'flex';

  try {
    const res = await fetch(`${CONFIG.apiBaseUrl}/guestbook`);
    if (!res.ok) throw new Error('로딩 실패');

    const data = await res.json();

    if (data.entries && data.entries.length > 0) {
      list.innerHTML = data.entries.map(entry => `
        <div class="guestbook-entry" data-id="${entry.id}">
          <div class="guestbook-entry-header">
            <span class="guestbook-entry-name">${escapeHtml(entry.name)}</span>
            <span class="guestbook-entry-date">${formatDate(entry.createdAt)}</span>
          </div>
          <p class="guestbook-entry-message">${escapeHtml(entry.message)}</p>
          <button class="guestbook-entry-delete" onclick="deleteGuestbookEntry('${entry.id}')">삭제</button>
        </div>
      `).join('');
    } else {
      list.innerHTML = '<p style="text-align:center;color:#8A8A8A;font-size:0.85rem;padding:20px 0;">아직 등록된 메시지가 없습니다.</p>';
    }
  } catch (err) {
    list.innerHTML = '<p style="text-align:center;color:#8A8A8A;font-size:0.85rem;padding:20px 0;">방명록을 불러올 수 없습니다.</p>';
    console.error(err);
  } finally {
    loading.style.display = 'none';
  }
}

async function deleteGuestbookEntry(id) {
  // 비밀번호 모달 표시
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>비밀번호를 입력하세요</h3>
      <input type="password" id="deletePassword" placeholder="비밀번호">
      <div class="modal-buttons">
        <button class="modal-cancel">취소</button>
        <button class="modal-confirm">삭제</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const pwInput = overlay.querySelector('#deletePassword');
  const cancelBtn = overlay.querySelector('.modal-cancel');
  const confirmBtn = overlay.querySelector('.modal-confirm');

  cancelBtn.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  confirmBtn.addEventListener('click', async () => {
    const password = pwInput.value;
    if (!password) return;

    try {
      const res = await fetch(`${CONFIG.apiBaseUrl}/guestbook?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        showToast(errData.error || '삭제 실패');
        return;
      }

      showToast('메시지가 삭제되었습니다');
      loadGuestbook();
    } catch (err) {
      showToast('삭제에 실패했습니다');
      console.error(err);
    } finally {
      overlay.remove();
    }
  });

  pwInput.focus();
}

/* ===== UTILS ===== */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${mm}.${dd} ${hh}:${mi}`;
}
