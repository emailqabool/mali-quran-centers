/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Complete Production Engine & Window Bridge
   ---------------------------------------------------- */

(function () {
  'use strict';

  // ====================================================
  // 1. CONFIG & DATA
  // ====================================================
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx83PCEqT39I-X5GHyuAII2QkpEz_zLOYX_HCp2G6U8UvhGGMhpu6xzqMoO7yU-11R5dw/exec";
  const SALT = "AECMEC_MALI_QURANIC_CENTERS_SALT_2026_SECURE";
  const DEFAULT_PASSWORD = "NANA@fatima2";

  const STATUS_APPROVED = 'approved';
  const STATUS_PENDING = 'pending';
  const STATUS_REJECTED = 'rejected';

  const DEFAULT_CENTERS = [
    {
      id: 1,
      ref_code: "REC-2026-0001",
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
      membership: "Oui",
      status: "approved",
      created_at: "2026-01-15T10:00:00.000Z"
    },
    {
      id: 2,
      ref_code: "REC-2026-0002",
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
      membership: "Non",
      status: "approved",
      created_at: "2026-01-20T11:30:00.000Z"
    },
    {
      id: 3,
      ref_code: "REC-2026-0003",
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
      membership: "Oui",
      status: "approved",
      created_at: "2026-02-01T09:15:00.000Z"
    },
    {
      id: 4,
      ref_code: "REC-2026-0004",
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
      membership: "Oui",
      status: "approved",
      created_at: "2026-02-05T14:20:00.000Z"
    },
    {
      id: 5,
      ref_code: "REC-2026-0005",
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
      membership: "Non",
      status: "approved",
      created_at: "2026-02-10T16:00:00.000Z"
    }
  ];

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

  // ====================================================
  // 2. DICTIONARIES (i18n)
  // ====================================================
  const I18N = {
    ar: {
      mainAppTitle: "جمع بيانات مدارس ومراكز تحفيظ القرآن الكريم في مالي",
      subAppTitle: "اتحاد المدارس والمراكز القرآنية في جمهورية مالي",
      loginBtn: "دخول المسؤول",
      logoutBtn: "تسجيل الخروج",
      submitSuccess: "تم تسجيل بيانات المركز بنجاح! شكراً لمشاركتكم.",
      confirmDelete: "هل أنت متأكد من حذف هذا المركز القرآني؟",
      accessDenied: "هذه الميزة مخصصة لمسؤول النظام فقط. يرجى تسجيل الدخول أولاً.",
      
      mobileMenuTitle: "قائمة النظام",
      navSurvey: "استبيان التسجيل",
      navSchools: "قائمة المدارس",
      navSearch: "البحث والتصفية",
      navCommunes: "إدارة البلديات",
      navExcel: "تصدير Excel",
      navPrint: "طباعة التقارير",
      statCenters: "مركز مسجل",
      statStudents: "إجمالي الطلاب",

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

      tableTitle: "قائمة المدارس المسجلة",
      phSearch: "بحث عن مركز...",
      lblFilterCommune: "البلدية:",
      optFilterAll: "الكل",
      lblFilterMembership: "العضوية:",
      lblFilterStatus: "حالة التدقيق:",
      btnExportExcel: "تصدير Excel",
      btnPrint: "طباعة",

      thStatus: "حالة التوثيق",
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
      kpiPendingModeration: "طلبات قيد المراجعة والتدقيق",

      pillAll: "جميع المراكز",
      pillApproved: "المعتمدة فقط 🟢",
      pillPending: "قيد المراجعة 🟡",
      pillRejected: "المرفوضة 🔴",
      pillBoys: "بنين فقط",
      pillGirls: "بنات فقط",
      pillMixte: "مشتركة",
      pillUnion: "أعضاء الاتحاد",

      statusApproved: "معتمد رسمياً",
      statusPending: "قيد المراجعة والتدقيق",
      statusRejected: "مرفوض",

      btnApprove: "اعتماد",
      btnReject: "رفض",
      btnEdit: "تعديل",
      btnDelete: "حذف",

      receiptSuccessMsg: "تم تسجيل بيانات المركز القرآني بنجاح في المنصة الرسمية",
      receiptRefTitle: "رقم التسجيل المرجعي / N° de Référence",
      btnPrintReceipt: "طباعة الإيصال الرسمية",
      btnNewReg: "تسجيل مركز آخر",
      receiptPendingNote: "ملاحظة: هذا الإيصال يثبت تعبئة البيانات، وتعتبر العضوية رسمية وموثقة بعد مراجعة الاتحاد."
    },
    fr: {
      mainAppTitle: "Recensement des Écoles et Centres Coraniques au Mali",
      subAppTitle: "Union des Écoles et Centres Coraniques en République du Mali",
      loginBtn: "Connexion Admin",
      logoutBtn: "Déconnexion",
      submitSuccess: "Les informations du centre ont été enregistrées avec succès !",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce centre coranique ?",
      accessDenied: "Cette fonctionnalité est réservée à l'administrateur. Veuillez vous connecter.",

      mobileMenuTitle: "Menu du Système",
      navSurvey: "Formulaire d'inscription",
      navSchools: "Liste des écoles",
      navSearch: "Recherche & Filtres",
      navCommunes: "Gestion des communes",
      navExcel: "Exportation Excel",
      navPrint: "Impression des rapports",
      statCenters: "Centres enregistrés",
      statStudents: "Total des élèves",

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

      tableTitle: "Liste des écoles enregistrées",
      phSearch: "Rechercher un centre...",
      lblFilterCommune: "Commune :",
      optFilterAll: "Toutes les communes",
      lblFilterMembership: "Adhésion :",
      lblFilterStatus: "Statut :",
      btnExportExcel: "Exporter Excel",
      btnPrint: "Impression",

      thStatus: "Statut Validation",
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
      kpiPendingModeration: "Demandes en attente",

      pillAll: "Tous les centres",
      pillApproved: "Approuvés 🟢",
      pillPending: "En attente 🟡",
      pillRejected: "Rejetés 🔴",
      pillBoys: "Garçons uniquement",
      pillGirls: "Filles uniquement",
      pillMixte: "Centres mixtes",
      pillUnion: "Membres de l'Union",

      statusApproved: "Approuvé",
      statusPending: "En attente de validation",
      statusRejected: "Rejeté",

      btnApprove: "Approuver",
      btnReject: "Rejeter",
      btnEdit: "Modifier",
      btnDelete: "Supprimer",

      receiptSuccessMsg: "La fiche du centre coranique a été enregistrée avec succès !",
      receiptRefTitle: "N° de Référence / رقم التسجيل المرجعي",
      btnPrintReceipt: "Imprimer le reçu officiel",
      btnNewReg: "Inscrire un autre centre",
      receiptPendingNote: "Remarque : Ce reçu prouve l'enregistrement. L'adhésion sera officielle après validation par l'Union."
    }
  };

  // ====================================================
  // 3. STATE
  // ====================================================
  let currentLang = 'ar';
  let centersList = [];
  let communesList = [];
  let isAdminLoggedIn = false;

  let activeFilterCommune = 'ALL';
  let activeFilterMembership = 'ALL';
  let activeFilterStatus = 'ALL';
  let activePillFilter = 'ALL';
  let searchQuery = '';

  const rateLimitMap = new Map();

  function xssClean(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  function checkRateLimit(actionKey, cooldownSeconds = 5) {
    const now = Date.now();
    const lastTime = rateLimitMap.get(actionKey) || 0;
    if (now - lastTime < cooldownSeconds * 1000) {
      const remaining = Math.ceil((cooldownSeconds * 1000 - (now - lastTime)) / 1000);
      return { allowed: false, remainingSeconds: remaining };
    }
    rateLimitMap.set(actionKey, now);
    return { allowed: true, remainingSeconds: 0 };
  }

  function loadStoredData() {
    const savedCenters = localStorage.getItem('mali_quran_centers');
    if (savedCenters) {
      try {
        const parsed = JSON.parse(savedCenters);
        centersList = parsed.map((item, idx) => ({
          ...item,
          status: item.status || STATUS_APPROVED,
          ref_code: item.ref_code || `REC-2026-${String(item.id || idx + 1).padStart(4, '0')}`,
          name_ar: xssClean(item.name_ar || ''),
          name_fr: xssClean(item.name_fr || ''),
          director_ar: xssClean(item.director_ar || ''),
          director_fr: xssClean(item.director_fr || '')
        }));
      } catch (e) {
        centersList = [...DEFAULT_CENTERS];
      }
    } else {
      centersList = [...DEFAULT_CENTERS];
      saveCentersToStorage();
    }

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

    const savedAuth = localStorage.getItem('mali_quran_admin_auth');
    isAdminLoggedIn = savedAuth === 'true';
    updateAuthUI();
  }

  function saveCentersToStorage() {
    localStorage.setItem('mali_quran_centers', JSON.stringify(centersList));
  }

  function saveCommunesToStorage() {
    localStorage.setItem('mali_quran_communes', JSON.stringify(communesList));
  }

  // ====================================================
  // 4. AUTHENTICATION
  // ====================================================
  async function hashText(plainText) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText + SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function verifyAdminPassword(inputPassword) {
    const inputHash = await hashText(inputPassword.trim());
    const defaultHash = await hashText(DEFAULT_PASSWORD);
    const customPassHash = localStorage.getItem('mali_quran_admin_pass_hash');

    if (customPassHash) {
      return inputHash === customPassHash;
    }
    return inputHash === defaultHash;
  }

  function updateAuthUI() {
    const dict = I18N[currentLang];
    const authContainer = document.getElementById('auth-status-container');
    const listSection = document.getElementById('list-section');
    const kpiCards = document.getElementById('admin-kpi-cards');
    const navCommunes = document.getElementById('nav-manage-communes');
    const filterStatusGroup = document.getElementById('filter-status-group');
    const thStatus = document.getElementById('thStatus');
    const pillAdminOnly = document.querySelectorAll('.pill-admin-only');
    const sidebar = document.getElementById('app-sidebar');
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

    document.body.classList.toggle('admin-mode', isAdminLoggedIn);

    if (listSection) listSection.style.display = isAdminLoggedIn ? 'block' : 'none';
    if (kpiCards) kpiCards.style.display = isAdminLoggedIn ? 'grid' : 'none';
    if (navCommunes) navCommunes.style.display = isAdminLoggedIn ? 'flex' : 'none';
    if (filterStatusGroup) filterStatusGroup.style.display = isAdminLoggedIn ? 'flex' : 'none';
    if (thStatus) thStatus.style.display = isAdminLoggedIn ? 'table-cell' : 'none';
    if (sidebar) sidebar.style.display = isAdminLoggedIn ? 'block' : 'none';
    if (mobileNav) mobileNav.style.display = isAdminLoggedIn ? 'flex' : 'none';
    if (mobileMenuToggle) mobileMenuToggle.style.display = isAdminLoggedIn ? 'block' : 'none';
    pillAdminOnly.forEach(el => el.style.display = isAdminLoggedIn ? 'inline-flex' : 'none');

    if (authContainer) {
      if (isAdminLoggedIn) {
        authContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge badge-primary"><i class="fa-solid fa-user-shield"></i> مسؤول النظام</span>
            <button class="footer-auth-link" id="btn-logout" onclick="handleAdminLogout()" title="${dict.logoutBtn}" style="color: #ef4444; border-color: #fca5a5; font-weight: bold; cursor: pointer;">
              <i class="fa-solid fa-right-from-bracket"></i> <span>${dict.logoutBtn}</span>
            </button>
          </div>
        `;
      } else {
        authContainer.innerHTML = `
          <button type="button" class="footer-auth-link" id="btn-login-trigger" onclick="openLoginModal()" style="cursor: pointer;">
            <i class="fa-solid fa-lock"></i> <span id="txt-login-btn">${dict.loginBtn}</span>
          </button>
        `;
      }
    }
  }

  async function handleAdminLogin(inputPassword) {
    const isValid = await verifyAdminPassword(inputPassword);
    if (isValid) {
      isAdminLoggedIn = true;
      localStorage.setItem('mali_quran_admin_auth', 'true');
      updateAuthUI();
      renderTable();
      updateStats();
      updateAdminKPIStats();
      return { success: true };
    } else {
      return { success: false, message: currentLang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Mot de passe incorrect' };
    }
  }

  function handleAdminLogout() {
    isAdminLoggedIn = false;
    localStorage.removeItem('mali_quran_admin_auth');
    updateAuthUI();
    renderTable();
    updateStats();
    updateAdminKPIStats();
  }

  // ====================================================
  // 5. UI RENDERING & FILTERING
  // ====================================================
  function applyLanguageUI() {
    const dict = I18N[currentLang];
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    const btnTargetLang = document.getElementById('txt-target-lang');
    if (btnTargetLang) {
      btnTargetLang.textContent = currentLang === 'ar' ? '🇫🇷 Français' : '🇸🇦 العربية';
    }

    Object.keys(dict).forEach(key => {
      const el = document.getElementById(key) || document.querySelector(`[data-i18n="${key}"]`);
      if (el) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.placeholder = dict[key];
          }
        } else {
          el.textContent = dict[key];
        }
      }
    });

    renderCommuneOptions();
    renderTable();
    updateStats();
    updateAdminKPIStats();
  }

  function renderCommuneOptions() {
    const formSelect = document.getElementById('commune');
    const filterSelect = document.getElementById('filter-commune');
    const dict = I18N[currentLang];

    if (formSelect) {
      const currentVal = formSelect.value;
      formSelect.innerHTML = `<option value="">${dict.selectCommuneDefault}</option>`;
      communesList.forEach(c => {
        const name = currentLang === 'ar' ? c.name_ar : c.name_fr;
        formSelect.innerHTML += `<option value="${c.name_fr}">${name}</option>`;
      });
      formSelect.value = currentVal;
    }

    if (filterSelect) {
      const currentVal = filterSelect.value;
      filterSelect.innerHTML = `<option value="ALL">${dict.optFilterAll}</option>`;
      communesList.forEach(c => {
        const name = currentLang === 'ar' ? c.name_ar : c.name_fr;
        filterSelect.innerHTML += `<option value="${c.name_fr}">${name}</option>`;
      });
      filterSelect.value = currentVal;
    }
  }

  function filterCentersList() {
    return centersList.filter(center => {
      const status = center.status || STATUS_APPROVED;

      // In non-admin mode, always show approved only
      if (!isAdminLoggedIn) {
        if (status !== STATUS_APPROVED) return false;
      } else if (activeFilterStatus !== 'ALL') {
        if (status !== activeFilterStatus) return false;
      }

      if (activeFilterCommune !== 'ALL' && center.commune !== activeFilterCommune) return false;
      if (activeFilterMembership !== 'ALL' && center.membership !== activeFilterMembership) return false;

      if (activePillFilter !== 'ALL') {
        if (activePillFilter === 'UNION' || activePillFilter === 'union') {
          if (center.membership !== 'Oui') return false;
        } else if (activePillFilter === 'mixte') {
          if (center.gender_type !== 'mixte') return false;
        } else if (activePillFilter === 'filles') {
          if (center.gender_type !== 'filles') return false;
        } else if (activePillFilter === 'garcons') {
          if (center.gender_type !== 'garcons') return false;
        }
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNameAr = (center.name_ar || '').toLowerCase().includes(q);
        const matchNameFr = (center.name_fr || '').toLowerCase().includes(q);
        const matchDirectorAr = (center.director_ar || '').toLowerCase().includes(q);
        const matchDirectorFr = (center.director_fr || '').toLowerCase().includes(q);
        const matchPhone = (center.phone || '').includes(q);
        const matchRef = (center.ref_code || '').toLowerCase().includes(q);
        const matchCommune = (center.commune || '').toLowerCase().includes(q);

        if (!matchNameAr && !matchNameFr && !matchDirectorAr && !matchDirectorFr && !matchPhone && !matchRef && !matchCommune) {
          return false;
        }
      }

      return true;
    });
  }

  function renderTable() {
    const tableBody = document.getElementById('schools-table-body');
    if (!tableBody) return;

    const filtered = filterCentersList();
    const dict = I18N[currentLang];
    const totalCols = isAdminLoggedIn ? 8 : 7;

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="${totalCols}" style="text-align:center; padding: 32px; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size: 32px; margin-bottom: 8px; opacity: 0.5;"></i><br>
            ${currentLang === 'ar' ? 'لا توجد مراكز مطابقة لشروط البحث' : 'Aucun centre ne correspond aux critères.'}
          </td>
        </tr>
      `;
      updateTableFooters(filtered, dict);
      return;
    }

    let html = '';
    filtered.forEach(c => {
      const name = currentLang === 'ar' ? (c.name_ar || c.name_fr) : (c.name_fr || c.name_ar);
      const director = currentLang === 'ar' ? (c.director_ar || c.director_fr) : (c.director_fr || c.director_ar);
      const communeObj = communesList.find(com => com.name_fr === c.commune);
      const communeName = communeObj ? (currentLang === 'ar' ? communeObj.name_ar : communeObj.name_fr) : c.commune;

      const status = c.status || STATUS_APPROVED;
      let statusBadgeHTML = '';
      if (status === STATUS_APPROVED) {
        statusBadgeHTML = `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> ${dict.statusApproved}</span>`;
      } else if (status === STATUS_PENDING) {
        statusBadgeHTML = `<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> ${dict.statusPending}</span>`;
      } else if (status === STATUS_REJECTED) {
        statusBadgeHTML = `<span class="badge badge-danger"><i class="fa-solid fa-circle-xmark"></i> ${dict.statusRejected}</span>`;
      }

      const membershipBadge = c.membership === 'Oui'
        ? `<span class="badge badge-primary"><i class="fa-solid fa-check"></i> ${dict.optMemYes}</span>`
        : `<span class="badge badge-outline">${dict.optMemNo}</span>`;

      let actionsHTML = '';
      if (isAdminLoggedIn) {
        actionsHTML = `
          <div class="table-actions">
            ${status === STATUS_PENDING ? `
              <button class="btn-sm btn-approve" onclick="handleApproveCenter(${c.id})" title="${dict.btnApprove}">
                <i class="fa-solid fa-check"></i>
              </button>
              <button class="btn-sm btn-reject" onclick="handleRejectCenter(${c.id})" title="${dict.btnReject}">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : ''}
            ${status === STATUS_REJECTED ? `
              <button class="btn-sm btn-approve" onclick="handleApproveCenter(${c.id})" title="${dict.btnApprove}">
                <i class="fa-solid fa-check"></i>
              </button>
            ` : ''}
            <button class="btn-sm btn-edit" onclick="editCenterForm(${c.id})" title="${dict.btnEdit}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-sm btn-delete" onclick="handleDeleteCenter(${c.id})" title="${dict.btnDelete}">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      } else {
        actionsHTML = `
          <button class="btn-sm btn-view-receipt" onclick="viewCenterReceipt(${c.id})" title="عرض الإيصال">
            <i class="fa-solid fa-receipt"></i>
          </button>
        `;
      }

      html += `
        <tr>
          ${isAdminLoggedIn ? `<td>${statusBadgeHTML}</td>` : ''}
          <td>
            <strong>${name}</strong><br>
            <small style="color: var(--text-muted); font-size: 11px;">${c.ref_code || ''}</small>
          </td>
          <td>${director}</td>
          <td><span class="commune-pill">${communeName}</span></td>
          <td><dir dir="ltr">${c.phone}</dir></td>
          <td>
            <strong>${c.total}</strong>
            <small style="color: var(--text-muted); display: block; font-size: 11px;">(${dict.boysPrefix} ${c.boys} | ${dict.girlsPrefix} ${c.girls})</small>
          </td>
          <td>${membershipBadge}</td>
          <td>${actionsHTML}</td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;
    updateTableFooters(filtered, dict);
  }

  function updateTableFooters(filtered, dict) {
    const visibleCountEl = document.getElementById('visible-count');
    const visibleStudentsEl = document.getElementById('visible-students');
    const visibleBoysEl = document.getElementById('visible-boys');
    const visibleGirlsEl = document.getElementById('visible-girls');

    const totalStudents = filtered.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const totalBoys = filtered.reduce((acc, c) => acc + (Number(c.boys) || 0), 0);
    const totalGirls = filtered.reduce((acc, c) => acc + (Number(c.girls) || 0), 0);

    if (visibleCountEl) visibleCountEl.textContent = filtered.length;
    if (visibleStudentsEl) visibleStudentsEl.textContent = totalStudents;
    if (visibleBoysEl) visibleBoysEl.textContent = totalBoys;
    if (visibleGirlsEl) visibleGirlsEl.textContent = totalGirls;
  }

  function updateStats() {
    const approvedCenters = centersList.filter(c => (c.status || STATUS_APPROVED) === STATUS_APPROVED);
    const elCenters = document.getElementById('side-stat-centers');
    const elStudents = document.getElementById('side-stat-students');

    if (elCenters) elCenters.textContent = approvedCenters.length;
    const totalStudents = approvedCenters.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    if (elStudents) elStudents.textContent = totalStudents;
  }

  function updateAdminKPIStats() {
    const kpiCentersEl = document.getElementById('kpi-total-centers');
    const kpiStudentsEl = document.getElementById('kpi-total-students');
    const kpiTopCommuneEl = document.getElementById('kpi-top-commune');
    const kpiUnionRatioEl = document.getElementById('kpi-union-ratio');
    const kpiPendingEl = document.getElementById('kpi-pending-moderation');

    const approvedCenters = centersList.filter(c => (c.status || STATUS_APPROVED) === STATUS_APPROVED);
    const pendingCenters = centersList.filter(c => c.status === STATUS_PENDING);

    if (kpiCentersEl) kpiCentersEl.textContent = approvedCenters.length;

    const totalStudents = approvedCenters.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    if (kpiStudentsEl) kpiStudentsEl.textContent = totalStudents;

    const communeCounts = {};
    approvedCenters.forEach(c => {
      communeCounts[c.commune] = (communeCounts[c.commune] || 0) + 1;
    });
    let topCommuneName = '-';
    let maxCount = 0;
    Object.keys(communeCounts).forEach(comm => {
      if (communeCounts[comm] > maxCount) {
        maxCount = communeCounts[comm];
        topCommuneName = comm;
      }
    });

    const communeObj = communesList.find(com => com.name_fr === topCommuneName);
    if (kpiTopCommuneEl) {
      kpiTopCommuneEl.textContent = communeObj ? (currentLang === 'ar' ? communeObj.name_ar : communeObj.name_fr) : topCommuneName;
    }

    const unionMembers = approvedCenters.filter(c => c.membership === 'Oui').length;
    const ratio = approvedCenters.length > 0 ? Math.round((unionMembers / approvedCenters.length) * 100) : 0;
    if (kpiUnionRatioEl) kpiUnionRatioEl.textContent = `${ratio}%`;

    if (kpiPendingEl) kpiPendingEl.textContent = pendingCenters.length;
    const badgeEl = document.getElementById('pending-moderation-badge');
    if (badgeEl) {
      badgeEl.textContent = pendingCenters.length;
      badgeEl.style.display = pendingCenters.length > 0 ? 'inline-block' : 'none';
    }
  }

  // ====================================================
  // 6. FORM & ACTIONS
  // ====================================================
  function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const rate = checkRateLimit('survey_submit', 3);
    if (!rate.allowed) {
      alert(currentLang === 'ar' 
        ? `يرجى الانتظار ${rate.remainingSeconds} ثوانٍ قبل تقديم طلب آخر.` 
        : `Veuillez patienter ${rate.remainingSeconds} secondes avant de soumettre à nouveau.`);
      return;
    }

    const editIdInput = document.getElementById('center_edit_id');
    const editId = editIdInput ? editIdInput.value : '';

    const nameAr = xssClean(document.getElementById('name_ar').value.trim());
    const nameFr = xssClean(document.getElementById('name_fr').value.trim());
    const directorAr = xssClean(document.getElementById('director_ar').value.trim());
    const directorFr = xssClean(document.getElementById('director_fr').value.trim());
    const addressAr = xssClean((document.getElementById('address_ar') ? document.getElementById('address_ar').value : '').trim());
    const addressFr = xssClean((document.getElementById('address_fr') ? document.getElementById('address_fr').value : '').trim());
    const commune = document.getElementById('commune').value;
    const phone = xssClean(document.getElementById('phone').value.trim());
    const boys = parseInt(document.getElementById('boys_count').value) || 0;
    const girls = parseInt(document.getElementById('girls_count').value) || 0;
    const membership = document.getElementById('union_membership').value;

    const total = boys + girls;
    let genderType = 'mixte';
    if (boys > 0 && girls === 0) genderType = 'garcons';
    else if (girls > 0 && boys === 0) genderType = 'filles';

    let targetCenter = null;

    if (editId) {
      const idx = centersList.findIndex(c => String(c.id) === String(editId));
      if (idx !== -1) {
        centersList[idx] = {
          ...centersList[idx],
          name_ar: nameAr,
          name_fr: nameFr,
          director_ar: directorAr,
          director_fr: directorFr,
          address_ar: addressAr,
          address_fr: addressFr,
          commune,
          phone,
          boys,
          girls,
          total,
          gender_type: genderType,
          membership,
          updated_at: new Date().toISOString()
        };
        targetCenter = centersList[idx];
      }
    } else {
      const newId = Date.now();
      const refCode = `REC-2026-${String(centersList.length + 1).padStart(4, '0')}`;
      targetCenter = {
        id: newId,
        ref_code: refCode,
        name_ar: nameAr,
        name_fr: nameFr,
        director_ar: directorAr,
        director_fr: directorFr,
        address_ar: addressAr,
        address_fr: addressFr,
        commune,
        phone,
        boys,
        girls,
        total,
        gender_type: genderType,
        membership,
        status: isAdminLoggedIn ? STATUS_APPROVED : STATUS_PENDING,
        created_at: new Date().toISOString()
      };
      centersList.unshift(targetCenter);
    }

    saveCentersToStorage();

    resetForm();
    renderTable();
    updateStats();
    updateAdminKPIStats();

    showReceiptModal(targetCenter);
  }

  function resetForm() {
    const form = document.getElementById('quran-center-form');
    if (form) form.reset();
    const editIdInput = document.getElementById('center_edit_id');
    if (editIdInput) editIdInput.value = '';
    const formCardTitle = document.getElementById('form-card-title');
    if (formCardTitle) formCardTitle.textContent = I18N[currentLang].formTitleNew;
    handleStudentCountInput();
    updateFormProgress();
  }

  function editCenterForm(id) {
    const center = centersList.find(c => String(c.id) === String(id));
    if (!center) return;

    scrollToSection('survey-section');

    const formCardTitle = document.getElementById('form-card-title');
    if (formCardTitle) formCardTitle.textContent = I18N[currentLang].formTitleEdit;

    document.getElementById('center_edit_id').value = center.id;
    document.getElementById('name_ar').value = center.name_ar;
    document.getElementById('name_fr').value = center.name_fr;
    document.getElementById('director_ar').value = center.director_ar;
    document.getElementById('director_fr').value = center.director_fr;
    if (document.getElementById('address_ar')) document.getElementById('address_ar').value = center.address_ar || '';
    if (document.getElementById('address_fr')) document.getElementById('address_fr').value = center.address_fr || '';
    document.getElementById('commune').value = center.commune;
    document.getElementById('phone').value = center.phone;
    document.getElementById('boys_count').value = center.boys;
    document.getElementById('girls_count').value = center.girls;
    document.getElementById('union_membership').value = center.membership;

    handleStudentCountInput();
    updateFormProgress();
  }

  function handleApproveCenter(id) {
    const idx = centersList.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      centersList[idx].status = STATUS_APPROVED;
      saveCentersToStorage();
      renderTable();
      updateStats();
      updateAdminKPIStats();
    }
  }

  function handleRejectCenter(id) {
    const idx = centersList.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      centersList[idx].status = STATUS_REJECTED;
      saveCentersToStorage();
      renderTable();
      updateStats();
      updateAdminKPIStats();
    }
  }

  function handleDeleteCenter(id) {
    if (confirm(I18N[currentLang].confirmDelete)) {
      centersList = centersList.filter(c => String(c.id) !== String(id));
      saveCentersToStorage();
      renderTable();
      updateStats();
      updateAdminKPIStats();
    }
  }

  function viewCenterReceipt(id) {
    const center = centersList.find(c => String(c.id) === String(id));
    if (center) showReceiptModal(center);
  }

  function handleStudentCountInput() {
    const boysInput = document.getElementById('boys_count');
    const girlsInput = document.getElementById('girls_count');
    const totalInput = document.getElementById('total_students');
    const badgeEl = document.getElementById('auto-type-badge');
    const badgeLbl = document.getElementById('auto-type-lbl');
    const genderTypeHidden = document.getElementById('student_gender_type');

    const boys = parseInt(boysInput ? boysInput.value : 0) || 0;
    const girls = parseInt(girlsInput ? girlsInput.value : 0) || 0;
    const total = boys + girls;

    if (totalInput) totalInput.value = total;

    let type = 'mixte';
    let typeLabel = currentLang === 'ar' ? 'بنين وبنات' : 'Mixte';
    let badgeClass = 'badge-mixte';

    if (boys > 0 && girls === 0) {
      type = 'garcons';
      typeLabel = currentLang === 'ar' ? 'بنين فقط' : 'Garçons uniquement';
      badgeClass = 'badge-garcons';
    } else if (girls > 0 && boys === 0) {
      type = 'filles';
      typeLabel = currentLang === 'ar' ? 'بنات فقط' : 'Filles uniquement';
      badgeClass = 'badge-filles';
    }

    if (genderTypeHidden) genderTypeHidden.value = type;
    if (badgeLbl) badgeLbl.textContent = typeLabel;
    if (badgeEl) {
      badgeEl.className = `auto-type-badge ${badgeClass}`;
    }

    updateFormProgress();
  }

  function handlePhoneInput(input) {
    const target = input || document.getElementById('phone');
    if (!target) return;
    let raw = target.value.replace(/\D/g, '');
    if (raw.length > 8) raw = raw.substring(0, 8);
    let formatted = '';
    for (let i = 0; i < raw.length; i++) {
      if (i > 0 && i % 2 === 0) formatted += ' ';
      formatted += raw[i];
    }
    target.value = formatted;
    updateFormProgress();
  }

  function updateFormProgress() {
    const nameAr = document.getElementById('name_ar') ? document.getElementById('name_ar').value.trim() : '';
    const nameFr = document.getElementById('name_fr') ? document.getElementById('name_fr').value.trim() : '';
    const directorAr = document.getElementById('director_ar') ? document.getElementById('director_ar').value.trim() : '';
    const directorFr = document.getElementById('director_fr') ? document.getElementById('director_fr').value.trim() : '';
    const commune = document.getElementById('commune') ? document.getElementById('commune').value : '';
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.replace(/\s/g, '').trim() : '';
    const boys = parseInt(document.getElementById('boys_count') ? document.getElementById('boys_count').value : 0) || 0;
    const girls = parseInt(document.getElementById('girls_count') ? document.getElementById('girls_count').value : 0) || 0;
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

  // ====================================================
  // 7. PRINT ENGINE & RECEIPT
  // ====================================================
  function showReceiptModal(centerData) {
    const modal = document.getElementById('receipt-modal');
    if (!modal) return;

    const dict = I18N[currentLang];
    const isAr = currentLang === 'ar';
    const refCodeEl = document.getElementById('receipt-ref-code');
    const bodyGrid = document.getElementById('receipt-body-grid');

    if (refCodeEl) refCodeEl.textContent = centerData.ref_code || 'AECMEC-2026-0000';

    if (bodyGrid) {
      bodyGrid.innerHTML = `
        <div class="receipt-item">
          <label>${isAr ? 'اسم المركز القرآني' : 'Nom du centre'}</label>
          <span>${centerData.name_ar} (${centerData.name_fr})</span>
        </div>
        <div class="receipt-item">
          <label>${isAr ? 'المدير / المشرف' : 'Directeur / Responsable'}</label>
          <span>${centerData.director_ar} (${centerData.director_fr})</span>
        </div>
        <div class="receipt-item">
          <label>${isAr ? 'البلدية' : 'Commune'}</label>
          <span>${centerData.commune}</span>
        </div>
        <div class="receipt-item">
          <label>${isAr ? 'رقم الهاتف' : 'Téléphone'}</label>
          <bdi class="phone-display" dir="ltr">${centerData.phone}</bdi>
        </div>
        <div class="receipt-item">
          <label>${isAr ? 'عدد الطلاب والطالبات' : 'Nombre d\'élèves'}</label>
          <span>${centerData.total} (👨 ${centerData.boys} | 👩 ${centerData.girls})</span>
        </div>
        <div class="receipt-item">
          <label>${isAr ? 'عضوية الاتحاد' : 'Adhésion'}</label>
          <span>${centerData.membership === 'Oui' ? (isAr ? 'نعم - منضم سابقاً' : 'Oui - Membre') : (isAr ? 'لا - غير منضم بعد' : 'Non - Pas encore membre')}</span>
        </div>
      `;
    }

    // Populate Print Receipt Template
    const printRefEl = document.getElementById('receipt-print-ref-code');
    const printDateEl = document.getElementById('receipt-print-date');
    const printTbody = document.getElementById('receipt-print-table-body');

    if (printRefEl) printRefEl.textContent = centerData.ref_code || 'AECMEC-2026-0000';
    if (printDateEl) printDateEl.textContent = new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR');

    if (printTbody) {
      printTbody.innerHTML = `
        <tr>
          <th style="width:35%; font-weight:bold; background:#f0f7f2;">${isAr ? 'اسم المركز القرآني' : 'Nom du centre'}:</th>
          <td><strong>${centerData.name_ar}</strong> / <small>${centerData.name_fr}</small></td>
        </tr>
        <tr>
          <th style="font-weight:bold; background:#f0f7f2;">${isAr ? 'المدير / المشرف' : 'Directeur'}:</th>
          <td>${centerData.director_ar} / <small>${centerData.director_fr}</small></td>
        </tr>
        <tr>
          <th style="font-weight:bold; background:#f0f7f2;">${isAr ? 'البلدية' : 'Commune'}:</th>
          <td>${centerData.commune}</td>
        </tr>
        <tr>
          <th style="font-weight:bold; background:#f0f7f2;">${isAr ? 'رقم الهاتف' : 'Téléphone'}:</th>
          <td><bdi dir="ltr">${centerData.phone}</bdi></td>
        </tr>
        <tr>
          <th style="font-weight:bold; background:#f0f7f2;">${isAr ? 'إجمالي الطلاب' : 'Total Élèves'}:</th>
          <td><strong>${centerData.total}</strong> (بنين: ${centerData.boys} | بنات: ${centerData.girls})</td>
        </tr>
        <tr>
          <th style="font-weight:bold; background:#f0f7f2;">${isAr ? 'عضوية الاتحاد' : 'Adhésion'}:</th>
          <td>${centerData.membership === 'Oui' ? (isAr ? 'نعم - منضم سابقاً' : 'Oui - Membre') : (isAr ? 'لا - غير منضم بعد' : 'Non membre')}</td>
        </tr>
      `;
    }

    modal.classList.add('active');
  }

  function printRegistrationReceipt() {
    document.body.classList.add('printing-receipt');
    const cleanup = () => {
      document.body.classList.remove('printing-receipt');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 3000);
  }

  function triggerPrintReport() {
    const isAr = currentLang === 'ar';
    const filtered = filterCentersList();

    // Fill metadata
    const printDateEl = document.getElementById('print-date');
    if (printDateEl) printDateEl.textContent = new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR');

    const printCommuneNameEl = document.getElementById('print-commune-name');
    if (printCommuneNameEl) {
      if (activeFilterCommune === 'ALL') {
        printCommuneNameEl.textContent = isAr ? 'جميع البلديات' : 'Toutes les communes';
      } else {
        const comObj = communesList.find(c => c.name_fr === activeFilterCommune);
        printCommuneNameEl.textContent = comObj ? (isAr ? comObj.name_ar : comObj.name_fr) : activeFilterCommune;
      }
    }

    // Fill summary stats box
    const printStatsBox = document.getElementById('print-stats-box');
    const totalStudents = filtered.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const totalBoys = filtered.reduce((acc, c) => acc + (Number(c.boys) || 0), 0);
    const totalGirls = filtered.reduce((acc, c) => acc + (Number(c.girls) || 0), 0);

    if (printStatsBox) {
      printStatsBox.innerHTML = `
        <span><strong>${isAr ? 'إجمالي المراكز:' : 'Total Centres:'}</strong> ${filtered.length}</span>
        <span><strong>${isAr ? 'مجموع الطلاب:' : 'Total Élèves:'}</strong> ${totalStudents}</span>
        <span><strong>${isAr ? 'بنين:' : 'Garçons:'}</strong> ${totalBoys}</span>
        <span><strong>${isAr ? 'بنات:' : 'Filles:'}</strong> ${totalGirls}</span>
      `;
    }

    // Group filtered centers by commune
    const grouped = {};
    filtered.forEach(c => {
      if (!grouped[c.commune]) grouped[c.commune] = [];
      grouped[c.commune].push(c);
    });

    const tbody = document.getElementById('print-table-body');
    if (tbody) {
      let rowsHTML = '';
      let rowNum = 1;

      Object.keys(grouped).forEach(commName => {
        const commCenters = grouped[commName];
        const comObj = communesList.find(c => c.name_fr === commName);
        const displayName = comObj ? (isAr ? comObj.name_ar : comObj.name_fr) : commName;
        const commTotalStudents = commCenters.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
        const commTotalBoys = commCenters.reduce((acc, c) => acc + (Number(c.boys) || 0), 0);
        const commTotalGirls = commCenters.reduce((acc, c) => acc + (Number(c.girls) || 0), 0);

        // Commune Header Row
        rowsHTML += `
          <tr style="background:#e0e0e0; font-weight:bold;">
            <td colspan="9" style="text-align:${isAr ? 'right' : 'left'}; font-size:12px; padding:8px 12px; background:#d0d0d0;">
              📍 <strong>${isAr ? 'البلدية:' : 'Commune:'} ${displayName}</strong> 
              (${isAr ? 'عدد المراكز:' : 'Centres:'} ${commCenters.length} | ${isAr ? 'الطلاب:' : 'Élèves:'} ${commTotalStudents})
            </td>
          </tr>
        `;

        commCenters.forEach(c => {
          rowsHTML += `
            <tr>
              <td>${rowNum++}</td>
              <td style="text-align:${isAr ? 'right' : 'left'};"><strong>${c.name_ar}</strong><br><small>${c.name_fr}</small></td>
              <td style="text-align:${isAr ? 'right' : 'left'};">${c.director_ar}<br><small>${c.director_fr}</small></td>
              <td>${displayName}</td>
              <td><dir dir="ltr">${c.phone}</dir></td>
              <td>${c.boys}</td>
              <td>${c.girls}</td>
              <td><strong>${c.total}</strong></td>
              <td>${c.membership === 'Oui' ? (isAr ? 'نعم' : 'Oui') : (isAr ? 'لا' : 'Non')}</td>
            </tr>
          `;
        });

        // Commune Subtotal Row
        rowsHTML += `
          <tr style="background:#f5f5f5; font-weight:bold;">
            <td colspan="5" style="text-align:${isAr ? 'right' : 'left'};">${isAr ? 'مجموع بلدية' : 'Sous-total'} ${displayName}</td>
            <td>${commTotalBoys}</td>
            <td>${commTotalGirls}</td>
            <td>${commTotalStudents}</td>
            <td>-</td>
          </tr>
        `;
      });

      // Grand Total Row
      rowsHTML += `
        <tr style="background:#d1fae5; font-weight:bold; font-size:12px; border-top:2px solid #000;">
          <td colspan="5" style="text-align:${isAr ? 'right' : 'left'};">${isAr ? 'المجموع العام لكافة البلديات' : 'Total Général'}</td>
          <td>${totalBoys}</td>
          <td>${totalGirls}</td>
          <td>${totalStudents}</td>
          <td>-</td>
        </tr>
      `;

      tbody.innerHTML = rowsHTML;
    }

    document.body.classList.remove('printing-receipt');
    window.print();
  }

  // ====================================================
  // 8. EXCEL & BACKUP
  // ====================================================
  function exportFormattedExcel() {
    const isAr = currentLang === 'ar';
    const filtered = filterCentersList();

    if (filtered.length === 0) {
      alert(isAr ? 'لا توجد بيانات لتصديرها.' : 'Aucune donnée à exporter.');
      return;
    }

    const data = filtered.map((c, i) => ({
      '#': i + 1,
      'الرقم المرجعي': c.ref_code || '',
      'اسم المركز (عربي)': c.name_ar,
      'Nom du Centre (FR)': c.name_fr,
      'المدير (عربي)': c.director_ar,
      'Directeur (FR)': c.director_fr,
      'البلدية': c.commune,
      'الهاتف': c.phone,
      'عدد البنين': c.boys,
      'عدد البنات': c.girls,
      'الإجمالي': c.total,
      'عضوية الاتحاد': c.membership === 'Oui' ? 'نعم' : 'لا',
      'حالة التوثيق': c.status === STATUS_APPROVED ? 'معتمد' : (c.status === STATUS_PENDING ? 'قيد المراجعة' : 'مرفوض')
    }));

    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "المراكز القرآنية");
      XLSX.writeFile(wb, `AECMEC_Mali_Quranic_Centers_${new Date().toISOString().slice(0,10)}.xlsx`);
    } else {
      alert('مكتبة SheetJS غير متوفرة.');
    }
  }

  function downloadBackupJSON() {
    const backupData = {
      version: "2026.1",
      timestamp: new Date().toISOString(),
      centers: centersList,
      communes: communesList
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AECMEC_Mali_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function triggerRestoreJSON() {
    const fileInput = document.getElementById('restore-file-input');
    if (fileInput) fileInput.click();
  }

  function restoreBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && Array.isArray(data.centers)) {
          centersList = data.centers;
          if (Array.isArray(data.communes)) communesList = data.communes;
          saveCentersToStorage();
          saveCommunesToStorage();
          alert('تم استعادة النسخة الاحتياطية بنجاح!');
          renderTable();
          updateStats();
          updateAdminKPIStats();
        } else {
          alert('ملف النسخة الاحتياطية غير صالح.');
        }
      } catch (err) {
        alert('خطأ في قراءة ملف JSON.');
      }
    };
    reader.readAsText(file);
  }

  // ====================================================
  // 9. NAVIGATION & MODALS
  // ====================================================
  function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('active');
  }

  function switchTab(tabId) {
    if (tabId === 'tab-survey') {
      scrollToSection('survey-section');
    } else if (tabId === 'tab-schools-list') {
      scrollToSection('list-section');
    }
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.getElementById(`nav-${tabId.replace('tab-', '')}`);
    if (navItem) navItem.classList.add('active');
  }

  function scrollToFilters() {
    const searchEl = document.getElementById('search-input');
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: 'smooth' });
      searchEl.focus();
    }
  }

  function toggleMobileMenu() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
  }

  function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('active');
  }

  function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.remove('active');
  }

  function closeReceiptModalAndReset() {
    const modal = document.getElementById('receipt-modal');
    if (modal) modal.classList.remove('active');
    resetForm();
  }

  function openCommuneModal() {
    if (!isAdminLoggedIn) {
      alert(I18N[currentLang].accessDenied);
      openLoginModal();
      return;
    }
    renderCommunesModalTable();
    const modal = document.getElementById('commune-modal');
    if (modal) modal.classList.add('active');
  }

  function closeCommuneModal() {
    const modal = document.getElementById('commune-modal');
    if (modal) modal.classList.remove('active');
  }

  function renderCommunesModalTable() {
    const tbody = document.getElementById('communes-table-body');
    if (!tbody) return;
    tbody.innerHTML = communesList.map(c => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 8px;">${c.name_ar}</td>
        <td style="padding: 8px;">${c.name_fr}</td>
        <td style="padding: 8px; text-align: center;">
          <button type="button" class="btn-sm btn-delete" onclick="deleteCommune('${c.id}')" title="حذف">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function handleCommuneSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const nameArInput = document.getElementById('commune-name-ar');
    const nameFrInput = document.getElementById('commune-name-fr');
    if (!nameArInput || !nameFrInput) return;

    const nameAr = nameArInput.value.trim();
    const nameFr = nameFrInput.value.trim();
    if (!nameAr || !nameFr) return;

    const newId = `c_${Date.now()}`;
    communesList.push({ id: newId, name_ar: nameAr, name_fr: nameFr });
    saveCommunesToStorage();

    nameArInput.value = '';
    nameFrInput.value = '';
    renderCommuneOptions();
    renderCommunesModalTable();
  }

  function deleteCommune(id) {
    communesList = communesList.filter(c => c.id !== id);
    saveCommunesToStorage();
    renderCommuneOptions();
    renderCommunesModalTable();
  }

  // ====================================================
  // 10. INITIALIZATION
  // ====================================================
  function initApp() {
    loadStoredData();
    applyLanguageUI();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTable();
      });
    }

    const filterCommune = document.getElementById('filter-commune');
    if (filterCommune) {
      filterCommune.addEventListener('change', (e) => {
        activeFilterCommune = e.target.value;
        renderTable();
      });
    }

    const filterMembership = document.getElementById('filter-membership');
    if (filterMembership) {
      filterMembership.addEventListener('change', (e) => {
        activeFilterMembership = e.target.value;
        renderTable();
      });
    }

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        activeFilterStatus = e.target.value;
        renderTable();
      });
    }

    setupPhoneFormattingAndProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Global Click Event Delegation for Quick Filter Pills
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill, .pill-btn');
    if (pill) {
      const filterType = pill.getAttribute('data-filter') || pill.getAttribute('data-type');
      if (filterType) {
        document.querySelectorAll('.quick-filter-pills .pill-btn, .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        if (['ALL', STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED].includes(filterType)) {
          activeFilterStatus = filterType;
          activePillFilter = 'ALL';
        } else {
          activePillFilter = filterType;
        }
        renderTable();
      }
    }
  });

  // ====================================================
  // 11. GLOBAL WINDOW EXPOSURES
  // ====================================================
  window.toggleLanguage = () => {
    currentLang = currentLang === 'ar' ? 'fr' : 'ar';
    applyLanguageUI();
  };
  window.toggleMobileMenu = toggleMobileMenu;
  window.switchTab = switchTab;
  window.scrollToSection = scrollToSection;
  window.scrollToFilters = scrollToFilters;
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
  window.handleAdminLogout = handleAdminLogout;
  window.handleFormSubmit = handleFormSubmit;
  window.resetForm = resetForm;
  window.editCenterForm = editCenterForm;
  window.handleApproveCenter = handleApproveCenter;
  window.handleRejectCenter = handleRejectCenter;
  window.handleDeleteCenter = handleDeleteCenter;
  window.viewCenterReceipt = viewCenterReceipt;
  window.handleStudentCountInput = handleStudentCountInput;
  window.handlePhoneInput = handlePhoneInput;
  window.exportFormattedExcel = exportFormattedExcel;
  window.triggerPrintReport = triggerPrintReport;
  window.printRegistrationReceipt = printRegistrationReceipt;
  window.downloadBackupJSON = downloadBackupJSON;
  window.triggerRestoreJSON = triggerRestoreJSON;
  window.restoreBackupJSON = restoreBackupJSON;
  window.closeReceiptModalAndReset = closeReceiptModalAndReset;
  window.openCommuneModal = openCommuneModal;
  window.closeCommuneModal = closeCommuneModal;
  window.handleCommuneSubmit = handleCommuneSubmit;
  window.deleteCommune = deleteCommune;
  window.filterTable = () => renderTable();

  window.setQuickFilterType = (type, el) => {
    document.querySelectorAll('.quick-filter-pills .pill-btn').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
    if (['ALL', STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED].includes(type)) {
      activeFilterStatus = type;
      activePillFilter = 'ALL';
    } else {
      activePillFilter = type;
    }
    renderTable();
  };

  window.handleLoginSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const passInput = document.getElementById('login-password') || document.getElementById('admin-password');
    if (!passInput) return;
    const res = await handleAdminLogin(passInput.value);
    if (res.success) {
      passInput.value = '';
      closeLoginModal();
    } else {
      alert(res.message);
    }
  };

})();
