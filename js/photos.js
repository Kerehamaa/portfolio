// Photos for portfolio.kerehama.nz.
// To add a photo: put the file in /photos and copy one of the entries below.
// locked: true hides it behind the PIN.
const photos = [
  {
    file: "/photos/ATH26-1.JPG",
    date: "20 February 2026",
    event: "Athletics Day 2026",
    caption: "cameo ft. Jaiden",
    locked: true,
    location: "Tauranga Domain",
    lat: -37.6784,
    lng: 176.1656
  },
  {
    file: "/photos/ATH26-2.JPG",
    date: "20 February 2026",
    event: "Athletics Day 2026",
    caption: "cameo ft. Stich",
    locked: true,
    location: "Tauranga Domain",
    lat: -37.6784,
    lng: 176.1656
  },
  {
    file: "/photos/ATH26-3.JPG",
    date: "20 February 2026",
    event: "Athletics Day 2026",
    caption: "cameo ft. Julia",
    locked: true,
    location: "Tauranga Domain",
    lat: -37.6784,
    lng: 176.1656
  },
  {
    file: "/photos/BBALL25-1.JPG",
    date: "14 May 2025",
    event: "Basketball 2025",
    caption: "cameo ft. Mason",
    locked: true,
    location: "Mercury Baypark",
    lat: -37.6863,
    lng: 176.2251
  },
  {
    file: "/photos/MIS25-1.JPG",
    date: "7 June 2025",
    event: "Missions Trip 2025",
    caption: "on the east coast of New Zealand North Island",
    locked: false,
    location: "Bay of Plenty coast, drive home",
    lat: -38.0086,
    lng: 177.2871
  },
  {
    file: "/photos/MIS25-2.JPG",
    date: "7 June 2025",
    event: "Missions Trip 2025",
    caption: "up Mount Hikurangi in Gisborne",
    locked: false,
    location: "Mount Hikurangi",
    lat: -37.9189,
    lng: 178.0607
  },
  {
    file: "/photos/MIS25-3.JPG",
    date: "7 June 2025",
    event: "Missions Trip 2025",
    caption: "taken on the east coast of New Zealand North Island",
    locked: false,
    location: "Bay of Plenty coast, drive home",
    lat: -38.0086,
    lng: 177.2871
  }
];

// Build the gallery
(() => {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  gallery.innerHTML = photos.map((photo, i) => `
    <div class="gallery-item ${photo.locked ? 'locked' : ''}" data-index="${i}" data-locked="${photo.locked}">
      <img src="${photo.file}" alt="${photo.event}: ${photo.caption}" loading="lazy" />
      <div class="overlay">
        <span class="photo-title">${photo.event}</span>
        <span class="photo-caption">${photo.caption}</span>
        <span class="photo-date">${photo.date}</span>
      </div>
      ${photo.locked ? `<div class="lock-overlay"><span class="lock-icon"><svg class="icon-lock" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span><span class="lock-text">PIN required</span></div>` : ''}
    </div>`).join('');
})();

// PIN, lightbox
(() => {
  const PIN = '1234';
  let unlocked = sessionStorage.getItem('photos_unlocked') === 'true';

  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbTitle = lightbox.querySelector('.lightbox-info .photo-title');
  const lbCaption = lightbox.querySelector('.lightbox-info .photo-caption');
  const pinBar = document.getElementById('pin-bar');
  const pinInput = document.getElementById('pin-input');
  const pinSubmit = document.getElementById('pin-submit');
  const pinError = document.getElementById('pin-error');
  let currentIndex = 0;

  function applyUnlockState() {
    if (unlocked) {
      document.querySelectorAll('.gallery-item.locked').forEach(el => {
        el.classList.remove('locked');
      });
      pinBar.classList.add('hidden');
    }
  }

  // Apply on load (in case already unlocked this session)
  applyUnlockState();

  function tryUnlock() {
    if (pinInput.value === PIN) {
      unlocked = true;
      sessionStorage.setItem('photos_unlocked', 'true');
      applyUnlockState();
      pinError.textContent = '';
    } else {
      pinError.textContent = 'Wrong PIN';
      pinInput.value = '';
      pinInput.focus();
    }
  }

  pinSubmit.addEventListener('click', tryUnlock);
  pinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });

  function openLightbox(index) {
    currentIndex = index;
    const photo = photos[index];
    lbImg.src = photo.file;
    lbImg.alt = `${photo.event}: ${photo.caption}`;
    lbTitle.textContent = photo.event;
    lbCaption.textContent = `${photo.caption} · ${photo.date}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    // Skip locked photos when navigating
    let next = currentIndex;
    for (let i = 0; i < photos.length; i++) {
      next = (next + dir + photos.length) % photos.length;
      if (!photos[next].locked || unlocked) break;
    }
    openLightbox(next);
  }

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      if (photos[idx].locked && !unlocked) return; // Don't open locked photos
      openLightbox(idx);
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.prev').addEventListener('click', () => navigate(-1));
  lightbox.querySelector('.next').addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

// Photo map
  // Photo map
  (() => {
    const mapEl = document.getElementById('photo-map');
    if (!mapEl || typeof L === 'undefined') return;

    const map = L.map('photo-map', {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([-37.9, 177.0], 8);

    // Esri Canvas tiles: free, no API key. Dark or light set follows the theme toggle.
    const esri = (name) => L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/' + name + '/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 16,
    });
    const tiles = {
      dark: L.layerGroup([esri('World_Dark_Gray_Base'), esri('World_Dark_Gray_Reference')]),
      light: L.layerGroup([esri('World_Light_Gray_Base'), esri('World_Light_Gray_Reference')]),
    };
    const theme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    let current = theme();
    tiles[current].addTo(map);
    new MutationObserver(() => {
      const next = theme();
      if (next === current) return;
      map.removeLayer(tiles[current]);
      tiles[next].addTo(map);
      current = next;
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Group photos by location to avoid stacking markers
    const locations = {};
    photos.forEach((p, i) => {
      const key = `${p.lat},${p.lng}`;
      if (!locations[key]) locations[key] = { lat: p.lat, lng: p.lng, photos: [] };
      locations[key].photos.push({ ...p, index: i });
    });

    // Custom marker style
    const markerIcon = L.divIcon({
      className: 'map-marker',
      html: '<div class="map-marker-dot"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    Object.values(locations).forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon }).addTo(map);

      // Build popup content
      const photoList = loc.photos.map(p => {
        const isLocked = p.locked && sessionStorage.getItem('photos_unlocked') !== 'true';
        const thumb = isLocked
          ? `<div style="width:60px;height:45px;border-radius:4px;background:rgba(255,255,255,0.1);display:grid;place-items:center;color:#fff;"><svg class="icon-lock" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div>`
          : `<img src="${p.file}" style="width:60px;height:45px;object-fit:cover;border-radius:4px;" />`;
        return `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">
          ${thumb}
          <div>
            <div style="font-weight:600;font-size:12px;">${p.event}</div>
            <div style="font-size:11px;opacity:0.7;">${p.caption}</div>
          </div>
        </div>`;
      }).join('');

      const popupContent = `
        <div style="font-family:'Space Grotesk',system-ui,sans-serif;color:#fff;min-width:200px;">
          <div style="font-weight:600;margin-bottom:8px;font-size:13px;color:#06b6d4;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg> ${loc.photos[0].location}</div>
          ${photoList}
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'dark-popup',
        maxWidth: 300,
      });
    });
  })();
