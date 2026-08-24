document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Theme song: plays once on first entry ---------- */
  const themeAudio = document.getElementById('theme-audio');

  function removeResumeListeners() {
    document.removeEventListener('click', resumeOnInteraction);
    document.removeEventListener('keydown', resumeOnInteraction);
    document.removeEventListener('scroll', resumeOnInteraction);
  }

  function startThemeSong() {
    themeAudio.play().then(removeResumeListeners).catch(() => {});
  }

  function resumeOnInteraction() {
    startThemeSong();
  }

  startThemeSong();

  document.addEventListener('click', resumeOnInteraction);
  document.addEventListener('keydown', resumeOnInteraction);
  document.addEventListener('scroll', resumeOnInteraction, { once: true, passive: true });

  /* ---------- Stats counter animation ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ---------- Fan Love Wall: load more ---------- */
  const commentsMore = document.getElementById('comments-more');
  const commentsToggle = document.getElementById('comments-toggle');

  commentsToggle.addEventListener('click', () => {
    const isHidden = commentsMore.classList.toggle('hidden');
    commentsToggle.textContent = isHidden ? 'Show More Fan Love' : 'Show Less';
    if (isHidden) {
      commentsToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* ---------- Gallery ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const allItems = Array.from(galleryItems);
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = allItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.remove('hidden');
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
  }

  function showRelative(offset) {
    currentIndex = (currentIndex + offset + allItems.length) % allItems.length;
    openLightbox(currentIndex);
  }

  allItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showRelative(-1));
  lightboxNext.addEventListener('click', () => showRelative(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });

  /* ---------- Fun fact generator ---------- */
  const facts = [
    "LeBron made his NBA debut at just 18 years old on October 29, 2003.",
    "He's the only player in NBA history with 40,000+ points, 11,000+ rebounds, and 11,000+ assists.",
    "LeBron won back-to-back championships with the Miami Heat in 2012 and 2013.",
    "He delivered Cleveland's first major sports title in 52 years with the 2016 championship.",
    "LeBron has played in more NBA Finals than almost any player in league history.",
    "He founded the LeBron James Family Foundation, which runs the I PROMISE School in Akron, Ohio.",
    "LeBron's full name is LeBron Raymone James Sr.",
    "He became the youngest player ever to reach 30,000 career points.",
    "LeBron has been named to more All-NBA Teams than any other player in NBA history.",
    "He's known as much for his basketball IQ and passing vision as for his scoring."
  ];

  const factBtn = document.getElementById('fact-btn');
  const factOutput = document.getElementById('fact-output');
  let lastFactIndex = -1;

  factBtn.addEventListener('click', () => {
    let index;
    do {
      index = Math.floor(Math.random() * facts.length);
    } while (index === lastFactIndex && facts.length > 1);
    lastFactIndex = index;
    factOutput.textContent = facts[index];
  });

  /* ---------- Quiz ---------- */
  const quizQuestions = [
    {
      question: "What number did LeBron James wear for most of his career?",
      options: ["23", "6", "8", "3"],
      answer: 0
    },
    {
      question: "Which team drafted LeBron James #1 overall in 2003?",
      options: ["Miami Heat", "Los Angeles Lakers", "Cleveland Cavaliers", "Chicago Bulls"],
      answer: 2
    },
    {
      question: "How many NBA championships has LeBron won?",
      options: ["2", "3", "4", "5"],
      answer: 2
    },
    {
      question: "In what city was LeBron James born?",
      options: ["Akron, Ohio", "Cleveland, Ohio", "Chicago, Illinois", "Detroit, Michigan"],
      answer: 0
    },
    {
      question: "Which record did LeBron break in February 2023?",
      options: [
        "Most career assists",
        "NBA all-time leading scorer",
        "Most three-pointers made",
        "Most career rebounds"
      ],
      answer: 1
    }
  ];

  const quizQuestionEl = document.getElementById('quiz-question');
  const quizOptionsEl = document.getElementById('quiz-options');
  const quizCurrentEl = document.getElementById('quiz-current');
  const quizTotalEl = document.getElementById('quiz-total');
  const quizQuestionBox = document.getElementById('quiz-question-box');
  const quizResultEl = document.getElementById('quiz-result');
  const quizScoreTextEl = document.getElementById('quiz-score-text');
  const quizRestartBtn = document.getElementById('quiz-restart');

  let quizIndex = 0;
  let quizScore = 0;

  quizTotalEl.textContent = quizQuestions.length;

  function loadQuestion() {
    const q = quizQuestions[quizIndex];
    quizCurrentEl.textContent = quizIndex + 1;
    quizQuestionEl.textContent = q.question;
    quizOptionsEl.innerHTML = '';

    q.options.forEach((optionText, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = optionText;
      btn.addEventListener('click', () => selectAnswer(i));
      quizOptionsEl.appendChild(btn);
    });
  }

  function selectAnswer(selectedIndex) {
    const q = quizQuestions[quizIndex];
    const optionButtons = quizOptionsEl.querySelectorAll('.quiz-option');

    optionButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('correct');
      else if (i === selectedIndex) btn.classList.add('incorrect');
    });

    if (selectedIndex === q.answer) quizScore++;

    setTimeout(() => {
      quizIndex++;
      if (quizIndex < quizQuestions.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }, 900);
  }

  function showResult() {
    quizQuestionBox.classList.add('hidden');
    quizResultEl.classList.remove('hidden');
    quizScoreTextEl.textContent = `You scored ${quizScore} out of ${quizQuestions.length}.`;
  }

  function restartQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizResultEl.classList.add('hidden');
    quizQuestionBox.classList.remove('hidden');
    loadQuestion();
  }

  quizRestartBtn.addEventListener('click', restartQuiz);

  loadQuestion();

});
