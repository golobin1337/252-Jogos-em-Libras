// ===== LINKS DE CHECKOUT =====
// Substitua pelos links da sua plataforma (Hotmart, Kiwify, Eduzz etc.)
const CHECKOUT_LINKS = {
  basico: "https://pay.wiapy.com/J3o6i8aOSdpO",
  completo: "https://pay.wiapy.com/FDiD1xL5q7iN",
};

document.querySelectorAll("[data-checkout]").forEach((btn) => {
  const url = CHECKOUT_LINKS[btn.dataset.checkout];
  if (url && url !== "#") btn.href = url;
});

// ===== CONTADOR DA OFERTA (15 min, reinicia por visitante) =====
(function countdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const DURATION = 15 * 60 * 1000;
  let end;
  try {
    end = Number(sessionStorage.getItem("offerEnd"));
    if (!end || end < Date.now()) {
      end = Date.now() + DURATION;
      sessionStorage.setItem("offerEnd", end);
    }
  } catch (e) {
    end = Date.now() + DURATION;
  }

  const tick = () => {
    const left = Math.max(0, end - Date.now());
    const m = String(Math.floor(left / 60000)).padStart(2, "0");
    const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
    el.textContent = `${m}:${s}`;
    if (left > 0) setTimeout(tick, 1000);
  };
  tick();
})();

// ===== CARROSSÉIS INFINITOS =====
// Duplica os slides até preencher a tela e depois duplica o conjunto,
// assim a animação de -50% volta ao início sem "pulo".
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const originals = Array.from(track.children);
  if (!originals.length) return;

  const minWidth = Math.max(window.innerWidth, carousel.offsetWidth) + 300;
  while (track.scrollWidth < minWidth) {
    originals.forEach((s) => track.appendChild(s.cloneNode(true)));
  }
  Array.from(track.children).forEach((s) => {
    const clone = s.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  // velocidade constante (px/s) independente da quantidade de slides
  const speed = Number(carousel.dataset.speed) || 40;
  track.style.setProperty("--duration", `${track.scrollWidth / 2 / speed}s`);
});

// ===== FAQ (acordeão) =====
document.querySelectorAll(".faq__item").forEach((item) => {
  const btn = item.querySelector(".faq__q");
  const answer = item.querySelector(".faq__a");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq__item.is-open").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      other.querySelector(".faq__a").style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// ===== ANIMAÇÃO AO ROLAR =====
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ===== BARRA FIXA DA OFERTA =====
// Aparece quando o card do Plano Básico (R$ 10) entra na tela e continua depois dele.
(function offerBar() {
  const bar = document.getElementById("offerBar");
  const basic = document.querySelector(".plan:not(.plan--featured)");
  if (!bar || !basic) return;

  const update = () => {
    const show = basic.getBoundingClientRect().top < window.innerHeight * 0.6;
    bar.classList.toggle("is-visible", show);
    bar.setAttribute("aria-hidden", String(!show));
    bar.querySelector("a").tabIndex = show ? 0 : -1;
    document.body.classList.toggle("has-offer-bar", show);
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// ===== ANO NO RODAPÉ =====
document.getElementById("year").textContent = new Date().getFullYear();
