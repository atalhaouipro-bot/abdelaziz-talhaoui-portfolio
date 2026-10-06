/* ===== CONTENU — seul fichier à modifier pour changer textes, projets, chiffres =====
   Champ vide ("") : affiché [À COMPLÉTER] si settings.draft = true, masqué sinon.
   Textes bilingues : {fr:"…", en:"…"} */
window.DATA = {
settings:{ draft:true, lang:"fr", formAction:"", cv:"assets/cv.pdf" },
profile:{
  name:"Abdelaziz Talhaoui",
  title:{fr:"Ingénierie de formation · Ingénierie pédagogique · Évaluation",en:"Training engineering · Instructional design · Evaluation"},
  tagline:{fr:"Je conçois des dispositifs de formation, puis je mesure s'ils changent réellement les pratiques.",en:"I design training programmes, then measure whether they really change practice."},
  sub:{fr:"Contenus, parcours, formation de formateurs et évaluation, dans l'éducation et la petite enfance.",en:"Content, learning paths, trainer training and evaluation, in education and early childhood."},
  about:[
    {fr:"Je travaille à la Fondation Marocaine du Préscolaire (FMPS), comme cadre chargé de la création de contenu pédagogique de la formation. Mon travail va de l'analyse du besoin à la mise à disposition des contenus aux formateurs et aux éducatrices.",en:"I work at the Fondation Marocaine du Préscolaire (FMPS) as the officer in charge of creating training content. My work runs from needs analysis to making content available to trainers and educators."},
    {fr:"Ma spécialisation en mesure et évaluation en éducation et formation m'a conduit à une question simple : une formation réussie en salle l'est-elle aussi dans la classe ? Mon mémoire porte sur cette question.",en:"My specialisation in measurement and evaluation led me to a simple question: does training that works in the room also work in the classroom? My thesis addresses it."},
    {fr:"",en:""}],
  vision:{fr:"Une formation se juge à ce qui change dans les pratiques, pas à la satisfaction du jour.",en:"Training is judged by what changes in practice, not by same-day satisfaction."},
  method:{fr:"Partir du besoin réel, concevoir pour l'activité, évaluer à plusieurs niveaux, ajuster.",en:"Start from the real need, design for the activity, evaluate at several levels, adjust."}
},
loop:[
 {k:{fr:"Analyser",en:"Analyse"},cat:"ing-formation"},{k:{fr:"Concevoir",en:"Design"},cat:"ing-pedagogique"},
 {k:{fr:"Former",en:"Train"},cat:"formation-formateurs"},{k:{fr:"Accompagner",en:"Support"},cat:"formation-formateurs"},
 {k:{fr:"Évaluer",en:"Evaluate"},cat:"evaluation"},{k:{fr:"Améliorer",en:"Improve"},cat:"recherche"}],
categories:[
 {id:"ing-formation",n:{fr:"Ingénierie de formation",en:"Training engineering"}},{id:"ing-pedagogique",n:{fr:"Ingénierie pédagogique",en:"Instructional design"}},
 {id:"evaluation",n:{fr:"Évaluation",en:"Evaluation"}},{id:"formation-formateurs",n:{fr:"Formation de formateurs",en:"Trainer training"}},
 {id:"education",n:{fr:"Éducation",en:"Education"}},{id:"digital",n:{fr:"Digital Learning",en:"Digital Learning"}},{id:"recherche",n:{fr:"Recherche",en:"Research"}}],
expertises:[
 {n:{fr:"Ingénierie de formation",en:"Training engineering"},items:{fr:["Analyse des besoins","Conception de dispositifs","Architecture de parcours","Formation initiale et continue"],en:["Needs analysis","Programme design","Learning path architecture","Initial and continuing training"]},proof:""},
 {n:{fr:"Ingénierie pédagogique",en:"Instructional design"},items:{fr:["Conception de contenus","Scénarisation","Objectifs pédagogiques","Outils d'évaluation"],en:["Content design","Scenario writing","Learning objectives","Assessment tools"]},proof:"maharat"},
 {n:{fr:"Formation de formateurs",en:"Trainer training"},items:{fr:["Accompagnement","Animation","Professionnalisation","Outils pour formateurs"],en:["Coaching","Facilitation","Professionalisation","Trainer toolkits"]},proof:""},
 {n:{fr:"Évaluation",en:"Evaluation"},items:{fr:["Évaluation des formations","Mesure des acquis","Transfert des acquis","Indicateurs"],en:["Training evaluation","Measuring learning","Transfer of learning","Indicators"]},proof:"memoire"},
 {n:{fr:"Éducation et pédagogie",en:"Education & pedagogy"},items:{fr:["Éducation préscolaire","Pédagogie active","Accompagnement pédagogique"],en:["Preschool education","Active pedagogy","Pedagogical support"]},proof:""},
 {n:{fr:"Digital et IA",en:"Digital & AI"},items:{fr:["Digital learning","Plateformes de formation","Usages pédagogiques de l'IA"],en:["Digital learning","Learning platforms","Educational uses of AI"]},proof:"maharat"}],
experiences:[{
  org:"Fondation Marocaine du Préscolaire (FMPS)",role:{fr:"Cadre chargé de la création de contenu pédagogique de la formation",en:"Officer in charge of training content creation"},dates:"",
  context:{fr:"Fondation dédiée au préscolaire, qui forme les éducateurs et éducatrices.",en:"Foundation dedicated to preschool, training preschool educators."},
  resp:{fr:["Création du référentiel des contenus et des supports","Production et partage des contenus sur la plateforme Maharat"],en:["Building the content and materials framework","Producing and publishing content on the Maharat platform"]},
  projects:"",achievements:"",impact:""}],
projects:[
 {id:"maharat",cat:["digital","ing-pedagogique"],title:{fr:"Plateforme Maharat — parcours de formation",en:"Maharat platform — learning paths"},
  context:{fr:"Plateforme propre à la FMPS, offrant un parcours de formation varié aux éducateurs et éducatrices du préscolaire.",en:"FMPS's own platform, offering varied learning paths to preschool educators."},
  need:"",goal:"",role:{fr:"En charge des tâches liées à la plateforme, de la création du référentiel de contenus et de supports jusqu'au partage sur la plateforme.",en:"In charge of platform-related tasks, from building the content and materials framework to publishing on the platform."},
  approach:"",deliverables:"",tools:"",results:"",impact:"",link:""},
 {id:"culturtheque",cat:["digital","formation-formateurs"],title:{fr:"Culturthèque × FMPS — formation des éducatrices",en:"Culturthèque × FMPS — educator training"},
  context:{fr:"Projet de formation des éducatrices de la FMPS s'appuyant sur la plateforme Culturthèque de l'Institut français.",en:"Training project for FMPS educators using the Institut français's Culturthèque platform."},
  need:"",goal:"",role:{fr:"Supervision de la plateforme Culturthèque dans le cadre du projet.",en:"Supervision of the Culturthèque platform within the project."},
  approach:"",deliverables:"",tools:"",results:"",impact:"",link:""},
 {id:"memoire",cat:["evaluation","recherche"],title:{fr:"Dispositif d'évaluation de la formation des éducateurs(trices) du préscolaire",en:"Evaluation framework for preschool educator training"},
  context:{fr:"Mémoire de master, appliqué à la formation FMPS.",en:"Master's thesis applied to FMPS training."},
  need:{fr:"Dépasser les limites du dispositif actuel et mieux apprécier le transfert des acquis dans les pratiques.",en:"Move beyond the limits of the current system and better assess transfer of learning into practice."},
  goal:{fr:"Proposer un dispositif d'évaluation enrichi.",en:"Propose an enriched evaluation framework."},role:{fr:"Conception et conduite de la recherche.",en:"Research design and delivery."},
  approach:{fr:"Modèles de Kirkpatrick et de Guskey ; méthode mixte ; diagnostic du dispositif existant ; trois instruments : questionnaire de réaction, grille d'observation en classe, guide d'entretien.",en:"Kirkpatrick and Guskey models; mixed methods; diagnosis of the existing system; three instruments: reaction questionnaire, classroom observation grid, interview guide."},
  deliverables:"",tools:"SPSS, R",results:"",impact:"",link:""}],
achievements:[
 {v:3,l:{fr:"instruments de recherche conçus et validés",en:"research instruments designed and validated"}},
 {v:345,l:{fr:"répondants au questionnaire de réaction",en:"respondents to the reaction questionnaire"}},
 {v:"",l:{fr:"formations conçues",en:"programmes designed"}},{v:"",l:{fr:"formateurs accompagnés",en:"trainers supported"}},{v:"",l:{fr:"ressources produites",en:"resources produced"}}],
research:{
  education:{fr:"Master en Mesure et évaluation en éducation et formation — Faculté des Sciences de l'Éducation, Rabat",en:"Master's in Measurement and Evaluation in Education and Training — Faculty of Educational Sciences, Rabat"},
  status:"",
  thesis:{fr:"Élaboration d'un dispositif d'évaluation de la formation des éducateurs(trices) du préscolaire de la FMPS",en:"Developing an evaluation framework for FMPS preschool educator training"},
  question:{fr:"Dans quelle mesure peut-on concevoir un dispositif d'évaluation de la formation permettant de dépasser les limites du dispositif actuel de la FMPS et de mieux apprécier le transfert des acquis dans les pratiques pédagogiques des éducateurs(trices) du préscolaire ?",en:"To what extent can a training evaluation framework be designed that overcomes the limits of FMPS's current system and better assesses transfer of learning into preschool educators' teaching practice?"},
  certifications:"",publications:"",talks:""},
formalab:{sig:{fr:"Décrypter. Concevoir. Transformer.",en:"Decode. Design. Transform."},
  desc:{fr:"Une chaîne consacrée à l'ingénierie de formation et pédagogique, aux sciences de l'éducation, aux compétences, au digital learning, à l'évaluation et à l'IA appliquée à la formation.",en:"A channel on training and instructional design, education sciences, skills, digital learning, evaluation and AI applied to training."},
  youtube:"",items:[]},
links:{linkedin:"https://www.linkedin.com/in/abdelaziz-talhaoui-pro/",email:""}
};
