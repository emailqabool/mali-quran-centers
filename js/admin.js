/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Admin Authentication, Security & Moderation Controller
   ---------------------------------------------------- */

import { verifyAdminPassword, setAdminSession, clearAdminSession, isSessionValid } from './security.js';
import { getCentersList, setCentersList, getCommunesList, setCommunesList } from './storage.js';
import { updateCenterStatus, STATUS_APPROVED, STATUS_REJECTED } from './moderation.js';
import { renderTable, updateStats, updateAdminKPIStats, renderCommuneOptions, getCurrentLang } from './ui.js';
import { I18N } from './i18n.js';

let isAdminLoggedIn = false;

export function getIsAdminLoggedIn() {
  return isAdminLoggedIn;
}

export function checkInitialAdminAuth() {
  isAdminLoggedIn = isSessionValid();
  updateAuthUI();
  return isAdminLoggedIn;
}

export async function handleAdminLogin(inputPassword) {
  const isValid = await verifyAdminPassword(inputPassword);
  if (isValid) {
    isAdminLoggedIn = true;
    setAdminSession();
    updateAuthUI();
    renderTable(isAdminLoggedIn);
    updateAdminKPIStats();
    return { success: true };
  } else {
    return { success: false, message: 'كلمة المرور غير صحيحة / Mot de passe incorrect' };
  }
}

export function handleAdminLogout() {
  isAdminLoggedIn = false;
  clearAdminSession();
  updateAuthUI();
  renderTable(isAdminLoggedIn);
  updateAdminKPIStats();
}

export function updateAuthUI() {
  const dict = I18N[getCurrentLang()];
  const authContainer = document.getElementById('auth-status-container');
  const adminSection = document.getElementById('admin-communes-section');
  const printAdminControls = document.getElementById('admin-print-controls');

  document.body.classList.toggle('admin-mode', isAdminLoggedIn);

  if (authContainer) {
    if (isAdminLoggedIn) {
      authContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-primary"><i class="fa-solid fa-user-shield"></i> مسؤول النظام</span>
          <button class="footer-auth-link" id="btn-logout" title="${dict.logoutBtn}" style="color: #ef4444; border-color: #fca5a5; font-weight: bold; cursor: pointer;">
            <i class="fa-solid fa-right-from-bracket"></i> <span>${dict.logoutBtn}</span>
          </button>
        </div>
      `;
      const btnLogout = document.getElementById('btn-logout');
      if (btnLogout) btnLogout.onclick = handleAdminLogout;
    } else {
      authContainer.innerHTML = `
        <button type="button" class="footer-auth-link" id="btn-login-trigger" style="cursor: pointer;">
          <i class="fa-solid fa-lock"></i> <span id="txt-login-btn">${dict.loginBtn}</span>
        </button>
      `;
      const btnLoginTrigger = document.getElementById('btn-login-trigger');
      if (btnLoginTrigger) btnLoginTrigger.onclick = () => {
        const loginModal = document.getElementById('login-modal');
        if (loginModal) loginModal.style.display = 'flex';
      };
    }
  }

  if (adminSection) {
    adminSection.style.display = isAdminLoggedIn ? 'block' : 'none';
  }

  if (printAdminControls) {
    printAdminControls.style.display = isAdminLoggedIn ? 'block' : 'none';
  }
}

/**
 * Moderation Action Handlers
 */
export function handleApproveCenter(id) {
  const updated = updateCenterStatus(id, STATUS_APPROVED);
  if (updated) {
    renderTable(isAdminLoggedIn);
    updateStats();
    updateAdminKPIStats();
  }
}

export function handleRejectCenter(id) {
  const updated = updateCenterStatus(id, STATUS_REJECTED);
  if (updated) {
    renderTable(isAdminLoggedIn);
    updateStats();
    updateAdminKPIStats();
  }
}

export function handleDeleteCenter(id) {
  const dict = I18N[getCurrentLang()];
  if (confirm(dict.confirmDelete)) {
    const centers = getCentersList();
    const updatedCenters = centers.filter(c => String(c.id) !== String(id));
    setCentersList(updatedCenters);
    renderTable(isAdminLoggedIn);
    updateStats();
    updateAdminKPIStats();
  }
}

/**
 * Commune Management Handlers
 */
export function handleAddCommune(nameAr, nameFr) {
  if (!nameAr || !nameFr) return false;
  const communes = getCommunesList();
  const newCommune = {
    id: `c_${Date.now()}`,
    name_ar: nameAr.trim(),
    name_fr: nameFr.trim()
  };
  communes.push(newCommune);
  setCommunesList(communes);
  renderCommuneOptions();
  return true;
}

export function handleDeleteCommune(communeId) {
  const communes = getCommunesList();
  const updated = communes.filter(c => c.id !== communeId);
  setCommunesList(updated);
  renderCommuneOptions();
  renderCommunesAdminTable();
}

export function renderCommunesAdminTable() {
  const tableBody = document.getElementById('communes-table-body');
  if (!tableBody) return;
  const communes = getCommunesList();

  if (communes.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">لا توجد بلديات مسجلة</td></tr>`;
    return;
  }

  tableBody.innerHTML = communes.map(c => `
    <tr>
      <td>${c.name_ar}</td>
      <td>${c.name_fr}</td>
      <td>
        <button class="btn-sm btn-delete" data-commune-id="${c.id}" title="حذف البلدية">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}
