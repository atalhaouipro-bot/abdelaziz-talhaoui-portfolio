const D = window.DATA;
const S = D.settings;
const P = D.profile;
const PHONE = D.links?.phone || "+212689114914";

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
    phone: "Téléphone",
    formName: "Nom complet",
    formEmail: "Adresse e-mail",
    formPhone: "Téléphone",
    formOrg: "Organisation / entreprise",
    formType: "Nature de la demande",
    formTypeProject: "Projet de formation",
    formTypePedagogy: "Ingénierie pédagogique",
    formTypeEvaluation: "Évaluation / mesure",
    formTypePartnership: "Proposition de partenariat",
    formTypeOther: "Autre demande",
    formMessage: "Votre demande",
    formMessagePlaceholder: "Présentez brièvement votre besoin, votre projet ou votre proposition…",
    formPrivacy: "Vos informations sont utilisées uniquement pour répondre à votre demande.",
    formSuccess: "Merci. Votre demande a bien été envoyée.",
    formError: "Une erreur est survenue. Vous pouvez aussi m’écrire directement par e-mail.",

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
    phone: "Phone",
    formName: "Full name",
    formEmail: "Email address",
    formPhone: "Phone",
    formOrg: "Organization / company",
    formType: "Request type",
    formTypeProject: "Training project",
    formTypePedagogy: "Instructional design",
    formTypeEvaluation: "Evaluation / measurement",
    formTypePartnership: "Partnership proposal",
    formTypeOther: "Other request",
    formMessage: "Your request",
    formMessagePlaceholder: "Briefly describe your need, project or proposal…",
    formPrivacy: "Your information is used only to respond to your request.",
    formSuccess: "Thank you. Your request has been sent successfully.",
    formError: "Something went wrong. You can also contact me directly by email.",

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
    <a
      class="card rv"
      href="#/realisations/${project.id}"
      data-categories="${categories.join(" ")}"
    >
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
    const items = Array.isArray(f.items)
      ? f.items.slice(0, 3)
      : [];

    return `
      <div class="page">

        <div class="w">

          <div class="page-hero forma-page-hero">

            <div class="page-hero-copy">

              <p class="eyebrow">
                FORMA LAB · Transmission & contenu
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

            </div>

            <div class="channel-preview">

              <div class="channel-preview-top">
                <span class="youtube-badge">▶</span>
                <span>CHAÎNE YOUTUBE</span>
              </div>

              ${
                f.youtube
                  ? `
                    <a
                      class="channel-preview-link"
                      href="${f.youtube}"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visiter la chaîne YouTube FORMA LAB"
                    >
                      <img
                        src="assets/forma-lab-youtube.png"
                        alt="Chaîne YouTube FORMA LAB"
                        class="channel-preview-image"
                        loading="lazy"
                      >
                    </a>
                  `
                  : `
                    <img
                      src="assets/forma-lab-youtube.png"
                      alt="Chaîne YouTube FORMA LAB"
                      class="channel-preview-image"
                      loading="lazy"
                    >
                  `
              }

              ${
                items.length
                  ? `
                    <div class="channel-content">

                      ${items
                        .map(
                          item => `
                            <a
                              class="channel-content-item"
                              href="${
                                item.url ||
                                f.youtube ||
                                "#"
                              }"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span class="play-mini">
                                ▶
                              </span>

                              <span>
                                ${T(item.t)}
                              </span>

                              <span>↗</span>

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

          ${
            Array.isArray(f.items) && f.items.length
              ? `
                <section class="subsection forma-publications">

                  <div class="subsection-head">

                    <p class="eyebrow">
                      Publications
                    </p>

                    <h2>
                      Une démarche de transmission professionnelle.
                    </h2>

                  </div>

                  <div class="grid forma-items">

                    ${f.items
                      .map(
                        item => `
                          <a
                            class="card rv"
                            href="${
                              item.url ||
                              f.youtube ||
                              "#"
                            }"
                            target="_blank"
                            rel="noopener noreferrer"
                          >

                            <span class="tag">
                              FORMA LAB
                            </span>

                            <h3>
                              ${T(item.t)}
                            </h3>

                            <span class="project-more">
                              Découvrir →
                            </span>

                          </a>
                        `
                      )
                      .join("")}

                  </div>

                </section>
              `
              : ""
          }

        </div>

      </div>
    `;
  },

  contact: () => {

    const links = D.links || {};

    return `
      <div class="page">

        <div class="w">

          <div class="page-hero contact-hero">

            <div class="page-hero-copy">

              <p class="eyebrow">
                ${u("nav")[5]}
              </p>

              <h1>
                ${u("contactTitle")}
              </h1>

              <p class="lead">
                ${u("contactText")}
              </p>

              <div class="contact-direct">

                ${
                  links.linkedin
                    ? `
                      <a
                        class="contact-direct-item"
                        href="${links.linkedin}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="contact-direct-label">
                          LinkedIn
                        </span>

                        <span>
                          Profil professionnel ↗
                        </span>
                      </a>
                    `
                    : ""
                }

                ${
                  links.email
                    ? `
                      <a
                        class="contact-direct-item"
                        href="mailto:${links.email}"
                      >
                        <span class="contact-direct-label">
                          E-mail
                        </span>

                        <span>
                          ${links.email}
                        </span>
                      </a>
                    `
                    : ""
                }

                <a
                  class="contact-direct-item"
                  href="tel:${PHONE.replace(/[^0-9+]/g, "")}"
                >
                  <span class="contact-direct-label">
                    ${u("phone")}
                  </span>

                  <span>
                    ${PHONE}
                  </span>
                </a>

                ${
                  S.cv
                    ? `
                      <a
                        class="contact-direct-item"
                        href="${S.cv}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="contact-direct-label">
                          CV
                        </span>

                        <span>
                          ${u("cv")} ↗
                        </span>
                      </a>
                    `
                    : ""
                }

              </div>

            </div>

            <div class="contact-form-shell">

              <div class="form-heading">
                <span>01</span>
                <strong>Envoyer une demande</strong>
              </div>

              <form
                id="contactForm"
                name="contact"
                method="POST"
                action="/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                novalidate
              >

                <input
                  type="hidden"
                  name="form-name"
                  value="contact"
                >

                <p class="honeypot">

                  <label>
                    Ne pas remplir :

                    <input
                      name="bot-field"
                      tabindex="-1"
                      autocomplete="off"
                    >

                  </label>

                </p>

                <div class="form-grid">

                  <label class="form-field">

                    <span>
                      ${u("formName")} *
                    </span>

                    <input
                      name="name"
                      type="text"
                      required
                      autocomplete="name"
                    >

                  </label>

                  <label class="form-field">

                    <span>
                      ${u("formEmail")} *
                    </span>

                    <input
                      name="email"
                      type="email"
                      required
                      autocomplete="email"
                    >

                  </label>

                  <label class="form-field">

                    <span>
                      ${u("formPhone")}
                    </span>

                    <input
                      name="phone"
                      type="tel"
                      autocomplete="tel"
                    >

                  </label>

                  <label class="form-field">

                    <span>
                      ${u("formOrg")}
                    </span>

                    <input
                      name="organization"
                      type="text"
                      autocomplete="organization"
                    >

                  </label>

                  <label class="form-field form-field-full">

                    <span>
                      ${u("formType")}
                    </span>

                    <select name="request-type">

                      <option value="">—</option>

                      <option value="Projet de formation">
                        ${u("formTypeProject")}
                      </option>

                      <option value="Ingénierie pédagogique">
                        ${u("formTypePedagogy")}
                      </option>

                      <option value="Évaluation / mesure">
                        ${u("formTypeEvaluation")}
                      </option>

                      <option value="Proposition de partenariat">
                        ${u("formTypePartnership")}
                      </option>

                      <option value="Autre">
                        ${u("formTypeOther")}
                      </option>

                    </select>

                  </label>

                  <label class="form-field form-field-full">

                    <span>
                      ${u("formMessage")} *
                    </span>

                    <textarea
                      name="message"
                      rows="7"
                      required
                      placeholder="${u("formMessagePlaceholder")}"
                    ></textarea>

                  </label>

                </div>

                <div class="form-bottom">

                  <p>
                    ${u("formPrivacy")}
                  </p>

                  <button
                    class="btn"
                    type="submit"
                  >
                    ${u("send")} →
                  </button>

                </div>

                <div
                  id="formStatus"
                  class="form-status"
                  role="status"
                  aria-live="polite"
                ></div>

              </form>

            </div>

          </div>

        </div>

      </div>
    `;
  }

};
/* =========================================================
   MODE ONE-PAGE — TOUTES LES RUBRIQUES SUR UNE PAGE
========================================================= */

function buildOnePage() {
  const sections = [
    ["home", pages.home()],
    ["parcours", pages.parcours()],
    ["expertises", pages.expertises()],
    ["realisations", pages.realisations("")],
    ["recherche", pages.recherche()],
    ["forma-lab", pages["forma-lab"]()],
    ["contact", pages.contact()]
  ];

  return sections.map(([id, content]) => `
    <div
      id="section-${id}"
      class="onepage-anchor"
      data-section="${id}"
      style="scroll-margin-top: 100px;"
    >
      ${content}
    </div>
  `).join("");
}
function render(event) {
  const currentHash = location.hash;

  // Si l'utilisateur clique sur une ancre déjà présente,
  // on laisse le navigateur effectuer le défilement.
  if (
    event?.type === "hashchange" &&
    currentHash.startsWith("#section-") &&
    document.getElementById(currentHash.slice(1))
  ) {
    const activeSection =
      currentHash.slice("#section-".length);

    document.querySelectorAll("#mn a").forEach(link => {
      link.classList.toggle(
        "on",
        link.dataset.section === activeSection
      );
    });

    document.getElementById(currentHash.slice(1))?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;
  }

  const isAnchorHash =
    currentHash.startsWith("#section-");

  const hash = currentHash.replace(/^#\/?/, "");

  const parts =
    hash.split("/");

  const key =
    parts[0] || "home";

  const argument =
    parts[1] || "";

  const activeKey = isAnchorHash
    ? currentHash.slice("#section-".length)
    : (R.includes(key) ? key : "home");

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
        href="#section-home"
        aria-label="Accueil"
      >
        ${T(P.name)}
      </a>

      <nav
        id="mn"
        aria-label="Navigation principale"
      >

        ${R
          .map(
            (route, index) => `
              <a
                href="#section-${route}"
                data-section="${route}"
                class="${route === activeKey ? "on" : ""}"
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

    const matchingProject =
    Array.isArray(D.projects)
      ? D.projects.find(project => project.id === argument)
      : null;

  // Les détails d'un projet restent accessibles.
  // La navigation normale affiche toutes les rubriques.
  const isProjectDetail =
    key === "realisations" &&
    Boolean(argument) &&
    !argument.startsWith("f:") &&
    Boolean(matchingProject);

  main.innerHTML = isProjectDetail
    ? pages.realisations(argument)
    : buildOnePage();

  // Conserver le fonctionnement des filtres de projets.
  const activeFilter =
    key === "realisations" && argument.startsWith("f:")
      ? argument.slice(2)
      : "";

  document
    .querySelectorAll("#section-realisations .filters button")
    .forEach(button => {
      button.classList.toggle(
        "on",
        button.dataset.f === activeFilter
      );
    });

  document
    .querySelectorAll("#section-realisations #pg .card")
    .forEach(projectCard => {
      const categories =
        (projectCard.dataset.categories || "").split(/\s+/).filter(Boolean);

      projectCard.hidden =
        Boolean(activeFilter) &&
        !categories.includes(activeFilter);
    });

  const routeIndex = R.indexOf(activeKey);

  document.title = isProjectDetail
    ? `${T(matchingProject.title)} | ${P.name}`
    : routeIndex >= 0
      ? `${u("nav")[routeIndex]} | ${P.name}`
      : "Abdelaziz Talhaoui | Ingénierie de formation & ingénierie pédagogique";

  foot.innerHTML = `
    <div class="w footer-inner">

      <span>
        © ${new Date().getFullYear()} ${T(P.name)}
      </span>

      <span>
        Ingénierie de formation · Ingénierie pédagogique · Évaluation
      </span>

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

  const contactForm =
    document.getElementById("contactForm");

 if (contactForm) {
  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    const status = document.getElementById("formStatus");
    const submit = contactForm.querySelector('button[type="submit"]');

    if (!contactForm.reportValidity()) {
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.dataset.original = submit.textContent;
      submit.textContent = L === "fr" ? "Envoi…" : "Sending…";
    }

    if (status) {
      status.className = "form-status";
      status.textContent = "";
    }

    try {
      const formData = new FormData(contactForm);

      // Protection anti-spam : champ invisible
      if (String(formData.get("bot-field") || "").trim()) {
        contactForm.reset();

        if (status) {
          status.className = "form-status success";
          status.textContent = u("formSuccess");
        }

        return;
      }

      // Vérifier la connexion à Supabase
      if (!window.supabaseClient) {
        throw new Error("Supabase client is unavailable");
      }

      // Enregistrer le message dans la base de données
      const { error } = await window.supabaseClient
        .from("contact_messages")
        .insert({
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim() || null,
          organization: String(formData.get("organization") || "").trim() || null,
          request_type: String(formData.get("request-type") || "").trim() || null,
          message: String(formData.get("message") || "").trim()
        });

      if (error) {
        throw error;
      }
// Envoyer une notification par e-mail après l'enregistrement
try {
  if (
    window.emailjs &&
    typeof window.emailjs.send === "function"
  ) {
    await window.emailjs.send(
      "service_z5k73db",
      "template_7fv5xgq",
      {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        organization: String(formData.get("organization") || "").trim(),
        request_type: String(formData.get("request-type") || "").trim(),
        message: String(formData.get("message") || "").trim()
      }
    );
  } else {
    console.error("EmailJS n'est pas disponible.");
  }
} catch (emailError) {
  console.error("Notification e-mail non envoyée :", emailError);
}
      contactForm.reset();

      if (status) {
        status.className = "form-status success";
        status.textContent = u("formSuccess");
      }

    } catch (error) {
      console.error("Erreur du formulaire de contact :", error);

      if (status) {
        status.className = "form-status error";
        status.textContent = u("formError");
      }

    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = submit.dataset.original || u("send");
      }
    }
  });
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

  const targetId = isProjectDetail
    ? null
    : isAnchorHash
      ? currentHash.slice(1)
      : `section-${activeKey}`;

  if (targetId) {
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: currentHash ? "smooth" : "auto",
        block: "start"
      });
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }
}

window.addEventListener(
  "hashchange",
  render
);

window.addEventListener(
  "content-ready",
  () => {
    render();
  },
  { once: true }
);
