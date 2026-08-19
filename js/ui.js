/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   UI Rendering & DOM Manipulation Module
   ---------------------------------------------------- */

import { I18N } from './i18n.js';
import { getCentersList, getCommunesList } from './storage.js';
import { filterCentersList, getModerationCounts, STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED } from './moderation.js';

let currentLang = 'ar';
let activeFilterCommune = 'ALL';
let activeFilterMembership = 'ALL';
let activeFilterStatus = 'ALL';
let activePillFilter = 'ALL';
let searchQuery = '';

export function getCurrentLang() {
  return currentLang;
}

export function setCurrentLang(lang) {
  currentLang = lang;
}

export function setFilters(filters = {}) {
  if (filters.commune !== undefined) activeFilterCommune = filters.commune;
  if (filters.membership !== undefined) activeFilterMembership = filters.membership;
  if (filters.status !== undefined) activeFilterStatus = filters.status;
  if (filters.pill !== undefined) activePillFilter = filters.pill;
  if (filters.search !== undefined) searchQuery = filters.search;
}

export function getFilters() {
  return {
    commune: activeFilterCommune,
    membership: activeFilterMembership,
    status: activeFilterStatus,
    pill: activePillFilter,
    search: searchQuery
  };
}

/**
 * Updates all text elements dynamically based on current language
 */
export function applyLanguageUI() {
  const dict = I18N[currentLang];
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // Toggle Button Text
  const btnTargetLang = document.getElementById('txt-target-lang');
  if (btnTargetLang) {
    btnTargetLang.textContent = currentLang === 'ar' ? '🇫🇷 Français' : '🇸🇦 العربية';
  }

  // Loop through I18N keys and map to element IDs
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

  // Render Commune Select Options & Table
  renderCommuneOptions();
  renderTable();
  updateStats();
  updateAdminKPIStats();
}

/**
 * Renders Commune dropdown options in forms & filters
 */
export function renderCommuneOptions() {
  const communes = getCommunesList();
  const formSelect = document.getElementById('center-commune');
  const filterSelect = document.getElementById('filter-commune');

  const dict = I18N[currentLang];

  if (formSelect) {
    const currentVal = formSelect.value;
    formSelect.innerHTML = `<option value="">${dict.selectCommuneDefault}</option>`;
    communes.forEach(c => {
      const name = currentLang === 'ar' ? c.name_ar : c.name_fr;
      formSelect.innerHTML += `<option value="${c.name_fr}">${name}</option>`;
    });
    formSelect.value = currentVal;
  }

  if (filterSelect) {
    const currentVal = filterSelect.value;
    filterSelect.innerHTML = `<option value="ALL">${dict.optFilterAll}</option>`;
    communes.forEach(c => {
      const name = currentLang === 'ar' ? c.name_ar : c.name_fr;
      filterSelect.innerHTML += `<option value="${c.name_fr}">${name}</option>`;
    });
    filterSelect.value = currentVal;
  }
}

/**
 * Renders the centers table with status badges and admin actions
 */
export function renderTable(isAdminLoggedIn = false) {
  const tableBody = document.getElementById('schools-table-body');
  if (!tableBody) return;

  const centers = getCentersList();
  const filtered = filterCentersList(centers, {
    searchQuery,
    communeFilter: activeFilterCommune,
    membershipFilter: activeFilterMembership,
    statusFilter: activeFilterStatus,
    genderPillFilter: activePillFilter,
    isAdminLoggedIn
  });

  const dict = I18N[currentLang];

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="${isAdminLoggedIn ? 8 : 7}" style="text-align:center; padding: 32px; color: var(--text-muted);">
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
    const communeObj = getCommunesList().find(com => com.name_fr === c.commune);
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
            <button class="btn-sm btn-approve" data-action="approve" data-id="${c.id}" title="${dict.btnApprove}">
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn-sm btn-reject" data-action="reject" data-id="${c.id}" title="${dict.btnReject}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
          ${status === STATUS_REJECTED ? `
            <button class="btn-sm btn-approve" data-action="approve" data-id="${c.id}" title="${dict.btnApprove}">
              <i class="fa-solid fa-check"></i>
            </button>
          ` : ''}
          <button class="btn-sm btn-edit" data-action="edit" data-id="${c.id}" title="${dict.btnEdit}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-sm btn-delete" data-action="delete" data-id="${c.id}" title="${dict.btnDelete}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    } else {
      actionsHTML = `
        <button class="btn-sm btn-view-receipt" data-action="receipt" data-id="${c.id}" title="عرض الإيصال">
          <i class="fa-solid fa-receipt"></i>
        </button>
      `;
    }

    html += `
      <tr>
        <td>${statusBadgeHTML}</td>
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
  const visibleCountEl = document.getElementById('stat-visible-count');
  const visibleStudentsEl = document.getElementById('stat-visible-students');
  
  if (visibleCountEl) visibleCountEl.textContent = filtered.length;

  const totalStudents = filtered.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
  const totalBoys = filtered.reduce((acc, c) => acc + (Number(c.boys) || 0), 0);
  const totalGirls = filtered.reduce((acc, c) => acc + (Number(c.girls) || 0), 0);

  if (visibleStudentsEl) {
    visibleStudentsEl.textContent = `${totalStudents} (${dict.boysPrefix} ${totalBoys} | ${dict.girlsPrefix} ${totalGirls})`;
  }
}

/**
 * Updates KPI Summary Cards
 */
export function updateStats() {
  const centers = getCentersList();
  const approvedCenters = centers.filter(c => (c.status || STATUS_APPROVED) === STATUS_APPROVED);
  
  const totalCentersEl = document.getElementById('sidebar-stat-centers');
  const totalStudentsEl = document.getElementById('sidebar-stat-students');

  if (totalCentersEl) totalCentersEl.textContent = approvedCenters.length;

  const totalStudents = approvedCenters.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
  if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
}

/**
 * Updates Admin Dashboard KPI stats including Pending Moderation Requests
 */
export function updateAdminKPIStats() {
  const counts = getModerationCounts();
  const centers = getCentersList();

  const kpiCentersEl = document.getElementById('kpi-total-centers');
  const kpiStudentsEl = document.getElementById('kpi-total-students');
  const kpiTopCommuneEl = document.getElementById('kpi-top-commune');
  const kpiUnionRatioEl = document.getElementById('kpi-union-ratio');
  const kpiPendingEl = document.getElementById('kpi-pending-moderation');

  const approvedCenters = centers.filter(c => (c.status || STATUS_APPROVED) === STATUS_APPROVED);

  if (kpiCentersEl) kpiCentersEl.textContent = approvedCenters.length;

  const totalStudents = approvedCenters.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
  if (kpiStudentsEl) kpiStudentsEl.textContent = totalStudents;

  // Calculate top commune
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

  const communeObj = getCommunesList().find(com => com.name_fr === topCommuneName);
  if (kpiTopCommuneEl) {
    kpiTopCommuneEl.textContent = communeObj ? (currentLang === 'ar' ? communeObj.name_ar : communeObj.name_fr) : topCommuneName;
  }

  // Calculate Union Membership ratio
  const unionMembers = approvedCenters.filter(c => c.membership === 'Oui').length;
  const ratio = approvedCenters.length > 0 ? Math.round((unionMembers / approvedCenters.length) * 100) : 0;
  if (kpiUnionRatioEl) kpiUnionRatioEl.textContent = `${ratio}%`;

  // Moderation Pending Counter KPI
  if (kpiPendingEl) {
    kpiPendingEl.textContent = counts.pending;
    const badgeEl = document.getElementById('pending-moderation-badge');
    if (badgeEl) {
      badgeEl.textContent = counts.pending;
      badgeEl.style.display = counts.pending > 0 ? 'inline-block' : 'none';
    }
  }
}

/**
 * Displays Registration Receipt Modal
 */
export function showReceiptModal(centerData) {
  const modal = document.getElementById('receipt-modal');
  if (!modal) return;

  const dict = I18N[currentLang];
  const refCodeEl = document.getElementById('receipt-modal-ref');
  const bodyTable = document.getElementById('receipt-modal-table-body');
  const noteEl = document.getElementById('receipt-pending-note');

  if (refCodeEl) refCodeEl.textContent = centerData.ref_code || 'REC-2026-XXXX';
  if (noteEl) noteEl.textContent = dict.receiptPendingNote;

  const statusBadge = centerData.status === STATUS_APPROVED
    ? `<span class="badge badge-success">${dict.statusApproved}</span>`
    : `<span class="badge badge-warning">${dict.statusPending}</span>`;

  if (bodyTable) {
    bodyTable.innerHTML = `
      <tr><th>${dict.thCenterName}</th><td>${centerData.name_ar} / ${centerData.name_fr}</td></tr>
      <tr><th>${dict.thDirectorName}</th><td>${centerData.director_ar} / ${centerData.director_fr}</td></tr>
      <tr><th>${dict.thCommune}</th><td>${centerData.commune}</td></tr>
      <tr><th>${dict.thPhone}</th><td>${centerData.phone}</td></tr>
      <tr><th>${dict.thStudentsCount}</th><td>${centerData.total} (${dict.boysPrefix} ${centerData.boys} | ${dict.girlsPrefix} ${centerData.girls})</td></tr>
      <tr><th>${dict.thUnionMembership}</th><td>${centerData.membership === 'Oui' ? dict.optMemYes : dict.optMemNo}</td></tr>
      <tr><th>${dict.thStatus}</th><td>${statusBadge}</td></tr>
    `;
  }

  // Populate Print Area
  const printRef = document.getElementById('receipt-print-ref-code');
  const printDate = document.getElementById('receipt-print-date');
  const printBody = document.getElementById('receipt-print-table-body');

  if (printRef) printRef.textContent = centerData.ref_code || 'REC-2026-XXXX';
  if (printDate) printDate.textContent = new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR');
  
  if (printBody) {
    printBody.innerHTML = `
      <tr>
        <td style="font-weight:bold; width:35%;">اسم المركز / Nom du Centre:</td>
        <td>${centerData.name_ar}<br><em>${centerData.name_fr}</em></td>
      </tr>
      <tr>
        <td style="font-weight:bold;">المدير / Directeur:</td>
        <td>${centerData.director_ar} (${centerData.director_fr})</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">البلدية / Commune:</td>
        <td>${centerData.commune}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">الهاتف / Téléphone:</td>
        <td>${centerData.phone}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">عدد الطلاب / Nombre d'élèves:</td>
        <td>${centerData.total} (بنين: ${centerData.boys} | بنات: ${centerData.girls})</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">حالة التوثيق / Statut:</td>
        <td>${centerData.status === STATUS_APPROVED ? 'معتمد رسمياً / Approuvé' : 'قيد التدقيق والتوثيق / En attente'}</td>
      </tr>
    `;
  }

  modal.style.display = 'flex';
}
