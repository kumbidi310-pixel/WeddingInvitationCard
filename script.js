
(() => {
  const $ = (id) => document.getElementById(id);

  const nav = $('nav');
  const menuToggle = $('menuToggle');

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  $('revealDate').addEventListener('click', () => {
    $('revealDate').classList.add('revealed');
    $('scratchCard').classList.add('date-revealed');
  });

  // Wedding: 21 November 2026 at 4:00 PM IST.
  const weddingTime = new Date('2026-11-21T16:00:00+05:30').getTime();

  function updateCountdown() {
    const diff = weddingTime - Date.now();

    if (diff <= 0) {
      ['days', 'hours', 'minutes', 'seconds'].forEach(
        id => $(id).textContent = '00'
      );
      $('countdownMessage').textContent =
        'Today begins a beautiful forever. Thank you for celebrating with us!';
      return;
    }

    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor(diff % 86400000 / 3600000),
      minutes: Math.floor(diff % 3600000 / 60000),
      seconds: Math.floor(diff % 60000 / 1000)
    };

    Object.entries(values).forEach(([id, value]) => {
      $(id).textContent = String(value).padStart(2, '0');
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // GALLERY: Load the three photos from the assets folder.
  const lightbox = $('lightbox');
  const closeButton = $('closeLightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');
  let lastFocus = null;

  const galleryPhotos = [
    'assets/photo-1.jpg',
    'assets/photo-2.jpg',
    'assets/photo-3.jpg'
  ];

  // Create the popup image if it does not already exist in index.html.
  let lightboxImage = $('lightboxImage');

  if (!lightboxImage) {
    lightboxImage = document.createElement('img');
    lightboxImage.id = 'lightboxImage';
    lightboxImage.alt = 'Wedding photograph';
    lightboxContent.prepend(lightboxImage);
  }

  const photoLabels = ['I', 'II', 'III'];

  function applyPhoto(url, tile) {
    const image = new Image();

    image.onload = () => {
      tile.style.backgroundImage =
        `linear-gradient(0deg, #261a18a8, transparent 60%), url("${url}")`;
      tile.classList.add('has-photo');
    };

    image.onerror = () => {
      console.error('Gallery image could not be loaded:', url);
    };

    image.src = url;
  }

  document.querySelectorAll('.gallery-tile').forEach((tile, index) => {
    const photoUrl = galleryPhotos[index];

    if (!photoUrl) return;

    applyPhoto(photoUrl, tile);

    tile.addEventListener('click', () => {
      lastFocus = tile;

      // Display the selected photograph in the popup.
      lightboxImage.src = photoUrl;
      lightboxImage.alt = tile.dataset.caption || 'Wedding photograph';

      $('lightboxLabel').textContent =
        `PHOTO ${photoLabels[index]}`;

      $('lightboxCaption').textContent =
        tile.dataset.caption || 'A beautiful memory';

      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.style.overflow = '';

    if (lastFocus) lastFocus.focus();
  }

  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // WEDDING MUSIC
  const audio = $('weddingAudio');
  const musicToggle = $('musicToggle');

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.textContent = 'Ⅱ';
        musicToggle.setAttribute('aria-label', 'Pause wedding music');
        $('musicStatus').textContent = 'Now playing';
      } catch (error) {
        $('musicStatus').textContent =
          'Add a supported MP3 to assets/wedding-song.mp3';
      }
    } else {
      audio.pause();
      musicToggle.textContent = '▶';
      musicToggle.setAttribute('aria-label', 'Play wedding music');
      $('musicStatus').textContent = 'Paused';
    }
  });

  audio.addEventListener('ended', () => {
    musicToggle.textContent = '▶';
    musicToggle.setAttribute('aria-label', 'Play wedding music');
    $('musicStatus').textContent = 'Playback finished';
  });

  // GUESTBOOK
  const form = $('guestForm');
  const nameInput = $('guestName');
  const noteInput = $('guestNote');
  const notesBox = $('guestNotes');
  const STORAGE_KEY = 'rubil-ruby-guestbook-v1';
  let memoryNotes = [];

  function readStoredNotes() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : memoryNotes;
    } catch {
      return memoryNotes;
    }
  }

  $('writeNote').addEventListener('click', () => {
    form.hidden = false;
    $('thankYou').hidden = true;
    // Use a small delay so mobile browsers finish laying out the newly shown form.
    requestAnimationFrame(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      try { nameInput.focus({ preventScroll: true }); }
      catch { nameInput.focus(); }
    });
  });

  $('cancelNote').addEventListener('click', () => {
    form.reset();
    form.hidden = true;
    $('formError').textContent = '';
    $('charCount').textContent = '0 / 500';
  });

  noteInput.addEventListener('input', () => {
    $('charCount').textContent = `${noteInput.value.length} / 500`;
  });

  function loadNotes() {
    try {
      const parsed = readStoredNotes();

      return Array.isArray(parsed)
        ? parsed.filter(n =>
            n && typeof n.name === 'string' &&
            typeof n.note === 'string'
          )
        : [];
    } catch {
      return [];
    }
  }

  function renderNotes() {
    notesBox.replaceChildren();
    const notes = loadNotes();

    if (!notes.length) {
      const p = document.createElement('p');
      p.className = 'storage-note';
      p.textContent = 'Be the first to leave us a little love.';
      notesBox.append(p);
      return;
    }

    notes.slice().reverse().forEach(n => {
      const card = document.createElement('article');
      card.className = 'guest-note';

      const name = document.createElement('h3');
      name.className = 'note-name';
      name.textContent = n.name;

      const msg = document.createElement('p');
      msg.textContent = n.note;

      const date = document.createElement('small');
      date.textContent = n.date || 'With love';

      card.append(name, msg, date);
      notesBox.append(card);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    $('formError').textContent = '';

    const name = nameInput.value.trim();
    const note = noteInput.value.trim();

    if (!name || !note) {
      $('formError').textContent = 'Please complete both fields.';
      return;
    }

    if (name.length > 60 || note.length > 500) {
      $('formError').textContent = 'Please shorten your message.';
      return;
    }

    const notes = loadNotes();

    notes.push({
      name,
      note,
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    });

    try {
      memoryNotes = notes;
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* Keep the note for this page session if storage is blocked. */ }
    } catch {
      $('formError').textContent =
        'This browser could not save the note. Please check storage settings.';
      return;
    }

    form.reset();
    $('charCount').textContent = '0 / 500';
    form.hidden = true;
    $('thankYou').hidden = false;
    renderNotes();

    $('thankYou').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });

  renderNotes();
})();
