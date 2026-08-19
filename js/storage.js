/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Data Persistence & LocalStorage Storage Module
   ---------------------------------------------------- */

import { DEFAULT_CENTERS, DEFAULT_COMMUNES, GOOGLE_SCRIPT_URL } from './config.js';
import { xssClean } from './security.js';

let centersList = [];
let communesList = [];

export function getCentersList() {
  return centersList;
}

export function setCentersList(newList) {
  centersList = newList;
  saveCentersToStorage();
}

export function getCommunesList() {
  return communesList;
}

export function setCommunesList(newList) {
  communesList = newList;
  saveCommunesToStorage();
}

/**
 * Loads stored data and migrates legacy schema automatically
 */
export function loadStoredData() {
  // Load Centers
  const savedCenters = localStorage.getItem('mali_quran_centers');
  if (savedCenters) {
    try {
      const parsed = JSON.parse(savedCenters);
      centersList = parsed.map((item, idx) => ({
        ...item,
        status: item.status || 'approved',
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
}

export function saveCentersToStorage() {
  localStorage.setItem('mali_quran_centers', JSON.stringify(centersList));
}

export function saveCommunesToStorage() {
  localStorage.setItem('mali_quran_communes', JSON.stringify(communesList));
}

/**
 * Backup & Restore Handlers (JSON)
 */
export function downloadBackupJSON() {
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
  a.download = `AECMEC_Mali_Quranic_Centers_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreBackupJSONData(jsonData) {
  if (!jsonData || !Array.isArray(jsonData.centers)) {
    return false;
  }
  centersList = jsonData.centers;
  if (Array.isArray(jsonData.communes)) {
    communesList = jsonData.communes;
    saveCommunesToStorage();
  }
  saveCentersToStorage();
  return true;
}

/**
 * Google Sheets Sync Handlers
 */
export async function saveCenterToGoogleSheets(centerData) {
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

export async function syncFromGoogleSheets(onSuccessCallback) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    if (data && data.status === 'success' && Array.isArray(data.centers) && data.centers.length > 0) {
      centersList = data.centers.map(item => ({
        ...item,
        status: item.status || 'approved'
      }));
      saveCentersToStorage();
      if (typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
    }
  } catch (err) {
    console.log('Using local storage fallback', err);
  }
}
