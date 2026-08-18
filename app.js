/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Application Core Logic, Dynamic Communes & Grouped Print
   ---------------------------------------------------- */

// Default Initial Mock Data for Quranic Centers
const DEFAULT_CENTERS = [
  {
    id: 1,
    name_ar: "مركز النور لتحفيظ القرآن الكريم",
    name_fr: "Centre An-Nour de Mémorisation du Coran",
    director_ar: "أبو بكر سيسوكو",
    director_fr: "Aboubacar Sissoko",
    address_ar: "حي النصر - باماكو",
    address_fr: "Quartier Nassenou - Bamako",
    commune: "Commune I - Bamako",
    phone: "76 12 34 56",
    gender_type: "mixte",
    boys: 120,
    girls: 95,
    total: 215,
    membership: "Oui"
  },
  {
    id: 2,
    name_ar: "مركز السلام القرآني",
    name_fr: "Centre As-Salam Coranique",
    director_ar: "مريم تراوري",
    director_fr: "Mariam Traoré",
    address_ar: "حي السلام - باماكو",
    address_fr: "Quartier As-Salam - Bamako",
    commune: "Commune II - Bamako",
    phone: "66 78 90 12",
    gender_type: "filles",
    boys: 0,
    girls: 85,
    total: 85,
    membership: "Non"
  },
  {
    id: 3,
    name_ar: "مدرسة الإيمان لتحفيظ القرآن",
    name_fr: "École Al-Iman du Saint Coran",
    director_ar: "عثمان كوياتي",
    director_fr: "Ousmane Kouyaté",
    address_ar: "المركز الحضري - سيكاسو",
    address_fr: "Centre-Ville - Sikasso",
    commune: "Sikasso",
    phone: "75 43 21 09",
    gender_type: "garcons",
    boys: 140,
    girls: 0,
    total: 140,
    membership: "Oui"
  },
  {
    id: 4,
    name_ar: "مركز الفتح والإحسان",
    name_fr: "Centre Al-Fath et Al-Ihsan",
    director_ar: "إبراهيم مايغا",
    director_fr: "Ibrahim Maïga",
    address_ar: "حي بدر - موبتي",
    address_fr: "Quartier Badr - Mopti",
    commune: "Mopti",
    phone: "69 88 77 66",
    gender_type: "mixte",
    boys: 90,
    girls: 110,
    total: 200,
    membership: "Oui"
  },
  {
    id: 5,
    name_ar: "مجمع الهدى لتحفيظ القرآن",
    name_fr: "Complexe Al-Huda de Mémorisation",
    director_ar: "فاطمة دياباتي",
    director_fr: "Fatoumata Diabaté",
    address_ar: "البلدية الخامسة - باماكو",
    address_fr: "Commune V - Bamako",
    commune: "Commune V - Bamako",
    phone: "74 11 22 33",
    gender_type: "mixte",
    boys: 75,
    girls: 65,
    total: 140,
    membership: "Non"
  }
];

// Default List of Communes & Regions
const DEFAULT_COMMUNES = [
  { id: "c1", name_ar: "البلدية الأولى - باماكو", name_fr: "Commune I - Bamako" },
  { id: "c2", name_ar: "البلدية الثانية - باماكو", name_fr: "Commune II - Bamako" },
  { id: "c3", name_ar: "البلدية الثالثة - باماكو", name_fr: "Commune III - Bamako" },
  { id: "c4", name_ar: "البلدية الرابعة - باماكو", name_fr: "Commune IV - Bamako" },
  { id: "c5", name_ar: "البلدية الخامسة - باماكو", name_fr: "Commune V - Bamako" },
  { id: "c6", name_ar: "البلدية السادسة - باماكو", name_fr: "Commune VI - Bamako" },
  { id: "c7", name_ar: "كايس", name_fr: "Kayes" },
  { id: "c8", name_ar: "كوليكورو", name_fr: "Koulikoro" },
  { id: "c9", name_ar: "سيكاسو", name_fr: "Sikasso" },
  { id: "c10", name_ar: "سيغو", name_fr: "Ségou" },
  { id: "c11", name_ar: "موبتي", name_fr: "Mopti" },
  { id: "c12", name_ar: "تمبكتو", name_fr: "Tombouctou" },
  { id: "c13", name_ar: "غاو", name_fr: "Gao" },
  { id: "c14", name_ar: "كيدال", name_fr: "Kidal" }
];

// App State Management
let currentLang = 'ar';
let centersList = [];
let communesList = [];
let isAdminLoggedIn = false;
let activeFilterCommune = 'ALL';
let activeFilterMembership = 'ALL';
let searchQuery = '';

// UI Dictionary for Pure Single-Language Support
const I18N = {
  ar: {
    mainAppTitle: "جمع بيانات مدارس ومراكز تحفيظ القرآن الكريم في مالي",
    subAppTitle: "اتحاد المدارس والمراكز القرآنية في جمهورية مالي",
    loginBtn: "دخول المسؤول",
    logoutBtn: "تسجيل الخروج",
    submitSuccess: "تم تسجيل بيانات المركز بنجاح! شكراً لمشاركتكم.",
    confirmDelete: "هل أنت تأكد من حذف هذا المركز القرآني؟",
    accessDenied: "هذه الميزة مخصصة لمسؤول النظام فقط. يرجى تسجيل الدخول أولاً.",
    
    // Sidebar & Navigation
    mobileMenuTitle: "قائمة النظام",
    navSurvey: "استبيان التسجيل",
    navSchools: "قائمة المدارس",
    navSearch: "البحث والتصفية",
    navCommunes: "إدارة البلديات",
    navExcel: "تصدير Excel",
    navPrint: "طباعة التقارير",
    statCenters: "مركز مسجل",
    statStudents: "إجمالي الطلاب",

    // Form Titles & Labels
    formTitleNew: "إدخال بيانات جديدة",
    formTitleEdit: "تعديل بيانات المركز القرآني",
    btnSubmitNew: "إرسال البيانات",
    btnSubmitEdit: "حفظ التعديلات",
    btnReset: "إعادة ضبط",

    lblCenterNameAr: "اسم المركز (باللغة العربية) *",
    lblCenterNameFr: "اسم المركز (باللغة الفرنسية) *",
    phCenterNameAr: "أدخل اسم المركز بالعربية",
    phCenterNameFr: "Saisir le nom du centre en français",

    lblDirectorAr: "اسم المدير / المديرة (بالعربية) *",
    lblDirectorFr: "اسم المدير / المديرة (بالفرنسية) *",
    phDirectorAr: "أدخل اسم المدير بالعربية",
    phDirectorFr: "Saisir le nom du directeur en français",

    lblAddressAr: "عنوان المركز (بالعربية)",
    lblAddressFr: "عنوان المركز (بالفرنسية)",
    phAddressAr: "أدخل عنوان المركز التفصيلي",
    phAddressFr: "Saisir l'adresse du centre",

    lblCommune: "البلدية *",
    selectCommuneDefault: "اختر البلدية",
    lblPhone: "رقم الهاتف *",
    phPhone: "مثال: 76 12 34 56",

    lblBoysCount: "عدد البنين",
    lblGirlsCount: "عدد البنات",
    lblTotalStudents: "إجمالي الطلاب والتصنيف",

    lblUnionMem: "هل المركز منضم إلى الاتحاد؟ *",
    optMemDefault: "اختر الخيار",
    optMemYes: "نعم - منضم سابقاً",
    optMemNo: "لا - غير منضم بعد",

    // Table & Filters
    tableTitle: "قائمة المدارس المسجلة",
    phSearch: "بحث عن مركز...",
    lblFilterCommune: "البلدية:",
    optFilterAll: "الكل",
    lblFilterMembership: "العضوية:",
    btnExportExcel: "تصدير Excel",
    btnPrint: "طباعة",

    thCenterName: "اسم المركز القرآني",
    thDirectorName: "المدير / المشرف",
    thCommune: "البلدية",
    thPhone: "الهاتف",
    thStudentsCount: "عدد الطلاب",
    thUnionMembership: "عضوية الاتحاد",
    thActions: "الإجراءات",

    visibleCountPrefix: "إجمالي المراكز المعروضة:",
    visibleStudentsPrefix: "مجموع الطلاب:",
    boysPrefix: "بنين:",
    girlsPrefix: "بنات:",

    publicNotice: "مرحباً بكم! الاستبيان مفتوح للجميع لإدخال بيانات المركز القرآني مباشرة. صلاحيات الإدارة والطباعة وتدقيق البيانات مخصصة لمسؤول النظام.",
    welcomeTitle: "مرحباً بكم في المنصة الرسمية لحصر المراكز القرآنية في مالي",
    welcomeDesc: "تعبئة البيانات متاحة لكافة مدراء ومشرفي المراكز والمدارس القرآنية في مالي، ولا تتطلب أي تسجيل دخول وتستغرق أقل من دقيقتين.",
    progressTxt: "نسبة إكمال بيانات الاستبيان:",

    kpiTotalCenters: "إجمالي المراكز المسجلة",
    kpiTotalStudents: "إجمالي الطلاب والطالبات",
    kpiTopCommune: "البلدية الأكثر تسجيلاً",
    kpiUnionRatio: "نسبة الأعضاء بالاتحاد",

    pillAll: "جميع المراكز",
    pillBoys: "بنين فقط",
    pillGirls: "بنات فقط",
    pillMixte: "مشتركة",
    pillUnion: "أعضاء الاتحاد",

    receiptSuccessMsg: "تم تسجيل بيانات المركز القرآني بنجاح في المنصة الرسمية",
    receiptRefTitle: "رقم التسجيل المرجعي / N° de Référence",
    btnPrintReceipt: "طباعة الإيصال الرسمية",
    btnNewReg: "تسجيل مركز آخر"
  },
  fr: {
    mainAppTitle: "Recensement des Écoles et Centres Coraniques au Mali",
    subAppTitle: "Union des Écoles et Centres Coraniques en République du Mali",
    loginBtn: "Connexion Admin",
    logoutBtn: "Déconnexion",
    submitSuccess: "Les informations du centre ont été enregistrées avec succès !",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer ce centre coranique ?",
    accessDenied: "Cette fonctionnalité est réservée à l'administrateur. Veuillez vous connecter.",

    // Sidebar & Navigation
    mobileMenuTitle: "Menu du Système",
    navSurvey: "Formulaire d'inscription",
    navSchools: "Liste des écoles",
    navSearch: "Recherche & Filtres",
    navCommunes: "Gestion des communes",
    navExcel: "Exportation Excel",
    navPrint: "Impression des rapports",
    statCenters: "Centres enregistrés",
    statStudents: "Total des élèves",

    // Form Titles & Labels
    formTitleNew: "Nouvelle fiche de recensement",
    formTitleEdit: "Modifier la fiche du centre",
    btnSubmitNew: "Soumettre la fiche",
    btnSubmitEdit: "Mettre à jour",
    btnReset: "Réinitialiser",

    lblCenterNameAr: "Nom du centre (en arabe) *",
    lblCenterNameFr: "Nom du centre (en français) *",
    phCenterNameAr: "Saisir le nom du centre en arabe",
    phCenterNameFr: "Saisir le nom du centre en français",

    lblDirectorAr: "Nom du directeur (en arabe) *",
    lblDirectorFr: "Nom du directeur (en français) *",
    phDirectorAr: "Saisir le nom du directeur en arabe",
    phDirectorFr: "Saisir le nom du directeur en français",

    lblAddressAr: "Adresse du centre (en arabe)",
    lblAddressFr: "Adresse du centre (en français)",
    phAddressAr: "Saisir l'adresse du centre en arabe",
    phAddressFr: "Saisir l'adresse du centre en français",

    lblCommune: "Commune *",
    selectCommuneDefault: "Choisir la commune",
    lblPhone: "Numéro de téléphone *",
    phPhone: "Ex : 76 12 34 56",

    lblBoysCount: "Nombre de garçons",
    lblGirlsCount: "Nombre de filles",
    lblTotalStudents: "Total des élèves et type",

    lblUnionMem: "Le centre est-il membre de l'Union ? *",
    optMemDefault: "Choisir l'option",
    optMemYes: "Oui - Déjà membre",
    optMemNo: "Non - Pas encore membre",

    // Table & Filters
    tableTitle: "Liste des écoles enregistrées",
    phSearch: "Rechercher un centre...",
    lblFilterCommune: "Commune :",
    optFilterAll: "Toutes les communes",
    lblFilterMembership: "Adhésion :",
    btnExportExcel: "Exporter Excel",
    btnPrint: "Imprimer",

    thCenterName: "Nom du centre",
    thDirectorName: "Directeur / Responsable",
    thCommune: "Commune",
    thPhone: "Téléphone",
    thStudentsCount: "Nombre d'élèves",
    thUnionMembership: "Adhésion",
    thActions: "Actions",

    visibleCountPrefix: "Centres affichés :",
    visibleStudentsPrefix: "Total des élèves :",
    boysPrefix: "Garçons :",
    girlsPrefix: "Filles :",

    publicNotice: "Bienvenue ! Le formulaire est ouvert à tous pour saisir directement les données du centre coranique. L'accès administrateur est réservé aux responsables du système.",
    welcomeTitle: "Bienvenue sur la plateforme officielle de recensement",
    welcomeDesc: "Ce formulaire est ouvert à tous les responsables et directeurs de centres coraniques au Mali. Aucune connexion requise (moins de 2 minutes).",
    progressTxt: "Taux de complétion du formulaire :",

    kpiTotalCenters: "Centres enregistrés",
    kpiTotalStudents: "Total des élèves",
    kpiTopCommune: "Commune principale",
    kpiUnionRatio: "Taux d'adhésion",

    pillAll: "Tous les centres",
    pillBoys: "Garçons uniquement",
    pillGirls: "Filles uniquement",
    pillMixte: "Centres mixtes",
    pillUnion: "Membres de l'Union",

    receiptSuccessMsg: "La fiche du centre coranique a été enregistrée avec succès !",
    receiptRefTitle: "N° de Référence / رقم التسجيل المرجعي",
    btnPrintReceipt: "Imprimer le reçu officiel",
    btnNewReg: "Inscrire un autre centre"
  }
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx83PCEqT39I-X5GHyuAII2QkpEz_zLOYX_HCp2G6U8UvhGGMhpu6xzqMoO7yU-11R5dw/exec";

async function saveCenterToGoogleSheets(centerData) {
  try {
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(centerData)
    });
  } catch (err) {
    console.log('Error syncing with Google Sheets', err);
  }
}

async function syncFromGoogleSheets() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    if (data && data.status === 'success' && Array.isArray(data.centers) && data.centers.length > 0) {
      centersList = data.centers;
      saveDataToStorage();
      renderTable();
      updateStats();
      updateAdminKPIStats();
    }
  } catch (err) {
    console.log('Using local storage fallback', err);
  }
}

// Application Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  renderCommuneOptions();
  renderTable();
  updateStats();
  toggleGenderFields();
  setupPhoneFormattingAndProgress();
  syncFromGoogleSheets();
});

function loadStoredData() {
  // Load Centers
  const savedCenters = localStorage.getItem('mali_quran_centers');
  if (savedCenters) {
    try {
      centersList = JSON.parse(savedCenters);
    } catch (e) {
      centersList = [...DEFAULT_CENTERS];
    }
  } else {
    centersList = [...DEFAULT_CENTERS];
    saveDataToStorage();
  }

  // Load Communes
  const savedCommunes = localStorage.getItem('mali_quran_communes');
  if (savedCommunes) {
    try {
      communesList = JSON.parse(savedCommunes);
    } catch (e) {
      communesList = [...DEFAULT_COMMUNES];
    }
  } else {
    communesList = [...DEFAULT_COMMUNES];
    saveCommunesToStorage();
  }

  // Load Auth State
  const savedAuth = localStorage.getItem('mali_quran_admin_auth');
  if (savedAuth === 'true') {
    isAdminLoggedIn = true;
  } else {
    isAdminLoggedIn = false;
  }
  updateAuthUI();
}

function saveDataToStorage() {
  localStorage.setItem('mali_quran_centers', JSON.stringify(centersList));
}

function saveCommunesToStorage() {
  localStorage.setItem('mali_quran_communes', JSON.stringify(communesList));
}

// Update UI Labels Purely According to Active Language
function updateI18nLabels() {
  const dict = I18N[currentLang];
  if (!dict) return;

  // Header & Navigation
  const mainTitle = document.getElementById('main-app-title');
  const subTitle = document.getElementById('sub-app-title');
  if (mainTitle) mainTitle.textContent = dict.mainAppTitle;
  if (subTitle) subTitle.textContent = dict.subAppTitle;

  const mobTitle = document.getElementById('lbl-mobile-menu-title');
  if (mobTitle) mobTitle.textContent = dict.mobileMenuTitle;

  const nSurvey = document.getElementById('lbl-nav-survey');
  const nSchools = document.getElementById('lbl-nav-schools');
  const nSearch = document.getElementById('lbl-nav-search');
  const nCommunes = document.getElementById('lbl-nav-communes');
  const nExcel = document.getElementById('lbl-nav-excel');
  const nPrint = document.getElementById('lbl-nav-print');

  if (nSurvey) nSurvey.textContent = dict.navSurvey;
  if (nSchools) nSchools.textContent = dict.navSchools;
  if (nSearch) nSearch.textContent = dict.navSearch;
  if (nCommunes) nCommunes.textContent = dict.navCommunes;
  if (nExcel) nExcel.textContent = dict.navExcel;
  if (nPrint) nPrint.textContent = dict.navPrint;

  const stCenters = document.getElementById('lbl-stat-centers');
  const stStudents = document.getElementById('lbl-stat-students');
  if (stCenters) stCenters.textContent = dict.statCenters;
  if (stStudents) stStudents.textContent = dict.statStudents;

  // Form Header & Button Labels
  const editId = document.getElementById('center_edit_id') ? document.getElementById('center_edit_id').value : '';
  const formCardTitle = document.getElementById('form-card-title');
  if (formCardTitle) formCardTitle.textContent = editId ? dict.formTitleEdit : dict.formTitleNew;

  const pNotice = document.querySelector('#public-notice span');
  if (pNotice) pNotice.textContent = dict.publicNotice;

  const btnSubmitTxt = document.getElementById('btn-submit-txt');
  if (btnSubmitTxt) btnSubmitTxt.textContent = editId ? dict.btnSubmitEdit : dict.btnSubmitNew;

  const btnResetTxt = document.getElementById('btn-reset-txt');
  if (btnResetTxt) btnResetTxt.textContent = dict.btnReset;

  // Form Field Labels & Placeholders
  const lNameAr = document.getElementById('lbl-name-ar');
  const lNameFr = document.getElementById('lbl-name-fr');
  if (lNameAr) lNameAr.innerHTML = `${dict.lblCenterNameAr} <span class="req">*</span>`;
  if (lNameFr) lNameFr.innerHTML = `${dict.lblCenterNameFr} <span class="req">*</span>`;

  const iNameAr = document.getElementById('name_ar');
  const iNameFr = document.getElementById('name_fr');
  if (iNameAr) iNameAr.placeholder = dict.phCenterNameAr;
  if (iNameFr) iNameFr.placeholder = dict.phCenterNameFr;

  const lDirAr = document.getElementById('lbl-director-ar');
  const lDirFr = document.getElementById('lbl-director-fr');
  if (lDirAr) lDirAr.innerHTML = `${dict.lblDirectorAr} <span class="req">*</span>`;
  if (lDirFr) lDirFr.innerHTML = `${dict.lblDirectorFr} <span class="req">*</span>`;

  const iDirAr = document.getElementById('director_ar');
  const iDirFr = document.getElementById('director_fr');
  if (iDirAr) iDirAr.placeholder = dict.phDirectorAr;
  if (iDirFr) iDirFr.placeholder = dict.phDirectorFr;

  const lAddrAr = document.getElementById('lbl-address-ar');
  const lAddrFr = document.getElementById('lbl-address-fr');
  if (lAddrAr) lAddrAr.textContent = dict.lblAddressAr;
  if (lAddrFr) lAddrFr.textContent = dict.lblAddressFr;

  const lCommune = document.getElementById('lbl-commune');
  if (lCommune) lCommune.innerHTML = `${dict.lblCommune} <span class="req">*</span>`;

  const lPhone = document.getElementById('lbl-phone');
  if (lPhone) lPhone.innerHTML = `${dict.lblPhone} <span class="req">*</span>`;

  const lBoys = document.getElementById('lbl-boys-count');
  const lGirls = document.getElementById('lbl-girls-count');
  const lTotal = document.getElementById('lbl-total-students');
  if (lBoys) lBoys.innerHTML = `<i class="fa-solid fa-child" style="color: #0b5d3f;"></i> ${dict.lblBoysCount}`;
  if (lGirls) lGirls.innerHTML = `<i class="fa-solid fa-child-dress" style="color: #0b5d3f;"></i> ${dict.lblGirlsCount}`;
  if (lTotal) lTotal.textContent = dict.lblTotalStudents;

  const lUnion = document.getElementById('lbl-union-membership');
  if (lUnion) lUnion.innerHTML = `${dict.lblUnionMem} <span class="req">*</span>`;

  const oMemDef = document.getElementById('opt-mem-default');
  const oMemYes = document.getElementById('opt-mem-yes');
  const oMemNo = document.getElementById('opt-mem-no');
  if (oMemDef) oMemDef.textContent = dict.optMemDefault;
  if (oMemYes) oMemYes.textContent = dict.optMemYes;
  if (oMemNo) oMemNo.textContent = dict.optMemNo;

  // Table Header Labels & Buttons
  const tableCardTitle = document.getElementById('table-card-title');
  if (tableCardTitle) tableCardTitle.textContent = dict.tableTitle;

  const sInput = document.getElementById('search-input');
  if (sInput) sInput.placeholder = dict.phSearch;

  const lFiltCommune = document.getElementById('lbl-filter-commune');
  const lFiltMem = document.getElementById('lbl-filter-membership');
  if (lFiltCommune) lFiltCommune.textContent = dict.lblFilterCommune;
  if (lFiltMem) lFiltMem.textContent = dict.lblFilterMembership;

  const oFiltMemAll = document.getElementById('opt-filt-mem-all');
  const oFiltMemYes = document.getElementById('opt-filt-mem-yes');
  const oFiltMemNo = document.getElementById('opt-filt-mem-no');
  if (oFiltMemAll) oFiltMemAll.textContent = dict.optFilterAll;
  if (oFiltMemYes) oFiltMemYes.textContent = dict.optMemYes;
  if (oFiltMemNo) oFiltMemNo.textContent = dict.optMemNo;

  const btnExcelTxt = document.getElementById('btn-export-excel-txt');
  const btnPrintTxt = document.getElementById('btn-print-txt');
  if (btnExcelTxt) btnExcelTxt.textContent = dict.btnExportExcel;
  if (btnPrintTxt) btnPrintTxt.textContent = dict.btnPrint;

  const thCName = document.getElementById('th-center-name');
  const thDName = document.getElementById('th-director-name');
  const thComm = document.getElementById('th-commune');
  const thPh = document.getElementById('th-phone');
  const thStud = document.getElementById('th-students-count');
  const thUnion = document.getElementById('th-union-membership');
  const thAct = document.getElementById('th-actions');

  if (thCName) thCName.textContent = dict.thCenterName;
  if (thDName) thDName.textContent = dict.thDirectorName;
  if (thComm) thComm.textContent = dict.thCommune;
  if (thPh) thPh.textContent = dict.thPhone;
  if (thStud) thStud.textContent = dict.thStudentsCount;
  if (thUnion) thUnion.textContent = dict.thUnionMembership;
  if (thAct) thAct.textContent = dict.thActions;

  // Welcome Banner & Progress Labels
  const wTitle = document.getElementById('lbl-welcome-title');
  const wDesc = document.getElementById('lbl-welcome-desc');
  const pTxt = document.getElementById('lbl-progress-txt');
  if (wTitle) wTitle.textContent = dict.welcomeTitle;
  if (wDesc) wDesc.textContent = dict.welcomeDesc;
  if (pTxt) pTxt.textContent = dict.progressTxt;

  // KPI Labels
  const kpiTotC = document.getElementById('lbl-kpi-total-centers');
  const kpiTotS = document.getElementById('lbl-kpi-total-students');
  const kpiTopC = document.getElementById('lbl-kpi-top-commune');
  const kpiUnR = document.getElementById('lbl-kpi-union-ratio');
  if (kpiTotC) kpiTotC.textContent = dict.kpiTotalCenters;
  if (kpiTotS) kpiTotS.textContent = dict.kpiTotalStudents;
  if (kpiTopC) kpiTopC.textContent = dict.kpiTopCommune;
  if (kpiUnR) kpiUnR.textContent = dict.kpiUnionRatio;

  // Quick Filter Pill Labels
  const pillA = document.getElementById('lbl-pill-all');
  const pillB = document.getElementById('lbl-pill-boys');
  const pillG = document.getElementById('lbl-pill-girls');
  const pillM = document.getElementById('lbl-pill-mixte');
  const pillU = document.getElementById('lbl-pill-union');
  if (pillA) pillA.textContent = dict.pillAll;
  if (pillB) pillB.textContent = dict.pillBoys;
  if (pillG) pillG.textContent = dict.pillGirls;
  if (pillM) pillM.textContent = dict.pillMixte;
  if (pillU) pillU.textContent = dict.pillUnion;

  // Receipt Modal Labels
  const rcSuccess = document.getElementById('lbl-receipt-success-msg');
  const rcRefTitle = document.getElementById('lbl-receipt-ref-title');
  const rcBtnPrint = document.getElementById('lbl-btn-print-receipt');
  const rcBtnNew = document.getElementById('lbl-btn-new-registration');
  if (rcSuccess) rcSuccess.textContent = dict.receiptSuccessMsg;
  if (rcRefTitle) rcRefTitle.textContent = dict.receiptRefTitle;
  if (rcBtnPrint) rcBtnPrint.textContent = dict.btnPrintReceipt;
  if (rcBtnNew) rcBtnNew.textContent = dict.btnNewReg;

  // Footer Summary Prefixes
  const lblVisCnt = document.getElementById('lbl-visible-count-prefix');
  const lblVisStud = document.getElementById('lbl-visible-students-prefix');
  const lblBoysPfx = document.getElementById('lbl-boys-prefix');
  const lblGirlsPfx = document.getElementById('lbl-girls-prefix');

  if (lblVisCnt) lblVisCnt.textContent = dict.visibleCountPrefix;
  if (lblVisStud) lblVisStud.textContent = dict.visibleStudentsPrefix;
  if (lblBoysPfx) lblBoysPfx.textContent = dict.boysPrefix;
  if (lblGirlsPfx) lblGirlsPfx.textContent = dict.girlsPrefix;
}

// Dynamic Commune Name Resolution Helper
function getCommuneDisplayName(communeKey, lang = currentLang) {
  if (!communeKey || communeKey === 'ALL') {
    return lang === 'ar' ? 'جميع البلديات' : 'Toutes les communes';
  }
  const comm = communesList.find(c => c.name_fr === communeKey || c.name_ar === communeKey || c.id == communeKey);
  if (comm) {
    return lang === 'ar' ? (comm.name_ar || comm.name_fr) : (comm.name_fr || comm.name_ar);
  }
  return communeKey;
}

// Dynamic Commune Dropdowns
function renderCommuneOptions() {
  const selForm = document.getElementById('commune');
  const selFilter = document.getElementById('filter-commune');

  if (selForm) {
    const curVal = selForm.value;
    selForm.innerHTML = `<option value="">${currentLang === 'ar' ? 'اختر البلدية' : 'Choisir la commune'}</option>`;
    communesList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name_fr;
      opt.textContent = currentLang === 'ar' ? c.name_ar : c.name_fr;
      selForm.appendChild(opt);
    });
    selForm.value = curVal;
  }

  if (selFilter) {
    const curFilterVal = selFilter.value;
    selFilter.innerHTML = `<option value="ALL">${currentLang === 'ar' ? 'جميع البلديات (الكل)' : 'Toutes les communes'}</option>`;
    communesList.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name_fr;
      opt.textContent = currentLang === 'ar' ? c.name_ar : c.name_fr;
      selFilter.appendChild(opt);
    });
    selFilter.value = curFilterVal || 'ALL';
  }
}

// Toggle Language & Layout Direction
function toggleLanguage() {
  const nextLang = currentLang === 'ar' ? 'fr' : 'ar';
  setLanguage(nextLang);
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const targetLangTxt = document.getElementById('txt-target-lang');
  if (targetLangTxt) {
    targetLangTxt.textContent = lang === 'ar' ? '🇫🇷 Français' : '🇸🇦 العربية';
  }

  updateI18nLabels();
  renderCommuneOptions();
  updateAuthUI();
  renderTable();
}

// Ultra-Flexible Student Calculation & Auto-Type Detection
function calculateTotalStudents() {
  const boys = parseInt(document.getElementById('boys_count').value) || 0;
  const girls = parseInt(document.getElementById('girls_count').value) || 0;
  document.getElementById('total_students').value = boys + girls;
}

function handleStudentCountInput() {
  calculateTotalStudents();

  const boys = parseInt(document.getElementById('boys_count').value) || 0;
  const girls = parseInt(document.getElementById('girls_count').value) || 0;
  const typeInput = document.getElementById('student_gender_type');

  let autoType = 'mixte';
  if (boys > 0 && girls === 0) {
    autoType = 'garcons';
  } else if (girls > 0 && boys === 0) {
    autoType = 'filles';
  } else {
    autoType = 'mixte';
  }

  if (typeInput) typeInput.value = autoType;
  updateAutoTypeBadge(autoType);
}

function updateAutoTypeBadge(type) {
  const badge = document.getElementById('auto-type-badge');
  const label = document.getElementById('auto-type-lbl');
  if (!badge || !label) return;

  const isAr = currentLang === 'ar';
  badge.className = 'auto-type-badge';

  if (type === 'garcons') {
    badge.classList.add('badge-garcons');
    badge.innerHTML = `<i class="fa-solid fa-child"></i> <span>${isAr ? 'بنين فقط' : 'Garçons'}</span>`;
  } else if (type === 'filles') {
    badge.classList.add('badge-filles');
    badge.innerHTML = `<i class="fa-solid fa-child-dress"></i> <span>${isAr ? 'بنات فقط' : 'Filles'}</span>`;
  } else {
    badge.classList.add('badge-mixte');
    badge.innerHTML = `<i class="fa-solid fa-people-hold"></i> <span>${isAr ? 'بنين وبنات' : 'Mixte'}</span>`;
  }
}

function toggleGenderFields() {
  const typeEl = document.getElementById('student_gender_type');
  const type = typeEl ? typeEl.value : 'mixte';
  const boysGroup = document.getElementById('group-boys-count');
  const girlsGroup = document.getElementById('group-girls-count');

  if (boysGroup && girlsGroup) {
    if (type === 'garcons') {
      boysGroup.style.display = 'flex';
      girlsGroup.style.display = 'none';
      const gC = document.getElementById('girls_count');
      if (gC) gC.value = 0;
    } else if (type === 'filles') {
      boysGroup.style.display = 'none';
      girlsGroup.style.display = 'flex';
      const bC = document.getElementById('boys_count');
      if (bC) bC.value = 0;
    } else {
      boysGroup.style.display = 'flex';
      girlsGroup.style.display = 'flex';
    }
  }
  calculateTotalStudents();
}

// Edit Existing Center (Admin Only)
function editCenter(id) {
  if (!isAdminLoggedIn) {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
    return;
  }

  const center = centersList.find(c => c.id === id);
  if (!center) return;

  document.getElementById('center_edit_id').value = center.id;
  document.getElementById('name_ar').value = center.name_ar;
  document.getElementById('name_fr').value = center.name_fr;
  document.getElementById('director_ar').value = center.director_ar;
  document.getElementById('director_fr').value = center.director_fr;
  document.getElementById('address_ar').value = center.address_ar || '';
  document.getElementById('address_fr').value = center.address_fr || '';
  document.getElementById('commune').value = center.commune;
  document.getElementById('phone').value = center.phone;
  document.getElementById('boys_count').value = center.boys;
  document.getElementById('girls_count').value = center.girls;
  document.getElementById('union_membership').value = center.membership;

  handleStudentCountInput();

  // Change UI Title and Submit Button to Edit Mode
  const isAr = currentLang === 'ar';
  const formCardTitle = document.getElementById('form-card-title');
  if (formCardTitle) formCardTitle.textContent = isAr ? 'تعديل بيانات المركز القرآني' : 'Modifier la fiche du centre';
  
  const btnTxt = document.getElementById('btn-submit-txt');
  const btnIcon = document.getElementById('btn-submit-icon');
  if (btnTxt) btnTxt.textContent = isAr ? 'حفظ التعديلات' : 'Mettre à jour';
  if (btnIcon) btnIcon.className = 'fa-solid fa-floppy-disk';

  document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' });
}

// Handle Form Submission (Public Survey or Admin Edit)
function handleFormSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('center_edit_id').value;
  const nameAr = document.getElementById('name_ar').value.trim();
  const nameFr = document.getElementById('name_fr').value.trim();
  const directorAr = document.getElementById('director_ar').value.trim();
  const directorFr = document.getElementById('director_fr').value.trim();
  const addressAr = document.getElementById('address_ar').value.trim();
  const addressFr = document.getElementById('address_fr').value.trim();
  const commune = document.getElementById('commune').value;
  const phone = document.getElementById('phone').value.trim();
  const genderType = document.getElementById('student_gender_type').value;
  const boys = parseInt(document.getElementById('boys_count').value) || 0;
  const girls = parseInt(document.getElementById('girls_count').value) || 0;
  const total = boys + girls;
  const membership = document.getElementById('union_membership').value;

  if (!commune || !membership) {
    alert(currentLang === 'ar' ? "يرجى تعبئة كافة الحقول المطلوبة." : "Veuillez remplir tous les champs obligatoires.");
    return;
  }

  if (editId) {
    // Update existing center
    const index = centersList.findIndex(c => c.id == editId);
    if (index !== -1) {
      centersList[index] = {
        ...centersList[index],
        name_ar: nameAr,
        name_fr: nameFr,
        director_ar: directorAr,
        director_fr: directorFr,
        address_ar: addressAr || nameAr,
        address_fr: addressFr || nameFr,
        commune: commune,
        phone: phone,
        gender_type: genderType,
        boys: boys,
        girls: girls,
        total: total,
        membership: membership
      };
      alert(currentLang === 'ar' ? "تم تحديث بيانات المركز بنجاح!" : "Fiche du centre mise à jour avec succès !");
    }
  } else {
    // Add new center
    const newCenter = {
      id: Date.now(),
      name_ar: nameAr,
      name_fr: nameFr,
      director_ar: directorAr,
      director_fr: directorFr,
      address_ar: addressAr || nameAr,
      address_fr: addressFr || nameFr,
      commune: commune,
      phone: phone,
      gender_type: genderType,
      boys: boys,
      girls: girls,
      total: total,
      membership: membership
    };
    centersList.unshift(newCenter);
    saveDataToStorage();
    saveCenterToGoogleSheets(newCenter);
    renderTable();
    updateStats();
    showReceiptModal(newCenter);
    return;
  }

  saveDataToStorage();
  resetForm();
  renderTable();
  updateStats();
}

function resetForm() {
  document.getElementById('quran-center-form').reset();
  document.getElementById('center_edit_id').value = '';
  document.getElementById('boys_count').value = 0;
  document.getElementById('girls_count').value = 0;

  const isAr = currentLang === 'ar';
  const formCardTitle = document.getElementById('form-card-title');
  if (formCardTitle) formCardTitle.textContent = isAr ? 'إدخال بيانات جديدة' : 'Nouvelle fiche de recensement';
  
  const btnTxt = document.getElementById('btn-submit-txt');
  const btnIcon = document.getElementById('btn-submit-icon');
  if (btnTxt) btnTxt.textContent = isAr ? 'إرسال البيانات' : 'Soumettre la fiche';
  if (btnIcon) btnIcon.className = 'fa-solid fa-paper-plane';

  handleStudentCountInput();
  clearDraftForm();
  updateFormProgress();
}

// Render Data Table (Admin View)
function renderTable() {
  const tbody = document.getElementById('schools-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filterCommuneEl = document.getElementById('filter-commune');
  const filterMemEl = document.getElementById('filter-membership');
  const searchEl = document.getElementById('search-input');

  activeFilterCommune = filterCommuneEl ? filterCommuneEl.value : 'ALL';
  activeFilterMembership = filterMemEl ? filterMemEl.value : 'ALL';
  searchQuery = searchEl ? searchEl.value.toLowerCase().trim() : '';

  const filtered = getFilteredData();

  let totalBoysVisible = 0;
  let totalGirlsVisible = 0;
  let totalStudentsVisible = 0;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 24px; color: #888;">
          <i class="fa-solid fa-folder-open" style="font-size: 24px; margin-bottom: 8px;"></i><br>
          ${currentLang === 'ar' ? 'لا توجد مراكز قرآنية مطابقة للبحث' : 'Aucun centre coranique trouvé'}
        </td>
      </tr>
    `;
  } else {
    filtered.forEach((center, index) => {
      totalBoysVisible += center.boys;
      totalGirlsVisible += center.girls;
      totalStudentsVisible += center.total;

      const tr = document.createElement('tr');

      const isYes = center.membership === 'Oui';
      const badgeClass = isYes ? 'badge-yes' : 'badge-no';
      const badgeText = isYes ? (currentLang === 'ar' ? 'نعم' : 'Oui') : (currentLang === 'ar' ? 'لا' : 'Non');

      const isAr = currentLang === 'ar';
      const titleView = isAr ? 'عرض التفاصيل' : 'Voir les détails';
      const titleEdit = isAr ? 'تعديل البيانات' : 'Modifier les données';
      const titleDelete = isAr ? 'حذف المركز' : 'Supprimer le centre';

      const adminActionBtns = isAdminLoggedIn ? `
        <button class="action-btn-icon" onclick="editCenter(${center.id})" title="${titleEdit}"><i class="fa-solid fa-pen" style="color:var(--primary-color);"></i></button>
        <button class="action-btn-icon" onclick="deleteCenter(${center.id})" title="${titleDelete}"><i class="fa-solid fa-trash action-btn-delete"></i></button>
      ` : '';

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <strong>${center.name_ar}</strong><br>
          <small class="text-muted">${center.name_fr}</small>
        </td>
        <td>
          ${center.director_ar}<br>
          <small class="text-muted">${center.director_fr}</small>
        </td>
        <td><span class="commune-pill">${getCommuneDisplayName(center.commune)}</span></td>
        <td><i class="fa-solid fa-phone" style="font-size: 11px; opacity:0.7;"></i> ${center.phone}</td>
        <td>
          <strong>${center.total}</strong><br>
          <small class="text-muted">(👨 ${center.boys} | 👩 ${center.girls})</small>
        </td>
        <td><span class="badge-status ${badgeClass}">${badgeText}</span></td>
        <td class="text-center">
          <div style="display:flex; gap:6px; justify-content:center;">
            <button class="action-btn-icon" onclick="viewDetails(${center.id})" title="${titleView}"><i class="fa-solid fa-eye"></i></button>
            ${adminActionBtns}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('visible-count').textContent = filtered.length;
  document.getElementById('visible-students').textContent = totalStudentsVisible;
  document.getElementById('visible-boys').textContent = totalBoysVisible;
  document.getElementById('visible-girls').textContent = totalGirlsVisible;

  updateAdminKPIStats();
}

let activeQuickFilter = 'ALL';

function setQuickFilterType(type, btnElement) {
  activeQuickFilter = type;
  document.querySelectorAll('.quick-filter-pills .pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const filterMemEl = document.getElementById('filter-membership');
  if (type === 'union' && filterMemEl) {
    filterMemEl.value = 'Oui';
  }

  renderTable();
}

function updateAdminKPIStats() {
  const totalCenters = centersList.length;
  let totalStudents = 0;
  let unionMembersCount = 0;
  const communeCounts = {};

  centersList.forEach(c => {
    totalStudents += c.total || 0;
    if (c.membership === 'Oui') unionMembersCount++;
    if (c.commune) {
      communeCounts[c.commune] = (communeCounts[c.commune] || 0) + 1;
    }
  });

  let topCommune = '-';
  let maxCnt = 0;
  Object.keys(communeCounts).forEach(comm => {
    if (communeCounts[comm] > maxCnt) {
      maxCnt = communeCounts[comm];
      topCommune = comm;
    }
  });

  const unionRatio = totalCenters > 0 ? Math.round((unionMembersCount / totalCenters) * 100) : 0;

  const kpiTotC = document.getElementById('kpi-total-centers');
  const kpiTotS = document.getElementById('kpi-total-students');
  const kpiTopC = document.getElementById('kpi-top-commune');
  const kpiUnR = document.getElementById('kpi-union-ratio');

  if (kpiTotC) kpiTotC.textContent = totalCenters;
  if (kpiTotS) kpiTotS.textContent = totalStudents;
  if (kpiTopC) kpiTopC.textContent = topCommune;
  if (kpiUnR) kpiUnR.textContent = `${unionRatio}%`;
}

function handlePhoneInput(input) {
  if (!input) return;
  const raw = input.value;
  const hasPlus = raw.startsWith('+');
  let digits = raw.replace(/\D/g, '');

  if (hasPlus) {
    if (digits.length > 12) digits = digits.substring(0, 12);
    let formatted = '+' + digits.substring(0, 3);
    let rest = digits.substring(3);
    for (let i = 0; i < rest.length; i++) {
      if (i % 2 === 0) formatted += ' ';
      formatted += rest[i];
    }
    input.value = formatted;
  } else {
    if (digits.length > 8) digits = digits.substring(0, 8);
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 2 === 0) formatted += ' ';
      formatted += digits[i];
    }
    input.value = formatted;
  }
  updateFormProgress();
}

function setupPhoneFormattingAndProgress() {
  const inputs = document.querySelectorAll('#quran-center-form input, #quran-center-form select');
  inputs.forEach(inp => {
    inp.addEventListener('input', updateFormProgress);
    inp.addEventListener('change', updateFormProgress);
    inp.addEventListener('keyup', updateFormProgress);
  });
  updateFormProgress();
  setupDraftAutoSave();
}

function setupDraftAutoSave() {
  const form = document.getElementById('quran-center-form');
  if (!form) return;

  form.addEventListener('input', saveDraftForm);
  form.addEventListener('change', saveDraftForm);

  restoreDraftForm();
}

function saveDraftForm() {
  const editId = document.getElementById('center_edit_id').value;
  if (editId) return; // Don't auto-save edit mode drafts

  const draft = {
    name_ar: document.getElementById('name_ar').value,
    name_fr: document.getElementById('name_fr').value,
    director_ar: document.getElementById('director_ar').value,
    director_fr: document.getElementById('director_fr').value,
    address_ar: document.getElementById('address_ar').value,
    address_fr: document.getElementById('address_fr').value,
    commune: document.getElementById('commune').value,
    phone: document.getElementById('phone').value,
    boys: document.getElementById('boys_count').value,
    girls: document.getElementById('girls_count').value,
    union: document.getElementById('union_membership').value
  };
  localStorage.setItem('mali_quran_form_draft', JSON.stringify(draft));
}

function restoreDraftForm() {
  const savedDraft = localStorage.getItem('mali_quran_form_draft');
  if (!savedDraft) return;

  try {
    const draft = JSON.parse(savedDraft);
    const editId = document.getElementById('center_edit_id').value;
    if (draft && !editId) {
      if (draft.name_ar) document.getElementById('name_ar').value = draft.name_ar;
      if (draft.name_fr) document.getElementById('name_fr').value = draft.name_fr;
      if (draft.director_ar) document.getElementById('director_ar').value = draft.director_ar;
      if (draft.director_fr) document.getElementById('director_fr').value = draft.director_fr;
      if (draft.address_ar) document.getElementById('address_ar').value = draft.address_ar;
      if (draft.address_fr) document.getElementById('address_fr').value = draft.address_fr;
      if (draft.commune) document.getElementById('commune').value = draft.commune;
      if (draft.phone) document.getElementById('phone').value = draft.phone;
      if (draft.boys) document.getElementById('boys_count').value = draft.boys;
      if (draft.girls) document.getElementById('girls_count').value = draft.girls;
      if (draft.union) document.getElementById('union_membership').value = draft.union;
      handleStudentCountInput();
      updateFormProgress();
    }
  } catch (e) {}
}

function clearDraftForm() {
  localStorage.removeItem('mali_quran_form_draft');
}

function updateFormProgress() {
  const nameAr = document.getElementById('name_ar') ? document.getElementById('name_ar').value.trim() : '';
  const nameFr = document.getElementById('name_fr') ? document.getElementById('name_fr').value.trim() : '';
  const directorAr = document.getElementById('director_ar') ? document.getElementById('director_ar').value.trim() : '';
  const directorFr = document.getElementById('director_fr') ? document.getElementById('director_fr').value.trim() : '';
  const commune = document.getElementById('commune') ? document.getElementById('commune').value : '';
  const phone = document.getElementById('phone') ? document.getElementById('phone').value.replace(/\s/g, '').trim() : '';
  const boys = parseInt(document.getElementById('boys_count').value) || 0;
  const girls = parseInt(document.getElementById('girls_count').value) || 0;
  const union = document.getElementById('union_membership') ? document.getElementById('union_membership').value : '';

  let filled = 0;
  let totalFields = 8;

  if (nameAr) filled++;
  if (nameFr) filled++;
  if (directorAr) filled++;
  if (directorFr) filled++;
  if (commune) filled++;
  if (phone.length >= 8) filled++;
  if (boys > 0 || girls > 0) filled++;
  if (union) filled++;

  const percent = Math.round((filled / totalFields) * 100);
  const fillEl = document.getElementById('survey-progress-fill');
  const txtEl = document.getElementById('progress-percent');
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (txtEl) txtEl.textContent = `${percent}%`;
}

let currentReceiptData = null;

function showReceiptModal(center) {
  const isAr = currentLang === 'ar';
  const refCode = `AECMEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  currentReceiptData = { center, refCode };

  const refEl = document.getElementById('receipt-ref-code');
  if (refEl) refEl.textContent = refCode;

  const grid = document.getElementById('receipt-body-grid');
  if (grid) {
    grid.innerHTML = `
      <div class="receipt-item">
        <label>${isAr ? 'اسم المركز القرآني' : 'Nom du centre'}</label>
        <span>${center.name_ar} (${center.name_fr})</span>
      </div>
      <div class="receipt-item">
        <label>${isAr ? 'المدير / المشرف' : 'Directeur / Responsable'}</label>
        <span>${center.director_ar} (${center.director_fr})</span>
      </div>
      <div class="receipt-item">
        <label>${isAr ? 'البلدية' : 'Commune'}</label>
        <span>${getCommuneDisplayName(center.commune, currentLang)}</span>
      </div>
      <div class="receipt-item">
        <label>${isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
        <span>${center.phone}</span>
      </div>
      <div class="receipt-item">
        <label>${isAr ? 'عدد الطلاب والطالبات' : 'Nombre d\'élèves'}</label>
        <span>${center.total} (👨 ${center.boys} | 👩 ${center.girls})</span>
      </div>
      <div class="receipt-item">
        <label>${isAr ? 'عضوية الاتحاد' : 'Adhésion'}</label>
        <span>${center.membership === 'Oui' ? (isAr ? 'نعم - منضم سابقاً' : 'Oui - Membre') : (isAr ? 'لا - غير منضم بعد' : 'Non - Pas encore membre')}</span>
      </div>
    `;
  }

  const modal = document.getElementById('receipt-modal');
  if (modal) modal.classList.add('active');
}

function closeReceiptModalAndReset() {
  const modal = document.getElementById('receipt-modal');
  if (modal) modal.classList.remove('active');
  resetForm();
}

function printRegistrationReceipt() {
  if (!currentReceiptData) return;
  const { center, refCode } = currentReceiptData;
  const isAr = currentLang === 'ar';

  const printRefEl = document.getElementById('receipt-print-ref-code');
  const printDateEl = document.getElementById('receipt-print-date');

  if (printRefEl) printRefEl.textContent = refCode;
  if (printDateEl) printDateEl.textContent = new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR');

  const tbody = document.getElementById('receipt-print-table-body');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <th style="width:32%; text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'اسم المركز القرآني' : 'Nom du centre'}</th>
        <td><strong>${center.name_ar}</strong> / <small>${center.name_fr}</small></td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'اسم المدير / المشرف' : 'Directeur / Responsable'}</th>
        <td>${center.director_ar} / <small>${center.director_fr}</small></td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'البلدية والموقع' : 'Commune'}</th>
        <td>${getCommuneDisplayName(center.commune, currentLang)}</td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'العنوان التفصيلي' : 'Adresse'}</th>
        <td>${isAr ? (center.address_ar || center.name_ar) : (center.address_fr || center.name_fr)}</td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'رقم الهاتف' : 'Téléphone'}</th>
        <td>${center.phone}</td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'إجمالي عدد الطلاب' : 'Total Élèves'}</th>
        <td><strong>${center.total} طالب وطالبة</strong> (بنين: ${center.boys} | بنات: ${center.girls})</td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'نوع فئات الطلاب' : 'Type de centre'}</th>
        <td>${center.gender_type === 'garcons' ? (isAr ? 'بنين فقط' : 'Garçons uniquement') : center.gender_type === 'filles' ? (isAr ? 'بنات فقط' : 'Filles uniquement') : (isAr ? 'مشترك (بنين وبنات)' : 'Mixte')}</td>
      </tr>
      <tr>
        <th style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold; background:#f0f7f2;">${isAr ? 'عضوية الاتحاد' : 'Adhésion AECMEC'}</th>
        <td>${center.membership === 'Oui' ? (isAr ? 'عضو منضم بالاتحاد' : 'Membre AECMEC') : (isAr ? 'غير منضم بالاتحاد' : 'Non membre')}</td>
      </tr>
    `;
  }

  document.body.classList.add('printing-receipt');

  const cleanupPrint = () => {
    document.body.classList.remove('printing-receipt');
    window.removeEventListener('afterprint', cleanupPrint);
  };
  window.addEventListener('afterprint', cleanupPrint);

  window.print();

  setTimeout(cleanupPrint, 3000);
}

function getFilteredData() {
  const filterCommuneEl = document.getElementById('filter-commune');
  const filterMemEl = document.getElementById('filter-membership');
  const searchEl = document.getElementById('search-input');

  activeFilterCommune = filterCommuneEl ? filterCommuneEl.value : 'ALL';
  activeFilterMembership = filterMemEl ? filterMemEl.value : 'ALL';
  searchQuery = searchEl ? searchEl.value.toLowerCase().trim() : '';

  return centersList.filter(center => {
    const matchCommune = activeFilterCommune === 'ALL' || center.commune === activeFilterCommune;
    const matchMembership = activeFilterMembership === 'ALL' || center.membership === activeFilterMembership;
    
    let matchQuick = true;
    if (activeQuickFilter === 'garcons') matchQuick = center.gender_type === 'garcons';
    else if (activeQuickFilter === 'filles') matchQuick = center.gender_type === 'filles';
    else if (activeQuickFilter === 'mixte') matchQuick = center.gender_type === 'mixte';
    else if (activeQuickFilter === 'union') matchQuick = center.membership === 'Oui';

    const textSearch = (
      center.name_ar + ' ' +
      center.name_fr + ' ' +
      center.director_ar + ' ' +
      center.director_fr + ' ' +
      center.phone + ' ' +
      center.commune
    ).toLowerCase();

    const matchSearch = !searchQuery || textSearch.includes(searchQuery);

    return matchCommune && matchMembership && matchQuick && matchSearch;
  });
}

function filterTable() {
  renderTable();
}

function updateStats() {
  const totalCenters = centersList.length;
  const totalStudents = centersList.reduce((acc, curr) => acc + curr.total, 0);

  const elCenters = document.getElementById('side-stat-centers');
  const elStudents = document.getElementById('side-stat-students');

  if (elCenters) elCenters.textContent = totalCenters;
  if (elStudents) elStudents.textContent = totalStudents;
}

// View Center Details
function viewDetails(id) {
  const center = centersList.find(c => c.id === id);
  if (!center) return;

  document.getElementById('det-center-title').textContent = center.name_ar + " | " + center.name_fr;
  
  const content = document.getElementById('det-content');
  content.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 14px; font-size:14px;">
      <div><strong>اسم المركز / Nom:</strong><br>${center.name_ar}<br><small>${center.name_fr}</small></div>
      <div><strong>اسم المدير / Directeur:</strong><br>${center.director_ar}<br><small>${center.director_fr}</small></div>
      <div><strong>البلدية / Commune:</strong><br>${center.commune}</div>
      <div><strong>الهاتف / Téléphone:</strong><br>${center.phone}</div>
      <div><strong>عضوية الاتحاد / Membre:</strong><br>${center.membership === 'Oui' ? 'نعم (Oui)' : 'لا (Non)'}</div>
      <div><strong>تفاصيل الطلاب / Élèves:</strong><br>الإجمالي: ${center.total} (بنين: ${center.boys} - بنات: ${center.girls})</div>
      <div><strong>العنوان / Adresse:</strong><br>${center.address_ar || '-'} / ${center.address_fr || '-'}</div>
    </div>
  `;

  document.getElementById('details-modal').classList.add('active');
}

function closeDetailsModal() {
  document.getElementById('details-modal').classList.remove('active');
}

// Delete Center (Guarded by Admin Auth)
function deleteCenter(id) {
  if (!isAdminLoggedIn) {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
    return;
  }

  if (confirm(I18N[currentLang].confirmDelete)) {
    centersList = centersList.filter(c => c.id !== id);
    saveDataToStorage();
    renderTable();
    updateStats();
  }
}

// ----------------------------------------------------
// EXPORT FORMATTED EXCEL
// ----------------------------------------------------
function exportFormattedExcel() {
  if (!isAdminLoggedIn) {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
    return;
  }

  const filtered = getFilteredData();
  const selectedCommune = document.getElementById('filter-commune').value;

  if (filtered.length === 0) {
    alert(currentLang === 'ar' ? 'لا توجد بيانات لتصديرها.' : 'Aucune donnée à exporter.');
    return;
  }

  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>المراكز القرآنية</x:Name>
              <x:WorksheetOptions>
                <x:DisplayRightToLeft/>
                <x:Print>
                  <x:ValidPrinterInfo/>
                </x:Print>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .header-title { background-color: #0b5d3f; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; padding: 12px; }
        .header-sub { background-color: #07432d; color: #d4af37; font-size: 12pt; text-align: center; padding: 6px; }
        .meta-info { background-color: #e8efe9; font-size: 11pt; padding: 8px; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #0b5d3f; color: #ffffff; font-size: 11pt; font-weight: bold; border: 1px solid #04281b; padding: 8px; text-align: center; }
        td { border: 1px solid #cccccc; padding: 8px; text-align: center; font-size: 10.5pt; }
        .alt-row { background-color: #f7faf8; }
        .total-row { background-color: #d1fae5; font-weight: bold; font-size: 11pt; border-top: 2px solid #0b5d3f; }
        .badge-oui { color: #065f46; font-weight: bold; }
        .badge-non { color: #991b1b; font-weight: bold; }
      </style>
    </head>
    <body dir="rtl">
      <table>
        <tr>
          <td colspan="10" class="header-title">جمهورية مالي - اتحاد مدارس ومراكز تحفيظ القرآن الكريم</td>
        </tr>
        <tr>
          <td colspan="10" class="header-sub">République du Mali - Union des Écoles et Centres Coraniques</td>
        </tr>
        <tr>
          <td colspan="5" class="meta-info">تاريخ التصدير: ${new Date().toLocaleDateString('ar-MA')}</td>
          <td colspan="5" class="meta-info">البلدية المحددة: ${selectedCommune === 'ALL' ? 'جميع البلديات (Toutes)' : selectedCommune}</td>
        </tr>
        <tr><th> </th></tr>
        <thead>
          <tr>
            <th>#</th>
            <th>اسم المركز (بالعربية)</th>
            <th>Nom du centre (Français)</th>
            <th>اسم المدير / المشرف</th>
            <th>البلدية (Commune)</th>
            <th>رقم الهاتف</th>
            <th>عدد البنين</th>
            <th>عدد البنات</th>
            <th>إجمالي الطلاب</th>
            <th>عضوية الاتحاد</th>
          </tr>
        </thead>
        <tbody>
  `;

  let sumBoys = 0;
  let sumGirls = 0;
  let sumTotal = 0;

  filtered.forEach((c, idx) => {
    sumBoys += c.boys;
    sumGirls += c.girls;
    sumTotal += c.total;
    const isAlt = idx % 2 === 1 ? 'class="alt-row"' : '';
    const memText = c.membership === 'Oui' ? '<span class="badge-oui">نعم (Oui)</span>' : '<span class="badge-non">لا (Non)</span>';

    html += `
      <tr ${isAlt}>
        <td>${idx + 1}</td>
        <td><b>${c.name_ar}</b></td>
        <td>${c.name_fr}</td>
        <td>${c.director_ar} (${c.director_fr})</td>
        <td>${c.commune}</td>
        <td>${c.phone}</td>
        <td>${c.boys}</td>
        <td>${c.girls}</td>
        <td><b>${c.total}</b></td>
        <td>${memText}</td>
      </tr>
    `;
  });

  html += `
        <tr class="total-row">
          <td colspan="6" style="text-align:left; padding-left:14px;"><b>الإجمالي الكلي (Total Général):</b></td>
          <td><b>${sumBoys}</b></td>
          <td><b>${sumGirls}</b></td>
          <td><b>${sumTotal}</b></td>
          <td><b>${filtered.length} مراكز</b></td>
        </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Mali_Quran_Centers_${selectedCommune.replace(/\s+/g, '_')}_${Date.now()}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Navigation Tab Switches & Mobile Menu
function switchTab(tabId) {
  if (tabId === 'tab-survey') {
    document.getElementById('survey-section').scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'tab-schools-list') {
    if (isAdminLoggedIn) {
      document.getElementById('list-section').scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(I18N[currentLang].accessDenied);
      openLoginModal();
    }
  }
  closeMobileMenu();
}

function scrollToFilters() {
  if (isAdminLoggedIn) {
    document.getElementById('list-section').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('search-input').focus();
  } else {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
  }
  closeMobileMenu();
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.remove('active');
}

// Auth Login Modal & Handlers
function openLoginModal() {
  document.getElementById('login-modal').classList.add('active');
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.remove('active');
}

const DEFAULT_ADMIN_EMAIL = 'imamboune@yahoo.fr';
const DEFAULT_ADMIN_PASS = 'NANA@fatima2';

function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const storedPass = localStorage.getItem('mali_quran_admin_password') || DEFAULT_ADMIN_PASS;

  if (email && (pass === storedPass || pass === DEFAULT_ADMIN_PASS)) {
    isAdminLoggedIn = true;
    localStorage.setItem('mali_quran_admin_auth', 'true');
    updateAuthUI();
    closeLoginModal();
    alert(currentLang === 'ar' ? 'تم تسجيل الدخول بنجاح كمسؤول النظام.' : 'Connexion réussie en tant qu\'administrateur.');
  } else {
    alert(currentLang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Identifiants incorrects.');
  }
}

function handleLogout() {
  isAdminLoggedIn = false;
  localStorage.removeItem('mali_quran_admin_auth');
  updateAuthUI();
  alert(currentLang === 'ar' ? 'تم تسجيل الخروج.' : 'Déconnexion effectuée.');
}

function openChangePassModal() {
  document.getElementById('change-pass-modal').classList.add('active');
}

function closeChangePassModal() {
  document.getElementById('change-pass-modal').classList.remove('active');
  const cP = document.getElementById('cur-pass-input');
  const nP = document.getElementById('new-pass-input');
  if (cP) cP.value = '';
  if (nP) nP.value = '';
}

function handleChangePassword(e) {
  e.preventDefault();
  const curPass = document.getElementById('cur-pass-input').value;
  const newPass = document.getElementById('new-pass-input').value;
  const storedPass = localStorage.getItem('mali_quran_admin_password') || DEFAULT_ADMIN_PASS;

  if (curPass !== storedPass) {
    alert(currentLang === 'ar' ? 'كلمة المرور الحالية غير صحيحة.' : 'Mot de passe actuel incorrect.');
    return;
  }

  if (!newPass || newPass.length < 4) {
    alert(currentLang === 'ar' ? 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل.' : 'Mot de passe trop court.');
    return;
  }

  localStorage.setItem('mali_quran_admin_password', newPass);
  closeChangePassModal();
  alert(currentLang === 'ar' ? 'تم تغيير كلمة المرور بنجاح!' : 'Mot de passe modifié avec succès !');
}

function downloadBackupJSON() {
  if (!isAdminLoggedIn) return;
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    centers: centersList,
    communes: communesList
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `AECMEC_Mali_Backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

function triggerRestoreJSON() {
  if (!isAdminLoggedIn) return;
  const fileInput = document.getElementById('restore-file-input');
  if (fileInput) fileInput.click();
}

function restoreBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.centers && Array.isArray(data.centers)) {
        centersList = data.centers;
        saveDataToStorage();
      }
      if (data && data.communes && Array.isArray(data.communes)) {
        communesList = data.communes;
        saveCommunesToStorage();
      }
      renderCommuneOptions();
      renderTable();
      updateAdminKPIStats();
      alert(currentLang === 'ar' ? "تمت استعادة النسخة الاحتياطية بنجاح!" : "Restauration réussie !");
    } catch (err) {
      alert(currentLang === 'ar' ? "خطأ في ملف النسخة الاحتياطية." : "Fichier de sauvegarde invalide.");
    }
  };
  reader.readAsText(file);
}

function updateAuthUI() {
  const container = document.getElementById('auth-status-container');
  const sidebar = document.getElementById('app-sidebar');
  const mainLayout = document.querySelector('.main-layout');
  const listSection = document.getElementById('list-section');
  const publicNotice = document.getElementById('public-notice');
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  const footerAuthTrigger = document.getElementById('footer-auth-trigger');

  document.body.classList.toggle('admin-mode', isAdminLoggedIn);

  if (isAdminLoggedIn) {
    container.innerHTML = `
      <button class="auth-btn" style="background:#0b5d3f; color:#fff;" onclick="handleLogout()">
        <i class="fa-solid fa-user-check"></i> ${I18N[currentLang].logoutBtn}
      </button>
      <button class="auth-btn" style="background:#edf5f0; color:#0b5d3f; border:1px solid #cbe0d4;" onclick="openChangePassModal()" title="تغيير كلمة المرور">
        <i class="fa-solid fa-key"></i>
      </button>
    `;
    if (footerAuthTrigger) {
      footerAuthTrigger.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> <span>خروج المسؤول</span>`;
      footerAuthTrigger.onclick = handleLogout;
    }
    if (sidebar) sidebar.classList.remove('hidden-public');
    if (bottomNav) bottomNav.classList.remove('hidden-public');
    if (mainLayout) mainLayout.classList.remove('full-width');
    if (listSection) listSection.style.display = 'block';
    if (publicNotice) publicNotice.style.display = 'none';
  } else {
    container.innerHTML = `
      <button class="auth-btn" onclick="openLoginModal()">
        <i class="fa-solid fa-lock"></i> ${I18N[currentLang].loginBtn}
      </button>
    `;
    if (footerAuthTrigger) {
      footerAuthTrigger.innerHTML = `<i class="fa-solid fa-lock"></i> <span>دخول المسؤول</span>`;
      footerAuthTrigger.onclick = openLoginModal;
    }
    if (sidebar) sidebar.classList.add('hidden-public');
    if (bottomNav) bottomNav.classList.add('hidden-public');
    if (mainLayout) mainLayout.classList.add('full-width');
    if (listSection) listSection.style.display = 'none';
    if (publicNotice) publicNotice.style.display = 'none';
  }
}

// ----------------------------------------------------
// COMMUNE MANAGEMENT SYSTEM (ADMIN ONLY)
// ----------------------------------------------------
function openCommuneModal() {
  if (!isAdminLoggedIn) {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
    return;
  }
  renderCommunesTable();
  document.getElementById('commune-modal').classList.add('active');
  closeMobileMenu();
}

function closeCommuneModal() {
  document.getElementById('commune-modal').classList.remove('active');
  resetCommuneForm();
}

function renderCommunesTable() {
  const tbody = document.getElementById('communes-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  communesList.forEach(c => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-color)';
    tr.innerHTML = `
      <td style="padding: 8px 12px; text-align: right; font-weight: 600;">${c.name_ar}</td>
      <td style="padding: 8px 12px; text-align: left; font-weight: 500;">${c.name_fr}</td>
      <td style="padding: 8px; text-align: center;">
        <div style="display:flex; gap:6px; justify-content:center;">
          <button type="button" class="action-btn-icon" onclick="editCommune('${c.id}')" title="تعديل"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="action-btn-icon" onclick="deleteCommune('${c.id}')" title="حذف"><i class="fa-solid fa-trash action-btn-delete"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleCommuneSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('commune-edit-id').value;
  const nameAr = document.getElementById('commune-name-ar').value.trim();
  const nameFr = document.getElementById('commune-name-fr').value.trim();

  if (!nameAr || !nameFr) return;

  if (editId) {
    const item = communesList.find(c => c.id === editId);
    if (item) {
      item.name_ar = nameAr;
      item.name_fr = nameFr;
    }
  } else {
    communesList.push({
      id: 'c_' + Date.now(),
      name_ar: nameAr,
      name_fr: nameFr
    });
  }

  saveCommunesToStorage();
  resetCommuneForm();
  renderCommunesTable();
  renderCommuneOptions();
  renderTable();
}

function editCommune(id) {
  const item = communesList.find(c => c.id === id);
  if (!item) return;
  document.getElementById('commune-edit-id').value = item.id;
  document.getElementById('commune-name-ar').value = item.name_ar;
  document.getElementById('commune-name-fr').value = item.name_fr;
  document.getElementById('commune-form-btn-txt').textContent = currentLang === 'ar' ? 'حفظ' : 'Enregistrer';
}

function deleteCommune(id) {
  const item = communesList.find(c => c.id === id);
  if (!item) return;

  const isUsed = centersList.some(cnt => cnt.commune === item.name_fr || cnt.commune === item.name_ar);
  if (isUsed) {
    alert(currentLang === 'ar' ? `لا يمكن حذف البلدية "${item.name_ar}" لأنها مستخدمة في مراكز مسجلة.` : `Impossible de supprimer la commune "${item.name_fr}" car elle est liée à des centres.`);
    return;
  }

  if (confirm(currentLang === 'ar' ? `هل أنت تأكد من حذف البلدية "${item.name_ar}"؟` : `Voulez-vous supprimer la commune "${item.name_fr}" ?`)) {
    communesList = communesList.filter(c => c.id !== id);
    saveCommunesToStorage();
    renderCommunesTable();
    renderCommuneOptions();
    renderTable();
  }
}

function resetCommuneForm() {
  document.getElementById('commune-form').reset();
  document.getElementById('commune-edit-id').value = '';
  document.getElementById('commune-form-btn-txt').textContent = currentLang === 'ar' ? 'إضافة' : 'Ajouter';
}

// ----------------------------------------------------
// PRINT OPTIONS, CUSTOM COMMUNE REORDERING & REPORT (ADMIN ONLY)
// ----------------------------------------------------
let printCommunesOrder = [];

function formatCenterCountText(num, isAr) {
  if (!isAr) return `${num} ${num > 1 ? 'centres' : 'centre'}`;
  if (num === 0) return 'لا توجد مراكز';
  if (num === 1) return 'مركز واحد';
  if (num === 2) return 'مركزيْن';
  if (num >= 3 && num <= 10) return `${num} مراكز`;
  return `${num} مركزاً`;
}

function triggerPrintReport() {
  if (!isAdminLoggedIn) {
    alert(I18N[currentLang].accessDenied);
    openLoginModal();
    return;
  }

  const filtered = getFilteredData();
  if (filtered.length === 0) {
    alert(currentLang === 'ar' ? 'لا توجد بيانات مطابقة للطباعة.' : 'Aucune donnée à imprimer.');
    return;
  }

  // Extract unique communes present in filtered dataset
  const uniqueCommunes = Array.from(new Set(filtered.map(c => c.commune || 'غير محدد')));
  printCommunesOrder = [...uniqueCommunes];

  renderPrintCommunesOrderList();
  document.getElementById('print-options-modal').classList.add('active');
  closeMobileMenu();
}

function closePrintOptionsModal() {
  document.getElementById('print-options-modal').classList.remove('active');
}

function renderPrintCommunesOrderList() {
  const container = document.getElementById('print-communes-order-list');
  if (!container) return;
  container.innerHTML = '';

  const isAr = currentLang === 'ar';
  const filtered = getFilteredData();

  printCommunesOrder.forEach((communeName, idx) => {
    const communeObj = communesList.find(c => c.name_fr === communeName || c.name_ar === communeName);
    const dispName = communeObj ? (isAr ? `${communeObj.name_ar} (${communeObj.name_fr})` : `${communeObj.name_fr}`) : communeName;
    const centerCount = filtered.filter(c => c.commune === communeName).length;

    const div = document.createElement('div');
    div.className = 'commune-order-item';
    div.innerHTML = `
      <span>📌 <strong>${dispName}</strong> <small style="color:#666; margin-right:8px;">(${formatCenterCountText(centerCount, isAr)})</small></span>
      <div class="order-actions">
        <button type="button" class="commune-order-btn" onclick="movePrintCommune(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.4;"' : ''} title="تقديم للأعلى">▲</button>
        <button type="button" class="commune-order-btn" onclick="movePrintCommune(${idx}, 1)" ${idx === printCommunesOrder.length - 1 ? 'disabled style="opacity:0.4;"' : ''} title="تأخير للأسفل">▼</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function movePrintCommune(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= printCommunesOrder.length) return;

  const temp = printCommunesOrder[index];
  printCommunesOrder[index] = printCommunesOrder[newIndex];
  printCommunesOrder[newIndex] = temp;

  document.getElementById('print-sort-type').value = 'custom';
  renderPrintCommunesOrderList();
}

function handlePrintSortChange() {
  const sortType = document.getElementById('print-sort-type').value;
  const filtered = getFilteredData();

  if (sortType === 'alpha') {
    printCommunesOrder.sort((a, b) => a.localeCompare(b, currentLang === 'ar' ? 'ar' : 'fr'));
  } else if (sortType === 'centers_desc') {
    printCommunesOrder.sort((a, b) => {
      const countA = filtered.filter(c => c.commune === a).length;
      const countB = filtered.filter(c => c.commune === b).length;
      return countB - countA;
    });
  } else if (sortType === 'students_desc') {
    printCommunesOrder.sort((a, b) => {
      const sumA = filtered.filter(c => c.commune === a).reduce((acc, curr) => acc + curr.total, 0);
      const sumB = filtered.filter(c => c.commune === b).reduce((acc, curr) => acc + curr.total, 0);
      return sumB - sumA;
    });
  }
  renderPrintCommunesOrderList();
}

function executePrintReport() {
  const filtered = getFilteredData();
  const selectedCommune = document.getElementById('filter-commune').value;
  const showAddressCol = document.getElementById('print-show-address') ? document.getElementById('print-show-address').checked : true;

  const now = new Date();
  const isAr = currentLang === 'ar';

  const dayStr = String(now.getDate()).padStart(2, '0');
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const yearStr = now.getFullYear();
  document.getElementById('print-date').textContent = `${dayStr} / ${monthStr} / ${yearStr}`;
  document.getElementById('print-commune-name').textContent = getCommuneDisplayName(selectedCommune, currentLang);

  // Update Print Table Headers based on language & address column choice
  const printThead = document.querySelector('.print-table thead');
  if (printThead) {
    const col4Title = showAddressCol 
      ? (isAr ? 'العنوان / الحي' : 'Adresse / Quartier')
      : (isAr ? 'البلدية' : 'Commune');

    printThead.innerHTML = `
      <tr>
        <th style="width: 30px;">#</th>
        <th style="width: 24%;">${isAr ? 'اسم المركز القرآني' : 'Nom du centre'}</th>
        <th style="width: 18%;">${isAr ? 'المدير / المشرف' : 'Directeur / Responsable'}</th>
        <th style="width: 18%;">${col4Title}</th>
        <th style="width: 14%; white-space: nowrap;">${isAr ? 'الهاتف' : 'Téléphone'}</th>
        <th style="width: 55px;">${isAr ? 'بنين' : 'Garçons'}</th>
        <th style="width: 55px;">${isAr ? 'بنات' : 'Filles'}</th>
        <th style="width: 60px;">${isAr ? 'المجموع' : 'Total'}</th>
        <th style="width: 80px;">${isAr ? 'عضوية الاتحاد' : 'Adhésion'}</th>
      </tr>
    `;
  }

  // Group filtered centers by commune
  const groupedByCommune = {};
  filtered.forEach(center => {
    const communeKey = center.commune || 'غير محدد';
    if (!groupedByCommune[communeKey]) {
      groupedByCommune[communeKey] = [];
    }
    groupedByCommune[communeKey].push(center);
  });

  let grandBoys = 0;
  let grandGirls = 0;
  let grandTotal = 0;

  const printTbody = document.getElementById('print-table-body');
  printTbody.innerHTML = '';

  const genderTypesOrder = ['garcons', 'filles', 'mixte'];
  const genderLabels = {
    garcons: isAr ? 'مراكز البنين فقط' : 'Centres Garçons uniquement',
    filles: isAr ? 'مراكز البنات فقط' : 'Centres Filles uniquement',
    mixte: isAr ? 'مراكز مشتركة (بنين وبنات)' : 'Centres mixtes (Garçons et Filles)'
  };

  let globalIndex = 1;

  printCommunesOrder.forEach(communeName => {
    const communeCenters = groupedByCommune[communeName];
    if (!communeCenters || communeCenters.length === 0) return;

    const communeDisp = getCommuneDisplayName(communeName, currentLang);

    // 1. Commune Header Row
    const commHeaderTr = document.createElement('tr');
    commHeaderTr.innerHTML = `
      <td colspan="9" class="print-commune-header">
        <i class="fa-solid fa-location-dot"></i> ${isAr ? 'البلدية:' : 'Commune:'} ${communeDisp}
      </td>
    `;
    printTbody.appendChild(commHeaderTr);

    let commBoys = 0;
    let commGirls = 0;
    let commTotal = 0;

    // 2. Iterate through Student Types
    genderTypesOrder.forEach(gType => {
      const centersOfGender = communeCenters.filter(c => c.gender_type === gType);
      if (centersOfGender.length === 0) return;

      const genderHeaderTr = document.createElement('tr');
      genderHeaderTr.innerHTML = `
        <td colspan="9" class="print-gender-header">
          📂 ${genderLabels[gType]} (${formatCenterCountText(centersOfGender.length, isAr)})
        </td>
      `;
      printTbody.appendChild(genderHeaderTr);

      centersOfGender.forEach(center => {
        commBoys += center.boys;
        commGirls += center.girls;
        commTotal += center.total;

        grandBoys += center.boys;
        grandGirls += center.girls;
        grandTotal += center.total;

        const centerName = isAr ? center.name_ar : center.name_fr;
        const directorName = isAr ? center.director_ar : center.director_fr;
        const addressText = isAr ? (center.address_ar || center.name_ar) : (center.address_fr || center.name_fr);
        const col4Val = showAddressCol ? addressText : communeDisp;
        const membershipText = center.membership === 'Oui' ? (isAr ? 'نعم' : 'Oui') : (isAr ? 'لا' : 'Non');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${globalIndex++}</td>
          <td><strong>${centerName}</strong></td>
          <td>${directorName}</td>
          <td>${col4Val}</td>
          <td style="white-space: nowrap; direction: ltr;">${center.phone}</td>
          <td>${center.boys}</td>
          <td>${center.girls}</td>
          <td><strong>${center.total}</strong></td>
          <td>${membershipText}</td>
        `;
        printTbody.appendChild(tr);
      });
    });

    // 3. Commune Subtotal Row
    const commTotalTr = document.createElement('tr');
    commTotalTr.className = 'print-commune-total';
    commTotalTr.innerHTML = `
      <td colspan="5" style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold;">
        ${isAr ? 'إجمالي البلدية' : 'Sous-total Commune'} (${communeDisp}): ${formatCenterCountText(communeCenters.length, isAr)}
      </td>
      <td><strong>${commBoys}</strong></td>
      <td><strong>${commGirls}</strong></td>
      <td><strong>${commTotal}</strong></td>
      <td>-</td>
    `;
    printTbody.appendChild(commTotalTr);
  });

  // 4. Grand Total Row
  const grandTotalTr = document.createElement('tr');
  grandTotalTr.className = 'print-grand-total';
  grandTotalTr.innerHTML = `
    <td colspan="5" style="text-align:${isAr ? 'right' : 'left'}; font-weight:bold;">
      ${isAr ? 'الإجمالي الكلي لجميع المراكز' : 'Total Général (Tous les centres)'}: ${formatCenterCountText(filtered.length, isAr)}
    </td>
    <td><strong>${grandBoys}</strong></td>
    <td><strong>${grandGirls}</strong></td>
    <td><strong>${grandTotal}</strong></td>
    <td>-</td>
  `;
  printTbody.appendChild(grandTotalTr);

  document.getElementById('print-stats-box').innerHTML = `
    <span><strong>${isAr ? 'عدد المراكز' : 'Nombre de centres'}:</strong> ${formatCenterCountText(filtered.length, isAr)}</span> | 
    <span><strong>${isAr ? 'إجمالي البنين' : 'Total Garçons'}:</strong> ${grandBoys}</span> | 
    <span><strong>${isAr ? 'إجمالي البنات' : 'Total Filles'}:</strong> ${grandGirls}</span> | 
    <span><strong>${isAr ? 'المجموع الكلي' : 'Grand Total'}:</strong> ${grandTotal}</span>
  `;

  closePrintOptionsModal();
  setTimeout(() => {
    window.print();
  }, 300);
}
