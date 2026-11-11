/* ============================================================
   ONNE · Tecnologia em Movimento
   Comportamentos compartilhados do site
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = {
    /* Google Apps Script que grava os leads na planilha do CRM Better. */
    endpoint: "https://script.google.com/macros/s/AKfycbziARCpnk-IMATan3XJfmYcJ8UAnRDUm7Nf-OMlu3n5khmjDleT-6_-wTqCXD84C9YOGA/exec"
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Intro em vídeo (home, 1x por sessão) ---------- */
  var droneIntro = document.querySelector("[data-drone-intro]");
  if (droneIntro && document.documentElement.classList.contains("intro-armed")) {
    if (reduceMotion) {
      document.documentElement.classList.remove("intro-armed");
      droneIntro.hidden = true;
    } else {
      var video = droneIntro.querySelector("[data-intro-video]");
      var introDone = false;
      // Fallback de segurança caso o vídeo não carregue ou não dispare "ended".
      var introFallback = window.setTimeout(function () { finishIntro(false); }, 12000);

      function finishIntro(animateOut) {
        if (introDone) return;
        introDone = true;
        window.clearTimeout(introFallback);
        try { sessionStorage.setItem("onne_intro_seen", "1"); } catch (err) {}
        var hide = function () {
          document.documentElement.classList.remove("intro-armed");
          droneIntro.hidden = true;
          if (video) { try { video.pause(); } catch (err) {} video.removeAttribute("src"); }
        };
        if (animateOut) {
          droneIntro.classList.add("is-leaving");
          window.setTimeout(hide, 240);
        } else {
          hide();
        }
        document.removeEventListener("keydown", introKey);
      }

      function introKey(e) {
        if (e.key === "Escape") finishIntro(true);
      }

      if (video) {
        // Escolhe a fonte pela largura da tela (o atributo media em <source> de vídeo não é confiável).
        var portrait = window.matchMedia("(max-width: 720px), (orientation: portrait) and (max-width: 900px)").matches;
        video.src = portrait
          ? "/assets/video/intro-vertical.mp4"
          : "/assets/video/intro-horizontal.mp4";
        video.muted = true;
        video.addEventListener("ended", function () { finishIntro(false); });
        video.addEventListener("error", function () { finishIntro(false); });
        var play = video.play();
        if (play && typeof play.catch === "function") {
          // Se o autoplay for bloqueado, encerra a intro para não prender o usuário.
          play.catch(function () { finishIntro(false); });
        }
      } else {
        finishIntro(false);
      }

      droneIntro.addEventListener("click", function (e) {
        if (e.target.closest("[data-intro-skip]")) return;
        finishIntro(true);
      });
      var introSkip = droneIntro.querySelector("[data-intro-skip]");
      if (introSkip) introSkip.addEventListener("click", function (e) {
        e.stopPropagation();
        finishIntro(true);
      });
      document.addEventListener("keydown", introKey);
    }
  }

  var INTERESTS = {
    agricultura: {
      label: "Agricultura",
      placeholder: "Ex.: cultura, área em hectares, janela de aplicação, modelos Agras de interesse e se já possui estrutura de apoio."
    },
    enterprise: {
      label: "Enterprise",
      placeholder: "Ex.: tipo de levantamento ou inspeção, área do projeto, sensores necessários (RTK, LiDAR, térmico) e prazo de entrega."
    },
    seguranca: {
      label: "Segurança",
      placeholder: "Ex.: condomínio, indústria ou órgão público, perímetro a monitorar e se a demanda é compra de frota ou operação por contrato."
    },
    criadores: {
      label: "Criadores e Audiovisual",
      placeholder: "Ex.: tipo de conteúdo, nível de experiência com drones, equipamentos que já possui e orçamento previsto."
    },
    consumer: {
      label: "Criadores e Audiovisual",
      placeholder: "Ex.: tipo de conteúdo, nível de experiência com drones, equipamentos que já possui e orçamento previsto."
    },
    mobilidade: {
      label: "Mobilidade Elétrica",
      placeholder: "Ex.: uso diário ou frota, distância média por dia, quantidade de unidades e necessidade de test-ride."
    },
    acessorios: {
      label: "Acessórios e Peças",
      placeholder: "Ex.: modelo do equipamento, peça ou acessório desejado e se precisa apenas da peça ou da troca com mão de obra."
    },
    seminovos: {
      label: "Drones Seminovos",
      placeholder: "Ex.: unidade de interesse (ex.: Agras T40), horas de voo aceitáveis e se deseja reservar ou apenas consultar o laudo."
    },
    treinamentos: {
      label: "Treinamentos",
      placeholder: "Ex.: trilha ou curso de interesse, quantidade de alunos, modalidade (presencial, in-company, online) e período desejado."
    },
    assistencia: {
      label: "Assistência Técnica",
      placeholder: "Ex.: modelo, sintoma apresentado, se o equipamento está em garantia e se deseja agendar triagem presencial."
    },
    especialista: {
      label: "Falar com especialista",
      placeholder: "Conte o que você precisa fazer. A partir da sua necessidade, direcionamos para o especialista da área correta."
    }
  };

  function normalizeInterest(value) {
    var key = String(value || "").toLowerCase().trim();
    if (key === "criadores-e-audiovisual" || key === "audiovisual") key = "criadores";
    if (key === "vigilancia-e-seguranca" || key === "vigilancia") key = "seguranca";
    if (key === "mobilidade-eletrica" || key === "mobilidade") key = "mobilidade";
    if (key === "acessorios-e-pecas") key = "acessorios";
    if (key === "pos-venda" || key === "servicos") key = "assistencia";
    return INTERESTS[key] ? key : "";
  }

  function interestInfo(value) {
    var key = normalizeInterest(value);
    return key ? INTERESTS[key] : null;
  }

  function storeInterest(value) {
    var key = normalizeInterest(value);
    if (!key) return;
    try { sessionStorage.setItem("onne_interest", key); } catch (err) {}
  }

  function readStoredInterest() {
    try { return sessionStorage.getItem("onne_interest") || ""; } catch (err) { return ""; }
  }

  /* ---------- Ano do rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Cabeçalho ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", (window.scrollY || document.documentElement.scrollTop) > 20);
  }
  if (header) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  function closeMobile() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function openMobile() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeMobile();
      else openMobile();
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobile);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobile();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) closeMobile();
    });
  }

  /* ---------- Reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Âncoras ativas ---------- */
  var anchorNav = document.querySelector("[data-anchor-nav]");
  if (anchorNav && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(anchorNav.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      if (id) map[id] = link;
    });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Tabelas roláveis: acesso por teclado ---------- */
  document.querySelectorAll(".table-wrap").forEach(function (el) {
    if (el.hasAttribute("tabindex")) return;
    var caption = el.querySelector("caption");
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", (caption ? caption.textContent.trim() : "Tabela") + " — role horizontalmente para ver todas as colunas");
  });

  /* ---------- Abas ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    function activate(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === tab.getAttribute("aria-controls"));
      });
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        activate(next);
        next.focus();
      });
    });
  });

  /* ---------- Interesse: seleção em formulários ---------- */
  function setFormInterest(form, value) {
    if (!form) return;
    var key = normalizeInterest(value);
    if (!key) return;
    var info = interestInfo(key);
    var select = form.querySelector('select[name="area"]');
    var radios = form.querySelectorAll('input[type="radio"][name="area"]');
    var hidden = form.querySelector('input[type="hidden"][name="area"]');
    if (select) {
      var option = select.querySelector('option[value="' + key + '"]');
      if (option) select.value = key;
    }
    if (radios.length) {
      radios.forEach(function (radio) {
        radio.checked = radio.value === key;
      });
    }
    if (hidden && !select && !radios.length) hidden.value = key;
    var textarea = form.querySelector('textarea[name="mensagem"]');
    if (textarea && info) {
      textarea.setAttribute("placeholder", info.placeholder);
      if (!textarea.dataset.userEdited) textarea.value = "";
    }
    form.setAttribute("data-interest", key);
    var pill = form.querySelector('.interest-pill input[value="' + key + '"]');
    if (pill && pill.type === "radio") pill.checked = true;
  }

  document.querySelectorAll("form[data-interest]").forEach(function (form) {
    if (!form.getAttribute("data-interest")) return;
  });

  var defaultInterest = normalizeInterest(document.body.getAttribute("data-vertical")) || normalizeInterest(readStoredInterest());
  var contactForm = document.querySelector(".lead-form");
  if (contactForm) {
    if (defaultInterest) setFormInterest(contactForm, defaultInterest);
    else {
      var bodyInterest = document.body.getAttribute("data-vertical");
      if (bodyInterest) setFormInterest(contactForm, bodyInterest);
    }
    contactForm.querySelectorAll('textarea[name="mensagem"]').forEach(function (t) {
      t.addEventListener("input", function () { t.dataset.userEdited = "true"; });
    });
  }

  document.querySelectorAll("[data-interest]").forEach(function (el) {
    el.addEventListener("click", function () {
      var value = el.getAttribute("data-interest");
      storeInterest(value);
      var form = document.querySelector(".lead-form");
      if (form && el.getAttribute("href") && el.getAttribute("href").indexOf("/contato") === -1 && el.getAttribute("href").indexOf("formulario") > -1) {
        setFormInterest(form, value);
      }
    });
  });

  document.querySelectorAll(".interest-pill input").forEach(function (input) {
    input.addEventListener("change", function () {
      var form = input.closest("form");
      if (form) setFormInterest(form, input.value);
    });
  });

  /* Fallback: URL ?interesse= */
  try {
    var urlInterest = new URLSearchParams(window.location.search).get("interesse");
    if (urlInterest && contactForm) setFormInterest(contactForm, urlInterest);
  } catch (err) {}

  /* ---------- Formulários ---------- */
  function collectUtm() {
    var utm = { utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };
    var keys = Object.keys(utm);
    function read(target) {
      try {
        var u = new URL(target);
        keys.forEach(function (k) { if (!utm[k]) utm[k] = u.searchParams.get(k) || ""; });
      } catch (err) {}
    }
    read(window.location.href);
    if (!utm.utm_source && document.referrer) read(document.referrer);
    try {
      var saved = sessionStorage.getItem("onne_utm");
      if (saved && !utm.utm_source) {
        var parsed = JSON.parse(saved);
        keys.forEach(function (k) { if (!utm[k]) utm[k] = parsed[k] || ""; });
      }
    } catch (err) {}
    return utm;
  }

  if (!document.querySelector("[data-utm-saved]")) {
    try {
      var utmNow = collectUtm();
      if (utmNow.utm_source || utmNow.utm_campaign) {
        sessionStorage.setItem("onne_utm", JSON.stringify(utmNow));
      }
    } catch (err) {}
  }

  function markField(field, invalid) {
    if (!field) return;
    field.setAttribute("data-invalid", invalid ? "true" : "false");
    var control = field.querySelector("input, select, textarea");
    if (control) control.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  document.querySelectorAll(".lead-form").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var svgCheck = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
    var svgAlert = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 17h.01M10.3 3.9L2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>';

    function setStatus(type, html) {
      if (!status) return;
      status.className = "form-status " + type + " show";
      status.innerHTML = html;
    }
    function clearStatus() {
      if (!status) return;
      status.className = "form-status";
      status.innerHTML = "";
    }

    function validate() {
      var invalid = [];
      form.querySelectorAll("[required]").forEach(function (control) {
        var bad = false;
        if (control.type === "checkbox") bad = !control.checked;
        else bad = !String(control.value || "").trim();
        if (control.type === "email" && String(control.value || "").trim()) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim())) bad = true;
        }
        if (control.type === "radio") {
          var group = form.querySelectorAll('input[type="radio"][name="' + control.name + '"]');
          var any = Array.prototype.some.call(group, function (r) { return r.checked; });
          if (any) return;
        }
        var field = control.closest(".field") || control.closest(".consent");
        markField(field, bad);
        if (control.type === "checkbox") {
          control.setAttribute("aria-invalid", bad ? "true" : "false");
          var err = field ? field.querySelector(".error") : null;
          if (err) err.style.display = bad ? "block" : "none";
        }
        if (bad) invalid.push(control);
      });
      return invalid;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (control) {
      var evt = control.tagName === "SELECT" || control.type === "checkbox" || control.type === "radio" ? "change" : "input";
      control.addEventListener(evt, function () {
        if (control.type === "checkbox") {
          var field = control.closest(".consent");
          if (control.checked && field) {
            field.setAttribute("data-invalid", "false");
            control.setAttribute("aria-invalid", "false");
            var err = field.querySelector(".error");
            if (err) err.style.display = "none";
          }
        } else {
          markField(control.closest(".field"), false);
        }
        if (status && status.classList.contains("error")) clearStatus();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearStatus();
      var invalid = validate();
      if (invalid.length) {
        setStatus("error", svgAlert + "Confira os campos destacados e tente novamente.");
        invalid[0].focus();
        return;
      }

      var data = {};
      new FormData(form).forEach(function (value, key) {
        if (typeof value === "string") data[key] = value;
      });
      var consent = form.querySelector('input[name="consentimento"]');
      data.consentimento = consent && consent.checked ? "sim" : "nao";

      var area = data.area || form.getAttribute("data-interest") || document.body.getAttribute("data-vertical") || "especialista";
      var info = interestInfo(area);
      data.area = normalizeInterest(area) || area;
      data.vertical = info ? info.label : data.area;
      data.origem = window.location.pathname;
      data.pagina = document.title;

      var utm = collectUtm();
      Object.keys(utm).forEach(function (k) { data[k] = utm[k]; });

      var submitBtn = form.querySelector(".submit");
      if (submitBtn) submitBtn.disabled = true;
      setStatus("success", '<span class="spinner" aria-hidden="true"></span>Enviando seu contato…');

      var endpoint = form.getAttribute("data-endpoint") || CONFIG.endpoint;
      var verticalLabel = data.vertical;

      function finishOk() {
        try { sessionStorage.setItem("onne_thank_vertical", verticalLabel); } catch (err) {}
        storeInterest(data.area);
        if (submitBtn) submitBtn.disabled = false;
        setStatus("success", svgCheck + "Recebido. Estamos direcionando seu contato para a fila de " + verticalLabel + ".");
        window.setTimeout(function () {
          window.location.href = "/obrigado/";
        }, 550);
      }
      function finishErr() {
        if (submitBtn) submitBtn.disabled = false;
        setStatus("error", svgAlert + "Não foi possível enviar agora. Tente novamente ou fale com a equipe pela página de contato.");
      }

      if (!endpoint) {
        window.setTimeout(finishOk, 500);
        return;
      }

      var qs = Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k] == null ? "" : data[k]);
      }).join("&");

      fetch(endpoint + (endpoint.indexOf("?") > -1 ? "&" : "?") + qs, { method: "GET", mode: "cors" })
        .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.text(); })
        .then(function (txt) { if (/success/i.test(txt)) finishOk(); else finishErr(); })
        .catch(finishErr);
    });
  });

  /* ---------- Página de obrigado ---------- */
  var thankVertical = document.querySelector("[data-thank-vertical]");
  if (thankVertical) {
    var value = "";
    try { value = new URLSearchParams(window.location.search).get("v") || ""; } catch (err) {}
    if (!value) value = readStoredInterest();
    var tInfo = interestInfo(value);
    thankVertical.textContent = tInfo ? tInfo.label : "nossa equipe";
    var thankLink = document.querySelector("[data-thank-link]");
    if (thankLink && tInfo) {
      thankLink.setAttribute("href", "/contato/?interesse=" + encodeURIComponent(normalizeInterest(value)) + "#formulario");
    }
  }
})();
