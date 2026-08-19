/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   i18n / Dynamic Language Translation Module
   ---------------------------------------------------- */

export const I18N = {
  ar: {
    mainAppTitle: "جمع بيانات مدارس ومراكز تحفيظ القرآن الكريم في مالي",
    subAppTitle: "اتحاد المدارس والمراكز القرآنية في جمهورية مالي",
    loginBtn: "دخول المسؤول",
    logoutBtn: "تسجيل الخروج",
    submitSuccess: "تم تسجيل بيانات المركز بنجاح! البيانات الآن قيد المراجعة والتدقيق.",
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

    publicNotice: "مرحباً بكم! الاستبيان مفتوح للجميع لإدخال بيانات المركز القرآني مباشرة. تخضع البيانات المعتمدة لتدقيق وتوثيق مسؤول الاتحاد.",
    welcomeTitle: "مرحباً بكم في المنصة الرسمية لحصر المراكز القرآنية في مالي",
    welcomeDesc: "تعبئة البيانات متاحة لكافة مدراء ومشرفي المراكز والمدارس القرآنية في مالي، ولا تتطلب أي تسجيل دخول وتستغرق أقل من دقيقتين.",
    progressTxt: "نسبة إكمال بيانات الاستبيان:",

    kpiTotalCenters: "إجمالي المراكز المعتمدة",
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

    receiptSuccessMsg: "تم تسجيل بيانات المركز القرآني بنجاح وهي الآن قيد المراجعة والتدقيق من الاتحاد",
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
    submitSuccess: "Les informations du centre ont été enregistrées avec succès ! Elles sont en cours de modération.",
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

    publicNotice: "Bienvenue ! Le formulaire est ouvert à tous pour saisir directement les données du centre coranique. Les données approuvées sont validées par l'Union.",
    welcomeTitle: "Bienvenue sur la plateforme officielle de recensement",
    welcomeDesc: "Ce formulaire est ouvert à tous les responsables et directeurs de centres coraniques au Mali. Aucune connexion requise (moins de 2 minutes).",
    progressTxt: "Taux de complétion du formulaire :",

    kpiTotalCenters: "Centres approuvés",
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

    receiptSuccessMsg: "La fiche du centre coranique a été enregistrée avec succès ! Elle est en cours de modération.",
    receiptRefTitle: "N° de Référence / رقم التسجيل المرجعي",
    btnPrintReceipt: "Imprimer le reçu officiel",
    btnNewReg: "Inscrire un autre centre",
    receiptPendingNote: "Remarque : Ce reçu prouve l'enregistrement. L'adhésion sera officielle après validation par l'Union."
  }
};
