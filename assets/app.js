const D = window.DATA;
const S = D.settings;
const P = D.profile;

let L = localStorage.getItem("lang") || S.lang || "fr";

const T = value => {
  if (value && typeof value === "object" && "fr" in value) {
    return value[L] ?? value.fr ?? "";
  }
  return value ?? "";
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

const u = key => U[L]?.[key] ?? U.fr[key] ?? key;

/*
  Navigation principale.
  Cette constante était absente dans la version précédente
  et provoquait l'erreur "R is not defined".
*/
const R = [
  "parcours",
  "expertises",
  "realisations",
  "recherche",
  "forma-lab",
  "contact"
];

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

  if (Array.isArray(v)) {
    return v.filter(Boolean).join(" · ");
  }

  return v;
};

const cat = id => {
  const categories = Array.isArray(D.categories)
    ? D.categories
    : [];

  const found = categories.find(category => category.id === id);

  return found ? T(found.n) : id;
};

const block = (label, value) => {
  const v = T(value);

  if (!v && !S.draft) {
    return "";
  }

  return `
    <div class="b">
      <h4>${label}</h4>

      ${
        Array.isArray(v)
          ? `
            <ul>
              ${v
                .filter(Boolean)
                .map(item => `<li>${item}</li>`)
                .join("")}
            </ul>
          `
          : `<p>${val(value)}</p>`
      }
    </div>
  `;
};

const listBlock = (label, value) => {
  const items = list(value);

  if (!items.length && !S.draft) {
    return "";
  }

  return `
    <div class="b">
      <h4>${label}</h4>

      <ul>
        ${
          items.length
            ? items
                .map(item => `<li>${item}</li>`)
                .join("")
            : `<li>${val(value)}</li>`
        }
      </ul>
    </div>
  `;
};

const stats = achievements => {
  if (!Array.isArray(achievements)) {
    return "";
  }

  return achievements
    .filter(item => item && (item.v !== "" || S.draft))
    .map(item => `
      <div>
        <b>${item.v === "" ? val("") : item.v}</b>
        <span>${T(item.l)}</span>
      </div>
    `)
    .join("");
};

const loop = () => {
  if (!Array.isArray(D.loop)) {
    return "";
  }

  return `
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
};

const card = project => {
  if (!project) {
    return "";
  }

  const categories = Array.isArray(project.cat)
    ? project.cat
    : [];

  return `
    <a class="card rv" href="#/realisations/${project.id}">
      <span class="tag">
        ${categories.map(cat).join(" · ")}
      </span>

      <h3>${T(project.title)}</h3>

      <p>${T(project.context)}</p>

      <span class="project-more">
        ${L === "fr" ? "Voir le projet →" : "View project →"}
      </span>
    </a>
  `;
};

const projectPage = project => {
  if (!project) {
    return `
      <div class="page">
        <div class="w">
          <h1>Projet introuvable</h1>
        </div>
      </div>
    `;
  }

  const categories = Array.isArray(project.cat)
    ? project.cat
    : [];

  return `
    <div class="page">
      <div class="w">

        <a class="back" href="#/realisations">
          ${u("back")}
        </a>

        <div class="project-head">

          <p class="title">
            ${categories.map(cat).join(" · ")}
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

          ${listBlock(
            u("del"),
            project.deliverables
          )}

          ${block(u("tools"), project.tools)}

          ${block(u("res"), project.results)}

          ${block(u("imp"), project.impact)}

          ${
            project.link
              ? `
                <div class="project-link">
                  <a
                    class="btn o"
                    href="${project.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
};

const productionsSection = () => {
  const p = D.productions;

  if (!p) {
    return "";
  }

  return `
    <section class="subsection">

      <h2>${u("productions")}</h2>

      <div class="grid">

        ${block(
          u("production"),
          p.modules
        )}

        ${block(
          u("participantPack"),
          p.participantPack
        )}

        ${block(
          u("trainerPack"),
          p.trainerPack
        )}

        ${block(
          u("evaluation"),
          p.evaluation
        )}

        ${block(
          u("frameworks"),
          p.frameworks
        )}

      </div>

    </section>
  `;
};

const toolsSection = () => {
  const t = D.tools;

  if (!t) {
    return "";
  }

  return `
    <section class="subsection">

      <h2>${u("tools")}</h2>

      <div class="grid">

        ${block(
          u("production"),
          t.production
        )}

        ${block(
          u("digital"),
          t.digital
        )}

        ${block(
          u("ai"),
          t.ai
        )}

        ${block(
          u("analysis"),
          t.analysis
        )}

        ${block(
          u("collaboration"),
          t.collaboration
        )}

      </div>

    </section>
  `;
};

const pages = {

  home: () => `
    <section class="hero">

      <div class="w">

        <p class="title">
          ${T(P.title)}
        </p>

        <h1>
          ${T(P.tagline)}
        </h1>

        <p class="lead">
          ${T(P.sub)}
        </p>

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

          ${
            Array.isArray(D.projects)
              ? D.projects.map(card).join("")
              : ""
          }

        </div>

      </div>

    </section>
  `,

  parcours: () => `
    <div class="page">

      <div class="w">

        <h1>${u("about")}</h1>

        <div class="about-grid">

  <aside class="about-identity">
    <div class="about-monogram" aria-hidden="true">AT</div>

    <div class="about-photo-wrap">
      <img
        class="about-photo"
        src="assets/abdelaziz-talhaoui-photo.jpg"
        alt="Abdelaziz Talhaoui"
        loading="lazy"
      >
    </div>

    <div class="about-identity-text">
      <p class="about-name">${T(P.name)}</p>
      <p class="about-role">${T(P.title)}</p>
    </div>
  </aside>

  <div class="about-content">

    ${
      Array.isArray(P.about)
        ? P.about
            .filter(
              item => T(item) || S.draft
            )
            .map(
              item => `
                <p class="lead">
                  ${val(item)}
                </p>
              `
            )
            .join("")
        : ""
    }

  </div>

</div>
        ${block(u("vis"), P.vision)}

        ${block(u("met"), P.method)}

        <h2 class="section-title">
          ${u("nav")[0]}
        </h2>

        <div class="experience-list">

          ${
            Array.isArray(D.experiences)
              ? D.experiences
                  .map(
                    experience => `
                      <details open>

                        <summary>
                          ${T(experience.role)}

                          <span>
                            — ${T(experience.org)}
                          </span>
                        </summary>

                        ${block(
                          u("dates"),
                          experience.dates
                        )}

                        ${block(
                          u("ctx"),
                          experience.context
                        )}

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
                  .join("")
              : ""
          }

        </div>

        ${productionsSection()}

        ${toolsSection()}

      </div>

    </div>
  `,

  expertises: () => `
    <div class="page">

      <div class="w">

        <h1>${u("nav")[1]}</h1>

        <div class="grid">

          ${
            Array.isArray(D.expertises)
              ? D.expertises
                  .map(expertise => {

                    const proofProject =
                      expertise.proof
                        ? D.projects.find(
                            project =>
                              project.id ===
                              expertise.proof
                          )
                        : null;

                    return `
                      <div class="card rv">

                        <h3>
                          ${T(expertise.n)}
                        </h3>

                        <ul>

                          ${list(expertise.items)
                            .map(
                              item =>
                                `<li>${item}</li>`
                            )
                            .join("")}

                        </ul>

                        ${
                          proofProject
                            ? `
                              <p class="tag proof">
                                <a href="#/realisations/${expertise.proof}">
                                  → ${T(
                                    proofProject.title
                                  )}
                                </a>
                              </p>
                            `
                            : ""
                        }

                      </div>
                    `;
                  })
                  .join("")
              : ""
          }

        </div>

      </div>

    </div>
  `,

  realisations: argument => {

    const filter =
      argument &&
      argument.startsWith("f:")
        ? argument.slice(2)
        : "";

    const project = Array.isArray(D.projects)
      ? D.projects.find(
          item => item.id === argument
        )
      : null;

    if (project) {
      return projectPage(project);
    }

    const projects = Array.isArray(D.projects)
      ? D.projects
      : [];

    const categories = Array.isArray(D.categories)
      ? D.categories
      : [];

    return `
      <div class="page">

        <div class="w">

          <h1>${u("nav")[2]}</h1>

          <div
            class="filters"
            role="group"
            aria-label="${u("nav")[2]}"
          >

            ${[
              "",
              ...categories.map(c => c.id)
            ]
              .map(
                id => `
                  <button
                    type="button"
                    data-f="${id}"
                    class="${id === filter ? "on" : ""}"
                  >
                    ${
                      id
                        ? cat(id)
                        : u("all")
                    }
                  </button>
                `
              )
              .join("")}

          </div>

          <div class="grid" id="pg">

            ${projects
              .filter(
                project =>
                  !filter ||
                  (
                    Array.isArray(project.cat) &&
                    project.cat.includes(filter)
                  )
              )
              .map(card)
              .join("")}

          </div>

        </div>

      </div>
    `;
  },

  recherche: () => {

    const r = D.research || {};

    return `
      <div class="page">

        <div class="w">

          <h1>${u("nav")[3]}</h1>

          <div class="research-intro">

            ${block(
              "Master",
              r.education
            )}

            ${block(
              u("st"),
              r.status
            )}

            ${block(
              u("thesis"),
              r.thesis
            )}

            ${block(
              u("q"),
              r.question
            )}

          </div>

          <a
            class="btn o"
            href="#/realisations/memoire"
          >
            → ${u("thesis")}
          </a>

          <section class="subsection">

            <h2>${u("cert")}</h2>

            <div class="certifications">

              ${list(r.certifications)
                .map(
                  certification => `
                    <div class="cert-item">

                      <span class="cert-mark">
                        ✓
                      </span>

                      <span>
                        ${certification}
                      </span>

                    </div>
                  `
                )
                .join("")}

            </div>

          </section>

          ${block(
            u("pub"),
            r.publications
          )}

          ${
            T(r.talks)
              ? block(
                  u("talks"),
                  r.talks
                )
              : ""
          }

        </div>

      </div>
    `;
  },

  "forma-lab": () => {

    const f = D.formalab || {};

    return `
      <div class="page">

        <div class="w">

          <p class="title">
            FORMA LAB
          </p>

          <h1>
            ${T(f.sig)}
          </h1>

          <p class="lead">
            ${T(f.desc)}
          </p>

          ${
            f.youtube
              ? `
                <a
                  class="btn"
                  href="${f.youtube}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${u("yt")} ↗
                </a>
              `
              : ""
          }

          ${
            Array.isArray(f.items) &&
            f.items.length
              ? `
                <div class="grid forma-items">

                  ${f.items
                    .map(
                      item => `
                        <a
                          class="card"
                          href="${item.url}"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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

  contact: () => {

    const links = D.links || {};
    const formalab = D.formalab || {};

    return `
      <div class="page">

        <div class="w">

          <p class="title">
            ${u("nav")[5]}
          </p>

          <h1>
            ${u("contactTitle")}
          </h1>

          <p class="lead">
            ${u("contactText")}
          </p>

          <div class="contact-grid">

            ${
              links.email
                ? `
                  <div class="contact-card">

                    <span class="tag">
                      ${u("email")}
                    </span>

                    <h3>
                      <a href="mailto:${links.email}">
                        ${links.email}
                      </a>
                    </h3>

                    <a
                      class="btn o"
                      href="mailto:${links.email}"
                    >
                      ${u("mail")} →
                    </a>

                  </div>
                `
                : ""
            }

            ${
              links.linkedin
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
                      href="${links.linkedin}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ${u("linkedin")} →
                    </a>

                  </div>
                `
                : ""
            }

            ${
              formalab.youtube
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
                      href="${formalab.youtube}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                  method="post"
                >

                  <input
                    name="name"
                    required
                    aria-label="Nom"
                    placeholder="Nom"
                  >

                  <input
                    name="email"
                    type="email"
                    required
                    aria-label="Email"
                    placeholder="Email"
                  >

                  <textarea
                    name="message"
                    rows="5"
                    required
                    aria-label="Message"
                    placeholder="Message"
                  ></textarea>

                  <input
                    name="_gotcha"
                    style="display:none"
                    tabindex="-1"
                    autocomplete="off"
                  >

                  <button
                    class="btn"
                    type="submit"
                  >
                    ${u("send")}
                  </button>

                </form>
              `
              : ""
          }

        </div>

      </div>
    `;
  }
};

function render() {

  const hash =
    location.hash
      .replace(/^#\/?/, "");

  const parts =
    hash.split("/");

  const key =
    parts[0] || "home";

  const argument =
    parts[1] || "";

  const main =
    document.getElementById("main");

  const nav =
    document.getElementById("nav");

  const foot =
    document.getElementById("foot");

  if (!main || !nav || !foot) {
    console.error(
      "Structure HTML introuvable : #nav, #main ou #foot manque dans index.html."
    );
    return;
  }

  document.documentElement.lang = L;

  nav.innerHTML = `
    ${
      S.draft
        ? `
          <div class="draft">
            ${u("draft")}
          </div>
        `
        : ""
    }

    <div class="w">

      <a
        class="brand"
        href="#/"
        aria-label="Accueil"
      >
        ${T(P.name)}
      </a>

      <nav id="mn" aria-label="Navigation principale">

        ${R
          .map(
            (route, index) => `
              <a
                href="#/${route}"
                class="${route === key ? "on" : ""}"
              >
                ${u("nav")[index]}
              </a>
            `
          )
          .join("")}

      </nav>

      <button
        class="lang"
        id="lg"
        type="button"
        aria-label="Change language"
      >
        ${L === "fr" ? "EN" : "FR"}
      </button>

      <button
        class="bg"
        id="bg"
        type="button"
        aria-label="Menu"
        aria-expanded="false"
      >
        ☰
      </button>

    </div>
  `;

  const page =
    pages[key] || pages.home;

  main.innerHTML =
    page(argument);

  const routeIndex =
    R.indexOf(key);

  document.title =
    key === "home"
      ? "Abdelaziz Talhaoui | Ingénierie de formation & ingénierie pédagogique"
      : `${
          routeIndex >= 0
            ? u("nav")[routeIndex]
            : P.name
        } | ${P.name}`;

  foot.innerHTML = `
    <div class="w">

      © ${new Date().getFullYear()}
      ${T(P.name)}

      ${
        D.links?.linkedin
          ? `
            ·
            <a
              href="${D.links.linkedin}"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          `
          : ""
      }

      ${
        D.links?.email
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

  const languageButton =
    document.getElementById("lg");

  if (languageButton) {

    languageButton.onclick = () => {

      L =
        L === "fr"
          ? "en"
          : "fr";

      localStorage.setItem(
        "lang",
        L
      );

      render();

    };
  }

  const menuButton =
    document.getElementById("bg");

  const menu =
    document.getElementById("mn");

  if (menuButton && menu) {

    menuButton.onclick = () => {

      const opened =
        menu.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        opened ? "true" : "false"
      );

    };
  }

  document
    .querySelectorAll(".filters button")
    .forEach(button => {

      button.onclick = () => {

        const filter =
          button.dataset.f;

        location.hash =
          "#/realisations" +
          (
            filter
              ? `/f:${filter}`
              : ""
          );

      };

    });

  document
    .querySelectorAll("#mn a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          if (menu) {
            menu.classList.remove("open");
          }

          if (menuButton) {
            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );
          }

        }
      );

    });

  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "in"
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        }
      );

    document
      .querySelectorAll(".rv")
      .forEach(element =>
        observer.observe(element)
      );

  } else {

    document
      .querySelectorAll(".rv")
      .forEach(element =>
        element.classList.add("in")
      );

  }

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}

window.addEventListener(
  "hashchange",
  render
);

document.addEventListener(
  "DOMContentLoaded",
  render
);

if (
  document.readyState !== "loading"
) {
  render();
}
