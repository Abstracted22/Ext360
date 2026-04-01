document.addEventListener('DOMContentLoaded', () => {
    // 0. Language Switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    
    const setLanguage = (lang) => {
        if (!translations[lang]) return;
        localStorage.setItem('extincion_lang', lang);
        
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (placeholders[lang] && placeholders[lang][key]) {
                el.setAttribute('placeholder', placeholders[lang][key]);
            }
        });
        
        // Update legal links
        const legalLnk = document.querySelector('a[href^="aviso-legal"]');
        const privLnk = document.querySelector('a[href^="politica-privacidad"]');
        const cookLnk = document.querySelector('a[href^="politica-cookies"]');
        if(legalLnk) legalLnk.href = lang === 'en' ? 'aviso-legal-en.html' : 'aviso-legal.html';
        if(privLnk) privLnk.href = lang === 'en' ? 'politica-privacidad-en.html' : 'politica-privacidad.html';
        if(cookLnk) cookLnk.href = lang === 'en' ? 'politica-cookies-en.html' : 'politica-cookies.html';
    };

    const savedLang = localStorage.getItem('extincion_lang') || 'es';
    setLanguage(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // 1. Sticky Header
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const fadeUpElements = document.querySelectorAll('.fade-in-up');
    const fadeLeftElements = document.querySelectorAll('.fade-in-left');
    const fadeRightElements = document.querySelectorAll('.fade-in-right');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Al 15% de visibilidad se dispara
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Solo animar la primera vez
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => fadeInObserver.observe(el));
    fadeLeftElements.forEach(el => fadeInObserver.observe(el));
    fadeRightElements.forEach(el => fadeInObserver.observe(el));
    
    // 3. Form submit via FormSubmit AJAX
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            
            const formData = new FormData(contactForm);

            fetch("https://formsubmit.co/ajax/administracion@extincion360.com", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                btn.innerText = '¡Mensaje Enviado!';
                btn.style.background = '#4CAF50';
                btn.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                btn.style.color = '#fff';
                btn.style.opacity = '1';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                }, 4000);
            })
            .catch(error => {
                btn.innerText = 'Error al enviar';
                btn.style.background = '#f44336';
                btn.style.opacity = '1';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                }, 3000);
            });
        });
    }
});
