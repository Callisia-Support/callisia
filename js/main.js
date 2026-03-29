document.addEventListener("DOMContentLoaded", () => {
  // CONFIGURAÇÕES E SELETORES
  const repoName = "";
  const path = window.location.pathname;
  const currentLang = path.includes('/pt/') ? 'pt' : 'en';

  const elements = {
    linkPrivacy: document.getElementById('link-privacy'),
    linkTerms: document.getElementById('link-terms'),
    langBtn: document.getElementById('langBtn'),
    langMenu: document.getElementById('langMenu'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebarClose: document.getElementById('sidebarClose'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    header: document.querySelector('.top-header')
  };

  const mobileQuery = window.matchMedia('(max-width: 900px)');

  // TRADUÇÃO E LINKS
  if (elements.linkPrivacy && elements.linkTerms) {
    elements.linkPrivacy.href = `${repoName}/privacy-policy/${currentLang}/`;
    elements.linkTerms.href = `${repoName}/terms-of-service/${currentLang}/`;

    const isPrivacy = path.includes('privacy-policy');
    elements.linkPrivacy.classList.toggle('active', isPrivacy);
    elements.linkTerms.classList.toggle('active', !isPrivacy);
  }

  // I18n
  fetch(`${repoName}/locales/${currentLang}.json`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) el.innerText = data[key];
      });
    })
    .catch(() => console.warn(`Aviso: Arquivo de idioma (${currentLang}) não encontrado.`));

  // SELETOR DE IDIOMAS
  if (elements.langBtn && elements.langMenu) {
    elements.langBtn.innerHTML = `🌐 ${currentLang.toUpperCase()}`;

    elements.langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.langMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => elements.langMenu.classList.remove('show'));
  }

  // SIDEBAR
  if (elements.sidebar && elements.sidebarToggle) {

    const setSidebarOpen = (isOpen) => {
      document.body.classList.toggle('sidebar-open', isOpen);
      elements.sidebarToggle.setAttribute('aria-expanded', String(isOpen));
    };

    if (elements.header) {
      const headerObserver = new IntersectionObserver((entries) => {
        const isVisible = entries[0].isIntersecting;

        if (!isVisible && mobileQuery.matches) {
          elements.sidebarToggle.classList.add('floating');
        } else {
          elements.sidebarToggle.classList.remove('floating');
        }
      }, { threshold: 0 }); // Dispara assim que o primeiro pixel do header sai da tela

      headerObserver.observe(elements.header);
    }

    // Eventos da Sidebar

    const setSidebarState = () => {
      const isMobile = mobileQuery.matches;

      if (isMobile) {

        document.body.classList.toggle('sidebar-open');
        document.body.classList.remove('sidebar-closed');
      } else {

        document.body.classList.toggle('sidebar-closed');
        document.body.classList.remove('sidebar-open');
      }
    };

    elements.sidebarToggle.addEventListener('click', setSidebarState);

    [elements.sidebarClose, elements.sidebarBackdrop].forEach(el => {
      if (el) {
        el.addEventListener('click', () => {
          document.body.classList.remove('sidebar-open');
          elements.sidebarToggle.setAttribute('aria-expanded', 'false');
        });
      }
    });

    elements.sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileQuery.matches) {
          document.body.classList.remove('sidebar-open');
        }
      });
    });

    mobileQuery.addEventListener('change', (e) => {

      document.body.classList.remove('sidebar-open', 'sidebar-closed');
      elements.sidebarToggle.classList.remove('floating');
    });

    mobileQuery.addEventListener('change', (e) => {
      if (!e.matches) {
        document.body.classList.remove('sidebar-open');
        elements.sidebarToggle.setAttribute('aria-expanded', 'true');
        elements.sidebarToggle.classList.remove('floating');
      } else {
        setSidebarOpen(false);
      }
    });
  }
});

// Função global para troca de idioma
function switchLang(newLang) {
  const currentPath = window.location.pathname;

  const newPath = currentPath.replace(/\/(pt|en)\//, `/${newLang}/`);
  if (newPath !== currentPath) {
    window.location.href = newPath;
  }
}