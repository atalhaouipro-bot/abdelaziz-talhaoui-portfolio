const D = window.DATA;
const S = D.settings;
const P = D.profile;

let L = localStorage.getItem("lang") || S.lang;

/* =========================================================
   TRANSLATION / HELPERS
========================================================= */

const T = x => {
  if (x && typeof x === "object" && "fr" in x) {
    return x[L];
  }
  return x;
};

const U = {
  fr: {
    nav: [
      "Parcours",
      "Expertises",
      "Réalisations",
      "Recherche",
      "FORMA LAB",
      "Contact"
    ],

    c1: "Découvrir mon parcours",
    c2: "Voir mes réalisations",

    loop: "Ma démarche",
    feat: "Projets",
    all: "Tous",

    ctx: "Contexte",
    need: "Besoin",
    goal: "Objectif",
    role: "Mon rôle",
    app: "Démarche",
    del: "Livrables",
    tools: "Outils",
    res: "Résultats",
    imp: "Impact",
    link: "Lien",

    back: "← Réalisations",

    impt: "Résultats",
    dates: "Dates",
    resp: "Responsabilités",
    proj: "Projets",
    ach: "Réalisations",

    cv: "Télécharger mon CV",
    thesis: "Mémoire",
    q: "Problématique",
    cert: "Certifications",
    pub: "Publications",
    talks: "Conférences",

    about: "À propos",
    vis: "Vision",
    met: "Méthode",
    st: "Statut",

    productions: "Productions",
    production: "Production pédagogique",
    participantPack: "Pack participant",
    trainerPack: "Pack formateur",
    evaluation: "Évaluation",
    frameworks: "Référentiels",

    methodology: "Méthodologie",
    digital: "Digital Learning",
    ai: "Intelligence artificielle",
    analysis: "Analyse des données",
    collaboration: "Collaboration",

    mail: "Écrire",
    send: "Envoyer",
    yt: "Chaîne YouTube",

    contactTitle: "Travaillons ensemble",
    contactText:
      "Vous souhaitez échanger autour d’un projet de formation, d’ingénierie pédagogique ou d’évaluation ?",
    email: "Email professionnel",
    linkedin: "Profil LinkedIn",

    draft:
      "MODE BROUILLON — les champs [À COMPLÉTER] sont masqués en ligne"
  },

  en: {
    nav: [
      "Background",
      "Expertise",
      "Work",
      "Research",
      "FORMA LAB",
      "Contact"
    ],

    c1: "Explore my background",
    c2: "See my work",

    loop: "My approach",
    feat: "Projects",
    all: "All",

    ctx: "Context",
    need: "Need",
    goal: "Goal",
    role: "My role",
    app: "Approach",
    del: "Deliverables",
    tools: "Tools",
    res: "Results",
    imp: "Impact",
    link: "Link",

    back: "← Work",

    impt: "Results",
    dates: "Dates",
    resp: "Responsibilities",
    proj: "Projects",
    ach: "Achievements",

    cv: "Download my CV",
    thesis: "Thesis",
    q: "Research question",
    cert: "Certifications",
    pub: "Publications",
    talks: "Talks",

    about: "About",
    vis: "Vision",
    met: "Method",
    st: "Status",

    productions: "Outputs",
    production: "Learning content",
    participantPack: "Participant pack",
    trainerPack: "Trainer pack",
    evaluation: "Assessment",
    frameworks: "Competency frameworks",

    methodology: "Methodology",
    digital: "Digital Learning",
    ai: "Artificial Intelligence",
    analysis: "Data analysis",
    collaboration: "Collaboration",

    mail: "Write",
    send: "Send",
    yt: "YouTube channel",

    contactTitle: "Let's work together",
    contactText:
      "Would you like to discuss a project related to training, instructional design or evaluation?",
    email: "Professional email",
    linkedin: "LinkedIn profile",

    draft:
      "DRAFT MODE — [À COMPLÉTER] fields are hidden online"
  }
};

const u = key => U[L][key];

const list = value => {
  const v = T(value);

  if (!v) return [];

  if (Array.isArray(v)) {
    return v.filter(Boolean);
  }

  return [v];
};

const val = value => {
  const v = T(value);

  if (!v) {
    return S.draft
      ? '<span class="tbd">[À COMPLÉTER]</span>'
      : "";
  }

  return Array.isArray(v)
    ? v.filter(Boolean).join(" · ")
    : v;
};

const cat = id => {
  const found = D.categories.find(c => c.id === id);
  return found ? T(found.n) : id;
};


/* =========================================================
   CONTENT BLOCKS
========================================================= */

const block = (label, value) => {
  const v = T(value);

  if (!v && !S.draft) return "";

  return `
    <div class="b">
      <h4>${label}</h4>
      ${
        Array.isArray(v)
          ? `<ul>${v
              .filter(Boolean)
              .map(item => `<li>${item}</li>`)
              .join("")}</ul>`
          : `<p>${val(value)}</p>`
      }
    </div>
  `;
};


const listBlock = (label, value) => {
  const items = list(value);

  if (!items.length && !S.draft) return "";

  return `
    <div class="b">
      <h4>${label}</h4>
      <ul>
        ${
          items.length
            ? items.map(item => `<li>${item}</li>`).join("")
            : `<li>${val(value)}</li>`
        }
      </ul>
    </div>
  `;
};


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const stats = achievements =>
  achievements
    .filter(item => item.v !== "" || S.draft)
    .map(
      item => `
        <div>
          <b>${item.v === "" ? val("") : item.v}</b>
          <span>${T(item.l)}</span>
        </div>
      `
    )
    .join("");


/* =========================================================
   APPROACH LOOP
========================================================= */

const loop = () => `
  <div class="loop">
    ${D.loop
      .map(
        (step, index) => `
          <a href="#/realisations/f:${step.cat}">
            <small>0${index + 1}</small>
            ${T(step.k)}
          </a>
        `
      )
      .join("")}
  </div>
`;


/* =========================================================
   PROJECT CARD
========================================================= */

const card = project => `
  <a class="card rv" href="#/realisations/${project.id}">
    <span class="tag">
      ${project.cat.map(cat).join(" · ")}
    </span>

    <h3>${T(project.title)}</h3>

    <p>${T(project.context)}</p>

    <span class="project-more">
      ${L === "fr" ? "Voir le projet →" : "View project →"}
    </span>
  </a>
`;


/* =========================================================
   PROJECT DETAIL
========================================================= */

const projectPage = project => `
  <div class="page">
    <div class="w">

      <a class="back" href="#/realisations">
        ${u("back")}
      </a>

      <div class="project-head">

        <p class="title">
          ${project.cat.map(cat).join(" · ")}
        </p>

        <h1>${T(project.title)}</h1>

        ${
          T(project.context)
            ? `<p class="lead">${T(project.context)}</p>`
            : ""
        }

      </div>

      <div class="project-content">

        ${block(u("need"), project.need)}

        ${block(u("goal"), project.goal)}

        ${block(u("role"), project.role)}

        ${block(u("app"), project.approach)}

        ${listBlock(u("del"), project.deliverables)}

        ${block(u("tools"), project.tools)}

        ${block(u("res"), project.results)}

        ${block(u("imp"), project.impact)}

        ${
          project.link
            ? `
              <div class="project-link">
                <a class="btn o"
                   href="${project.link}"
                   target="_blank"
                   rel="noopener">
                   ${u("link")} →
                </a>
              </div>
            `
            : ""
        }

      </div>

    </div>
  </div>
`;


/* =========================================================
   PRODUCTIONS
========================================================= */

const productionsSection = () => {
  const p = D.productions;

  if (!p) return "";

  return `
    <section class="subsection">

      <h2>${u("productions")}</h2>

      <div class="grid">

        ${block(u("production"), p.modules)}

        ${block(u("participantPack"), p.participantPack)}

        ${block(u("trainerPack"), p.trainerPack)}

        ${block(u("evaluation"), p.evaluation)}

        ${block(u("frameworks"), p.frameworks)}

      </div>

    </section>
  `;
};


/* =========================================================
   TOOLS
========================================================= */

const toolsSection = () => {
  const t = D.tools;

  if (!t) return "";

  return `
    <section class="subsection">

      <h2>${u("tools")}</h2>

      <div class="grid">

        ${block(u("production"), t.production)}

        ${block(u("digital"), t.digital)}

        ${block(u("ai"), t.ai)}

        ${block(u("analysis"), t.analysis)}

        ${block(u("collaboration"), t.collaboration)}

      </div>

    </section>
  `;
};


/* =========================================================
   PAGES
========================================================= */

const pages = {


  /* -------------------------------------------------------
     HOME
  ------------------------------------------------------- */

  home: () => `
    <section class="hero">

      <div class="w">

        <p class="title">${T(P.title)}</p>

        <h1>${T(P.tagline)}</h1>

        <p class="lead">${T(P.sub)}</p>

        <div class="hero-actions">

          <a class="btn" href="#/parcours">
            ${u("c1")}
          </a>

          <a class="btn o" href="#/realisations">
            ${u("c2")}
          </a>

        </div>

      </div>

    </section>


    <section>

      <div class="w">

        <h2>${u("loop")}</h2>

        ${loop()}

      </div>

    </section>


    <section>

      <div class="w">

        <h2>${u("ach")}</h2>

        <div class="stats">
          ${stats(D.achievements)}
        </div>

      </div>

    </section>


    <section>

      <div class="w">

        <h2>${u("feat")}</h2>

        <div class="grid">

          ${D.projects.map(card).join("")}

        </div>

      </div>

    </section>
  `,


  /* -------------------------------------------------------
     PARCOURS
  ------------------------------------------------------- */

  parcours: () => `
    <div class="page">

      <div class="w">

        <h1>${u("about")}</h1>

        <div class="about-content">

          ${P.about
            .filter(item => T(item) || S.draft)
            .map(item => `
              <p class="lead">${val(item)}</p>
            `)
            .join("")}

        </div>


        ${block(u("vis"), P.vision)}

        ${block(u("met"), P.method)}


        <h2 class="section-title">
          ${u("nav")[0]}
        </h2>


        <div class="experience-list">

          ${D.experiences
            .map(
              experience => `
                <details open>

                  <summary>
                    ${T(experience.role)}
                    <span>— ${experience.org}</span>
                  </summary>

                  ${block(u("dates"), experience.dates)}

                  ${block(u("ctx"), experience.context)}

                  ${listBlock(
                    u("resp"),
                    experience.resp
                  )}

                  ${listBlock(
                    u("proj"),
                    experience.projects
                  )}

                  ${listBlock(
                    u("ach"),
                    experience.achievements
                  )}

                  ${block(
                    u("imp"),
                    experience.impact
                  )}

                </details>
              `
            )
            .join("")}

        </div>


        ${productionsSection()}

        ${toolsSection()}

      </div>

    </div>
  `,


  /* -------------------------------------------------------
     EXPERTISES
  ------------------------------------------------------- */

  expertises: () => `
    <div class="page">

      <div class="w">

        <h1>${u("nav")[1]}</h1>

        <div class="grid">

          ${D.expertises
            .map(
              expertise => `
                <div class="card rv">

                  <h3>${T(expertise.n)}</h3>

                  <ul>
                    ${list(expertise.items)
                      .map(item => `<li>${item}</li>`)
                      .join("")}
                  </ul>

                  ${
                    expertise.proof
                      ? `
                        <p class="tag proof">
                          <a href="#/realisations/${expertise.proof}">
                            → ${
                              T(
                                D.projects.find(
                                  project =>
                                    project.id ===
                                    expertise.proof
                                ).title
                              )
                            }
                          </a>
                        </p>
                      `
                      : ""
                  }

                </div>
              `
            )
            .join("")}

        </div>

      </div>

    </div>
  `,


  /* -------------------------------------------------------
     REALISATIONS
  ------------------------------------------------------- */

  realisations: argument => {

    const filter =
      argument && argument.startsWith("f:")
        ? argument.slice(2)
        : "";

    const project =
      D.projects.find(item => item.id === argument);

    if (project) {
      return projectPage(project);
    }

    return `
      <div class="page">

        <div class="w">

          <h1>${u("nav")[2]}</h1>

          <div class="filters" role="group">

            ${
              ["", ...D.categories.map(c => c.id)]
                .map(
                  id => `
                    <button
                      data-f="${id}"
                      class="${id === filter ? "on" : ""}">
                      ${id ? cat(id) : u("all")}
                    </button>
                  `
                )
                .join("")
            }

          </div>


          <div class="grid" id="pg">

            ${D.projects
              .filter(
                project =>
                  !filter ||
                  project.cat.includes(filter)
              )
              .map(card)
              .join("")}

          </div>

        </div>

      </div>
    `;
  },


  /* -------------------------------------------------------
     RECHERCHE
  ------------------------------------------------------- */

  recherche: () => {

    const r = D.research;

    return `
      <div class="page">

        <div class="w">

          <h1>${u("nav")[3]}</h1>


          <div class="research-intro">

            ${block("Master", r.education)}

            ${block(u("st"), r.status)}

            ${block(u("thesis"), r.thesis)}

            ${block(u("q"), r.question)}

          </div>


          <a class="btn o" href="#/realisations/memoire">
            → ${u("thesis")}
          </a>


          <section class="subsection">

            <h2>${u("cert")}</h2>

            <div class="certifications">

              ${list(r.certifications)
                .map(
                  certification => `
                    <div class="cert-item">
                      <span class="cert-mark">✓</span>
                      <span>${certification}</span>
                    </div>
                  `
                )
                .join("")}

            </div>

          </section>


          ${block(u("pub"), r.publications)}

          ${
            T(r.talks)
              ? block(u("talks"), r.talks)
              : ""
          }

        </div>

      </div>
    `;
  },


  /* -------------------------------------------------------
     FORMA LAB
  ------------------------------------------------------- */

  "forma-lab": () => {

    const f = D.formalab;

    return `
      <div class="page">

        <div class="w">

          <p class="title">FORMA LAB</p>

          <h1>${T(f.sig)}</h1>

          <p class="lead">${T(f.desc)}</p>


          ${
            f.youtube
              ? `
                <a
                  class="btn"
                  href="${f.youtube}"
                  target="_blank"
                  rel="noopener">
                  ${u("yt")} ↗
                </a>
              `
              : ""
          }


          ${
            f.items && f.items.length
              ? `
                <div class="grid forma-items">

                  ${f.items
                    .map(
                      item => `
                        <a
                          class="card"
                          href="${item.url}"
                          target="_blank"
                          rel="noopener">

                          ${T(item.t)}

                        </a>
                      `
                    )
                    .join("")}

                </div>
              `
              : ""
          }

        </div>

      </div>
    `;
  },


  /* -------------------------------------------------------
     CONTACT
  ------------------------------------------------------- */

  contact: () => `
    <div class="page">

      <div class="w">

        <p class="title">
          ${u("nav")[5]}
        </p>

        <h1>${u("contactTitle")}</h1>

        <p class="lead">
          ${u("contactText")}
        </p>


        <div class="contact-grid">


          ${
            D.links.email
              ? `
                <div class="contact-card">

                  <span class="tag">
                    ${u("email")}
                  </span>

                  <h3>
                    <a href="mailto:${D.links.email}">
                      ${D.links.email}
                    </a>
                  </h3>

                  <a
                    class="btn o"
                    href="mailto:${D.links.email}">
                    ${u("mail")} →
                  </a>

                </div>
              `
              : ""
          }


          ${
            D.links.linkedin
              ? `
                <div class="contact-card">

                  <span class="tag">
                    ${u("linkedin")}
                  </span>

                  <h3>
                    LinkedIn
                  </h3>

                  <a
                    class="btn o"
                    href="${D.links.linkedin}"
                    target="_blank"
                    rel="noopener">
                    ${u("linkedin")} →
                  </a>

                </div>
              `
              : ""
          }


          ${
            D.formalab && D.formalab.youtube
              ? `
                <div class="contact-card">

                  <span class="tag">
                    ${u("yt")}
                  </span>

                  <h3>
                    FORMA LAB
                  </h3>

                  <a
                    class="btn o"
                    href="${D.formalab.youtube}"
                    target="_blank"
                    rel="noopener">
                    ${u("yt")} →
                  </a>

                </div>
              `
              : ""
          }

        </div>


        ${
          S.cv
            ? `
              <div style="margin-top:48px">

                <a
                  class="btn"
                  href="${S.cv}"
                  target="_blank">
                  ${u("cv")}
                </a>

              </div>
            `
            : ""
        }


        ${
          S.formAction
            ? `
              <form
                action="${S.formAction}"
                method="post">

                <input
                  name="name"
                  required
                  aria-label="Nom"
                  placeholder="Nom">

                <input
                  name="email"
                  type="email"
                  required
                  aria-label="Email"
                  placeholder="Email">

                <textarea
                  name="message"
                  rows="5"
                  required
                  aria-label="Message"
                  placeholder="Message">
                </textarea>

                <input
                  name="_gotcha"
                  style="display:none"
                  tabindex="-1"
                  autocomplete="off">

                <button class="btn">
                  ${u("send")}
                </button>

              </form>
            `
            : ""
        }

      </div>

    </div>
  `
};


/* =========================================================
   RENDER
========================================================= */

function render() {

  const parts = location.hash
    .replace("#/", "")
    .split("/");

  const key = parts[0] || "home";

  const argument = parts[1];

  const main = document.getElementById("main");


  document.documentElement.lang = L;


  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  document.getElementById("nav").innerHTML = `

    ${
      S.draft
        ? `<div class="draft">${u("draft")}</div>`
        : ""
    }


    <div class="w">

      <a class="brand" href="#/">
        ${P.name}
      </a>


      <nav id="mn">

        ${R.map(
          (route, index) => `
            <a
              href="#/${route}"
              class="${route === key ? "on" : ""}">
              ${u("nav")[index]}
            </a>
          `
        ).join("")}

      </nav>


      <button
        class="lang"
        id="lg"
        type="button"
        aria-label="Change language">
        ${L === "fr" ? "EN" : "FR"}
      </button>


      <button
        class="bg"
        id="bg"
        type="button"
        aria-label="Menu">
        ☰
      </button>

    </div>
  `;


  /* -------------------------------------------------------
     PAGE
  ------------------------------------------------------- */

  main.innerHTML =
    (pages[key] || pages.home)(argument);


  /* -------------------------------------------------------
     TITLE
  ------------------------------------------------------- */

  const routeIndex = R.indexOf(key);

  document.title =
    key === "home"
      ? "Abdelaziz Talhaoui | Ingénierie de formation & ingénierie pédagogique"
      : `${
          routeIndex >= 0
            ? u("nav")[routeIndex]
            : P.name
        } | ${P.name}`;


  /* -------------------------------------------------------
     FOOTER
  ------------------------------------------------------- */

  document.getElementById("foot").innerHTML = `

    <div class="w">

      © ${new Date().getFullYear()}
      ${P.name}

      ·

      <a
        href="${D.links.linkedin}"
        target="_blank"
        rel="noopener">
        LinkedIn
      </a>

      ${
        D.links.email
          ? `
            ·
            <a href="mailto:${D.links.email}">
              Email
            </a>
          `
          : ""
      }

    </div>
  `;


  /* -------------------------------------------------------
     LANGUAGE
  ------------------------------------------------------- */

  const languageButton =
    document.getElementById("lg");

  if (languageButton) {
    languageButton.onclick = () => {

      L = L === "fr" ? "en" : "fr";

      localStorage.setItem("lang", L);

      render();
    };
  }


  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */

  const menuButton =
    document.getElementById("bg");

  const menu =
    document.getElementById("mn");

  if (menuButton && menu) {

    menuButton.onclick = () => {
      menu.classList.toggle("open");
    };

  }


  /* -------------------------------------------------------
     PROJECT FILTERS
  ------------------------------------------------------- */

  document
    .querySelectorAll(".filters button")
    .forEach(button => {

      button.onclick = () => {

        const filter =
          button.dataset.f;

        location.hash =
          "#/realisations" +
          (filter ? `/f:${filter}` : "");

      };

    });


  /* -------------------------------------------------------
     CLOSE MOBILE MENU AFTER NAVIGATION
  ------------------------------------------------------- */

  document
    .querySelectorAll("#mn a")
    .forEach(link => {

      link.addEventListener("click", () => {

        if (menu) {
          menu.classList.remove("open");
        }

      });

    });


  /* -------------------------------------------------------
     REVEAL ANIMATION
  ------------------------------------------------------- */

  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("in");

            observer.unobserve(entry.target);

          }

        });

      });


    document
      .querySelectorAll(".rv")
      .forEach(element => {
        observer.observe(element);
      });

  }


  /* -------------------------------------------------------
     SCROLL TOP
  ------------------------------------------------------- */

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

}


/* =========================================================
   ROUTER
========================================================= */

window.addEventListener(
  "hashchange",
  render
);

render();
