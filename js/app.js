/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Main Application Bootstrapper & Controller (ES Module)
   ---------------------------------------------------- */

import { loadStoredData, saveCentersToStorage, getCentersList, setCentersList, getCommunesList, syncFromGoogleSheets, saveCenterToGoogleSheets } from './storage.js';
import { getCurrentLang, setCurrentLang, applyLanguageUI, renderCommuneOptions, renderTable, updateStats, updateAdminKPIStats, setFilters, getFilters, showReceiptModal } from './ui.js';
import { checkInitialAdminAuth, handleAdminLogin, handleAdminLogout, handleApproveCenter, handleRejectCenter, handleDeleteCenter, handleAddCommune, handleDeleteCommune, renderCommunesAdminTable, getIsAdminLoggedIn } from './admin.js';
import { checkRateLimit, xssClean } from './security.js';
import { STATUS_PENDING, STATUS_APPROVED } from './moderation.js';
import { I18N } from './i18n.js';

let activeQuickFilter = 'ALL';

// Application Startup
document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  checkInitialAdminAuth();
  applyLanguageUI();
  setupEventListeners();
  setupPhoneFormattingAndProgress();
  syncFromGoogleSheets(() => {
    renderTable(getIsAdminLoggedIn());
    updateStats();
    updateAdminKPIStats();
  });
});

/**
 * Event Listeners Registration
 */
function setupEventListeners() {
  // Language Switcher
  const btnLangToggle = document.getElementById('btn-lang-toggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', () => {
      const newLang = getCurrentLang() === 'ar' ? 'fr' : 'ar';
      setCurrentLang(newLang);
      applyLanguageUI();
      renderTable(getIsAdminLoggedIn());
    });
  }

  // Mobile Menu Drawer Toggle
  const btnMobileMenu = document.querySelector('.mobile-menu-toggle');
  const btnCloseMobile = document.querySelector('.close-mobile-menu');
  if (btnMobileMenu) btnMobileMenu.addEventListener('click', toggleMobileMenu);
  if (btnCloseMobile) btnCloseMobile.addEventListener('click', toggleMobileMenu);

  // Tab Navigation Links
  const navSurvey = document.getElementById('nav-survey');
  const navSchools = document.getElementById('nav-schools-list');
  const navSearch = document.getElementById('nav-search');
  const navCommunes = document.getElementById('nav-communes');
  const navExcel = document.getElementById('nav-excel');
  const navPrint = document.getElementById('nav-print');

  if (navSurvey) navSurvey.onclick = () => switchTab('tab-survey');
  if (navSchools) navSchools.onclick = () => switchTab('tab-schools-list');
  if (navSearch) navSearch.onclick = () => switchTab('tab-search');
  if (navCommunes) navCommunes.onclick = () => switchTab('tab-communes');
  if (navExcel) navExcel.onclick = () => switchTab('tab-excel');
  if (navPrint) navPrint.onclick = () => switchTab('tab-print');

  // Search Input & Filters
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      setFilters({ search: e.target.value });
      renderTable(getIsAdminLoggedIn());
    });
  }

  const filterCommune = document.getElementById('filter-commune');
  if (filterCommune) {
    filterCommune.addEventListener('change', (e) => {
      setFilters({ commune: e.target.value });
      renderTable(getIsAdminLoggedIn());
    });
  }

  const filterMembership = document.getElementById('filter-membership');
  if (filterMembership) {
    filterMembership.addEventListener('change', (e) => {
      setFilters({ membership: e.target.value });
      renderTable(getIsAdminLoggedIn());
    });
  }

  const filterStatus = document.getElementById('filter-status');
  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      setFilters({ status: e.target.value });
      renderTable(getIsAdminLoggedIn());
    });
  }

  // Quick Filter Pills (All / Approved / Pending / Rejected / Boys / Girls / Mixte / Union)
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-filter');
      
      if (['ALL', STATUS_APPROVED, STATUS_PENDING, 'rejected'].includes(val)) {
        setFilters({ status: val });
      } else {
        setFilters({ pill: val });
      }
      renderTable(getIsAdminLoggedIn());
    });
  });

  // Table Action Buttons (Approve, Reject, Edit, Delete, Receipt)
  const tableBody = document.getElementById('schools-table-body');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      if (!action || !id) return;

      if (action === 'approve') {
        handleApproveCenter(id);
      } else if (action === 'reject') {
        handleRejectCenter(id);
      } else if (action === 'delete') {
        handleDeleteCenter(id);
      } else if (action === 'edit') {
        editCenterForm(id);
      } else if (action === 'receipt') {
        const centers = getCentersList();
        const center = centers.find(c => String(c.id) === String(id));
        if (center) showReceiptModal(center);
      }
    });
  }

  // Form Submit Handler
  const form = document.getElementById('quran-center-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const btnReset = document.getElementById('btn-form-reset');
  if (btnReset) btnReset.addEventListener('click', resetForm);

  // Admin Login Form
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const passInput = document.getElementById('admin-password');
      const errEl = document.getElementById('login-error-msg');
      if (!passInput) return;
      
      const res = await handleAdminLogin(passInput.value);
      if (res.success) {
        passInput.value = '';
        if (errEl) errEl.style.display = 'none';
        const modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'none';
      } else {
        if (errEl) {
          errEl.textContent = res.message;
          errEl.style.display = 'block';
        }
      }
    });
  }

  // Admin Add Commune Form
  const addCommuneForm = document.getElementById('add-commune-form');
  if (addCommuneForm) {
    addCommuneForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameAr = document.getElementById('commune-name-ar').value;
      const nameFr = document.getElementById('commune-name-fr').value;
      if (handleAddCommune(nameAr, nameFr)) {
        document.getElementById('commune-name-ar').value = '';
        document.getElementById('commune-name-fr').value = '';
        renderCommunesAdminTable();
      }
    });
  }

  // Commune Table Admin Delete
  const communeTableBody = document.getElementById('communes-table-body');
  if (communeTableBody) {
    communeTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.getAttribute('data-commune-id');
      if (id) handleDeleteCommune(id);
    });
  }

  // Modal Close Buttons
  document.querySelectorAll('.close-modal-btn, .close-receipt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    });
  });

  // Print Buttons
  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => window.print());
  }

  const btnExportExcel = document.getElementById('btn-export-excel');
  if (btnExportExcel) btnExportExcel.addEventListener('click', exportToExcel);

  const btnPrintReport = document.getElementById('btn-print-report');
  if (btnPrintReport) btnPrintReport.addEventListener('click', printReport);
}

/**
 * Tab Navigation Router
 */
export function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));

  const navItem = document.getElementById(`nav-${tabId.replace('tab-', '')}`);
  const targetPage = document.getElementById(tabId);

  if (navItem) navItem.classList.add('active');
  if (targetPage) targetPage.classList.add('active');

  if (tabId === 'tab-communes' && getIsAdminLoggedIn()) {
    renderCommunesAdminTable();
  }

  // Mobile menu close on select
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.remove('mobile-active');
}

export function toggleMobileMenu() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-active');
}

/**
 * Survey Form Submission Handler (Sanitization, Rate Limit, Moderation Status)
 */
function handleFormSubmit(e) {
  e.preventDefault();

  // Rate Limiting check (1 submission per 5 seconds)
  const rate = checkRateLimit('survey_submit', 5);
  if (!rate.allowed) {
    alert(getCurrentLang() === 'ar' 
      ? `يرجى الانتظار ${rate.remainingSeconds} ثوانٍ قبل تقديم طلب آخر.` 
      : `Veuillez patienter ${rate.remainingSeconds} secondes avant de soumettre à nouveau.`);
    return;
  }

  const editId = document.getElementById('center_edit_id').value;
  const nameAr = xssClean(document.getElementById('name_ar').value.trim());
  const nameFr = xssClean(document.getElementById('name_fr').value.trim());
  const directorAr = xssClean(document.getElementById('director_ar').value.trim());
  const directorFr = xssClean(document.getElementById('director_fr').value.trim());
  const addressAr = xssClean(document.getElementById('address_ar').value.trim());
  const addressFr = xssClean(document.getElementById('address_fr').value.trim());
  const commune = document.getElementById('commune').value;
  const phone = xssClean(document.getElementById('phone').value.trim());
  const boys = parseInt(document.getElementById('boys_count').value) || 0;
  const girls = parseInt(document.getElementById('girls_count').value) || 0;
  const membership = document.getElementById('union_membership').value;

  const total = boys + girls;
  let genderType = 'mixte';
  if (boys > 0 && girls === 0) genderType = 'garcons';
  else if (girls > 0 && boys === 0) genderType = 'filles';

  const centers = getCentersList();
  let targetCenter = null;

  if (editId) {
    // Edit Mode (Preserves status)
    const idx = centers.findIndex(c => String(c.id) === String(editId));
    if (idx !== -1) {
      centers[idx] = {
        ...centers[idx],
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
      targetCenter = centers[idx];
    }
  } else {
    // New Registration (Assigned pending moderation status unless admin creates it)
    const newId = Date.now();
    const refCode = `REC-2026-${String(centers.length + 1).padStart(4, '0')}`;
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
      status: getIsAdminLoggedIn() ? STATUS_APPROVED : STATUS_PENDING,
      created_at: new Date().toISOString()
    };
    centers.unshift(targetCenter);
  }

  setCentersList(centers);
  saveCenterToGoogleSheets(targetCenter);

  resetForm();
  renderTable(getIsAdminLoggedIn());
  updateStats();
  updateAdminKPIStats();

  showReceiptModal(targetCenter);
}

function resetForm() {
  const form = document.getElementById('quran-center-form');
  if (form) form.reset();
  document.getElementById('center_edit_id').value = '';
  localStorage.removeItem('mali_quran_form_draft');
  updateFormProgress();
}

function editCenterForm(id) {
  const centers = getCentersList();
  const center = centers.find(c => String(c.id) === String(id));
  if (!center) return;

  switchTab('tab-survey');

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

  updateFormProgress();
}

/**
 * Phone Auto-formatting and Form Progress
 */
function setupPhoneFormattingAndProgress() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let raw = e.target.value.replace(/\D/g, '');
      if (raw.length > 8) raw = raw.substring(0, 8);
      let formatted = '';
      for (let i = 0; i < raw.length; i++) {
        if (i > 0 && i % 2 === 0) formatted += ' ';
        formatted += raw[i];
      }
      e.target.value = formatted;
      updateFormProgress();
    });
  }

  const inputs = document.querySelectorAll('#quran-center-form input, #quran-center-form select');
  inputs.forEach(inp => {
    inp.addEventListener('input', updateFormProgress);
    inp.addEventListener('change', updateFormProgress);
  });
  updateFormProgress();
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

/**
 * Excel SheetJS Export
 */
function exportToExcel() {
  const centers = getCentersList();
  const data = centers.map((c, i) => ({
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
    alert('مكتبة SheetJS غير محملة.');
  }
}

/**
 * Grouped Print Report
 */
function printReport() {
  window.print();
}

// Global functions exports for inline HTML onclick compatibility
window.toggleLanguage = () => {
  const newLang = getCurrentLang() === 'ar' ? 'fr' : 'ar';
  setCurrentLang(newLang);
  applyLanguageUI();
  renderTable(getIsAdminLoggedIn());
};
window.toggleMobileMenu = toggleMobileMenu;
window.switchTab = switchTab;
window.openLoginModal = () => {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'flex';
};
