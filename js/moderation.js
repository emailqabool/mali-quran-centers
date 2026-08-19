/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Data Moderation Workflow Module (Pending / Approved / Rejected)
   ---------------------------------------------------- */

import { getCentersList, setCentersList } from './storage.js';

export const STATUS_APPROVED = 'approved';
export const STATUS_PENDING = 'pending';
export const STATUS_REJECTED = 'rejected';

/**
 * Updates the status of a specific center (Approved, Rejected, Pending)
 */
export function updateCenterStatus(centerId, newStatus) {
  const centers = getCentersList();
  const index = centers.findIndex(c => String(c.id) === String(centerId));
  if (index !== -1) {
    centers[index].status = newStatus;
    centers[index].updated_at = new Date().toISOString();
    setCentersList(centers);
    return centers[index];
  }
  return null;
}

/**
 * Returns count breakdown of moderation statuses
 */
export function getModerationCounts() {
  const centers = getCentersList();
  return centers.reduce((acc, c) => {
    const status = c.status || STATUS_APPROVED;
    acc[status] = (acc[status] || 0) + 1;
    acc.total += 1;
    return acc;
  }, { total: 0, [STATUS_APPROVED]: 0, [STATUS_PENDING]: 0, [STATUS_REJECTED]: 0 });
}

/**
 * Filters centers based on search query, commune, membership, and moderation status
 */
export function filterCentersList(centers, filters = {}) {
  const {
    searchQuery = '',
    communeFilter = 'ALL',
    membershipFilter = 'ALL',
    statusFilter = 'ALL',
    genderPillFilter = 'ALL',
    isAdminLoggedIn = false
  } = filters;

  return centers.filter(center => {
    // Status Filter (If not admin, default to approved only for official public reports unless status filter specified)
    const status = center.status || STATUS_APPROVED;
    
    if (statusFilter !== 'ALL') {
      if (status !== statusFilter) return false;
    } else if (!isAdminLoggedIn) {
      // Non-admin default view shows only approved centers in public list
      if (status !== STATUS_APPROVED) return false;
    }

    // Commune Filter
    if (communeFilter !== 'ALL' && center.commune !== communeFilter) {
      return false;
    }

    // Membership Filter
    if (membershipFilter !== 'ALL' && center.membership !== membershipFilter) {
      return false;
    }

    // Gender Pill Filter
    if (genderPillFilter !== 'ALL') {
      if (genderPillFilter === 'UNION' && center.membership !== 'Oui') return false;
      if (genderPillFilter === 'mixte' && center.gender_type !== 'mixte') return false;
      if (genderPillFilter === 'filles' && center.gender_type !== 'filles') return false;
      if (genderPillFilter === 'garcons' && center.gender_type !== 'garcons') return false;
    }

    // Search Query (Search AR & FR names, director names, reference code, phone)
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
