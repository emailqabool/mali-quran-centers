/* ----------------------------------------------------
   Quranic Centers Survey & Management System - Mali
   Config & Constants Module
   ---------------------------------------------------- */

export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx83PCEqT39I-X5GHyuAII2QkpEz_zLOYX_HCp2G6U8UvhGGMhpu6xzqMoO7yU-11R5dw/exec";

// Default Initial Mock Data for Quranic Centers
export const DEFAULT_CENTERS = [
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

// Default List of Communes & Regions
export const DEFAULT_COMMUNES = [
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
