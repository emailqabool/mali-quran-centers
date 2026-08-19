/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Main Application Bootstrapper & Global Window Bridge
   ---------------------------------------------------- */

import { loadStoredData, saveCentersToStorage, getCentersList, setCentersList, getCommunesList, syncFromGoogleSheets, saveCenterToGoogleSheets, downloadBackupJSON as downloadBackupJSONFile, restoreBackupJSONData } from './storage.js';
import { getCurrentLang, setCurrentLang, applyLanguageUI, renderCommuneOptions, renderTable, updateStats, updateAdminKPIStats, setFilters, getFilters, showReceiptModal } from './ui.js';
import { checkInitialAdminAuth, handleAdminLogin, handleAdminLogout, handleApproveCenter, handleRejectCenter, handleDeleteCenter, handleAddCommune, handleDeleteCommune, renderCommunesAdminTable, getIsAdminLoggedIn } from './admin.js';
import { checkRateLimit, xssClean } from './security.js';
import { STATUS_PENDING, STATUS_APPROVED } from './moderation.js';
import { I18N } from './i18n.js';

// Global application bootstrap
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
 * Event Listeners & UI Binding Setup
 */
function setupEventListeners() {
  // Language Toggle Button
  const btnLangToggle = document.getElementById('btn-lang-toggle');
  if (btnLangToggle) {
    btnLangToggle.addEventListener('click', toggleLanguage);
  }

  // Search & Filters Inputs
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

  // Quick Filter Pills
  const filterPills = document.querySelectorAll('.filter-pill, .pill-btn');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = pill.getAttribute('data-filter') || pill.getAttribute('data-type');
      
      if (['ALL', STATUS_APPROVED, STATUS_PENDING, 'rejected'].includes(val)) {
        setFilters({ status: val, pill: 'ALL' });
      } else {
        setFilters({ pill: val });
      }
      renderTable(getIsAdminLoggedIn());
    });
  });

  // Action Delegation for Data Table Buttons
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

  // Center Survey Form Submit
  const form = document.getElementById('quran-center-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Admin Login Modal Form
  const loginForm = document.getElementById('admin-login-form') || document.querySelector('#login-modal form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
}

/**
 * Navigation & Tab Switchers
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

  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.remove('mobile-active');
}

export function toggleMobileMenu() {
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) sidebar.classList.toggle('mobile-active');
}

export function toggleLanguage() {
  const newLang = getCurrentLang() === 'ar' ? 'fr' : 'ar';
  setCurrentLang(newLang);
  applyLanguageUI();
  renderTable(getIsAdminLoggedIn());
}

/**
 * Admin Login Handler with Immediate UI Update & Logout Button Display
 */
export async function handleLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const passInput = document.getElementById('login-password') || document.getElementById('admin-password');
  const errEl = document.getElementById('login-error-msg');
  if (!passInput) return;

  const res = await handleAdminLogin(passInput.value);
  if (res.success) {
    passInput.value = '';
    if (errEl) errEl.style.display = 'none';
    closeLoginModal();
    // Immediate UI update to show logout button and admin mode
    renderTable(true);
    updateStats();
    updateAdminKPIStats();
  } else {
    if (errEl) {
      errEl.textContent = res.message;
      errEl.style.display = 'block';
    } else {
      alert(res.message);
    }
  }
}

export function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'flex';
}

export function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'none';
}

/**
 * Student Count Dynamic Calculations
 */
export function handleStudentCountInput() {
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
  let typeLabel = getCurrentLang() === 'ar' ? 'بنين وبنات' : 'Mixte';
  let badgeClass = 'badge-mixte';

  if (boys > 0 && girls === 0) {
    type = 'garcons';
    typeLabel = getCurrentLang() === 'ar' ? 'بنين فقط' : 'Garçons uniquement';
    badgeClass = 'badge-garcons';
  } else if (girls > 0 && boys === 0) {
    type = 'filles';
    typeLabel = getCurrentLang() === 'ar' ? 'بنات فقط' : 'Filles uniquement';
    badgeClass = 'badge-filles';
  }

  if (genderTypeHidden) genderTypeHidden.value = type;
  if (badgeLbl) badgeLbl.textContent = typeLabel;
  if (badgeEl) {
    badgeEl.className = `auto-type-badge ${badgeClass}`;
  }

  updateFormProgress();
}

/**
 * Survey Form Submission Handler
 */
function handleFormSubmit(e) {
  e.preventDefault();

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

export function resetForm() {
  const form = document.getElementById('quran-center-form');
  if (form) form.reset();
  const editIdInput = document.getElementById('center_edit_id');
  if (editIdInput) editIdInput.value = '';
  localStorage.removeItem('mali_quran_form_draft');
  handleStudentCountInput();
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

  handleStudentCountInput();
  updateFormProgress();
}

/**
 * Phone Input Formatting & Form Progress Calculation
 */
export function handlePhoneInput(input) {
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

function setupPhoneFormattingAndProgress() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => handlePhoneInput(phoneInput));
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

/**
 * Export Excel via SheetJS
 */
export function exportFormattedExcel() {
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
 * Backup and Restore Helpers
 */
export function triggerRestoreJSON() {
  const fileInput = document.getElementById('restore-file-input');
  if (fileInput) fileInput.click();
}

export function restoreBackupJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (restoreBackupJSONData(data)) {
        alert('تم استعادة النسخة الاحتياطية بنجاح!');
        renderTable(getIsAdminLoggedIn());
        updateStats();
        updateAdminKPIStats();
      } else {
        alert('ملف النسخة الاحتياطية غير صالحة.');
      }
    } catch (err) {
      alert('خطأ في قراءة ملف JSON.');
    }
  };
  reader.readAsText(file);
}

/**
 * Print Reports & Receipt Modals
 */
export function triggerPrintReport() {
  window.print();
}

export function closeReceiptModalAndReset() {
  const modal = document.getElementById('receipt-modal');
  if (modal) modal.style.display = 'none';
  resetForm();
}

export function closeDetailsModal() {
  const modal = document.getElementById('details-modal');
  if (modal) modal.style.display = 'none';
}

export function closePrintOptionsModal() {
  const modal = document.getElementById('print-options-modal');
  if (modal) modal.style.display = 'none';
}

// ----------------------------------------------------
// Global Window Scope Bridge (Guarantees 100% Inline HTML Onclick Compatibility)
// ----------------------------------------------------
window.toggleLanguage = toggleLanguage;
window.toggleMobileMenu = toggleMobileMenu;
window.switchTab = switchTab;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.handleLoginSubmit = handleLoginSubmit;
window.handleAdminLogout = handleAdminLogout;
window.resetForm = resetForm;
window.handleStudentCountInput = handleStudentCountInput;
window.handlePhoneInput = handlePhoneInput;
window.exportFormattedExcel = exportFormattedExcel;
window.triggerPrintReport = triggerPrintReport;
window.downloadBackupJSON = downloadBackupJSONFile;
window.triggerRestoreJSON = triggerRestoreJSON;
window.restoreBackupJSON = restoreBackupJSON;
window.closeReceiptModalAndReset = closeReceiptModalAndReset;
window.closeDetailsModal = closeDetailsModal;
window.closePrintOptionsModal = closePrintOptionsModal;
window.filterTable = () => renderTable(getIsAdminLoggedIn());
window.setQuickFilterType = (type, el) => {
  document.querySelectorAll('.quick-filter-pills .pill-btn').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  if (['ALL', STATUS_APPROVED, STATUS_PENDING, 'rejected'].includes(type)) {
    setFilters({ status: type, pill: 'ALL' });
  } else {
    setFilters({ pill: type });
  }
  renderTable(getIsAdminLoggedIn());
};
