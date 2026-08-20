/**
 * =========================================================================
 * منصة حصر مدارس ومراكز تحفيظ القرآن الكريم في مالي - AECMEC MALI
 * Google Apps Script Cloud Database Engine (Centres & Communes)
 * =========================================================================
 * 
 * تعليمات التثبيت:
 * 1. افتح جدول Google Sheets جديد أو الجدول الحالي.
 * 2. اضغط على (Extensions / الإضافات) -> (Apps Script).
 * 3. امسح أي كود موجود والصق هذا الكود كاملاً.
 * 4. اضغط على (Deploy / نشر) -> (New deployment / نشر جديد).
 * 5. اختر نوع النشر: (Web app / تطبيق ويب).
 * 6. في حقل (Execute as): اختر (Me / حسابي).
 * 7. في حقل (Who has access): اختر (Anyone / أي شخص) - ضروري جداً لتلقي البيانات.
 * 8. اضغط (Deploy / نشر) وانسخ رابط الويب (Web App URL).
 */

const SHEET_CENTRES = "Centres";
const SHEET_COMMUNES = "Communes";

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheetsIfNeeded(ss);

    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAllData";

    if (action === "getAllData" || action === "getData") {
      const centers = getCentersFromSheet(ss);
      const communes = getCommunesFromSheet(ss);

      const responseData = {
        success: true,
        version: "2026.2",
        timestamp: new Date().toISOString(),
        centers: centers,
        communes: communes
      };

      return ContentService.createTextOutput(JSON.stringify(responseData))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "AECMEC API Ready" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initSheetsIfNeeded(ss);

    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const action = data.action || "addCenter";

    if (action === "addCenter" || action === "saveCenter") {
      const center = data.center || data;
      saveCenterToSheet(ss, center);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Center saved successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "saveCommunes") {
      const communes = data.communes || [];
      saveCommunesToSheet(ss, communes);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Communes saved successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateCenterStatus") {
      updateCenterStatusInSheet(ss, data.id, data.status);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Center status updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "deleteCenter") {
      deleteCenterFromSheet(ss, data.id);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Center deleted" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------
// Helper Functions for Sheets
// ----------------------------------------------------
function initSheetsIfNeeded(ss) {
  // Init Centres Sheet
  let cSheet = ss.getSheetByName(SHEET_CENTRES);
  if (!cSheet) {
    cSheet = ss.insertSheet(SHEET_CENTRES);
    cSheet.appendRow([
      "ID", "Ref_Code", "Nom_Ar", "Nom_Fr", "Directeur_Ar", "Directeur_Fr",
      "Adresse_Ar", "Adresse_Fr", "Commune", "Telephone", "Garcons", "Filles",
      "Total", "Type_Genre", "Adhesion_Union", "Statut_Validation", "Date_Enregistrement"
    ]);
    cSheet.setFrozenRows(1);
    cSheet.getRange(1, 1, 1, 17).setBackground("#1b4332").setFontColor("#ffffff").setFontWeight("bold");
  }

  // Init Communes Sheet
  let comSheet = ss.getSheetByName(SHEET_COMMUNES);
  if (!comSheet) {
    comSheet = ss.insertSheet(SHEET_COMMUNES);
    comSheet.appendRow(["ID", "Nom_Ar", "Nom_Fr"]);
    comSheet.setFrozenRows(1);
    comSheet.getRange(1, 1, 1, 3).setBackground("#1b4332").setFontColor("#ffffff").setFontWeight("bold");
    
    // Seed default communes
    const defaultCommunes = [
      ["c1", "البلدية الأولى - باماكو", "Commune I - Bamako"],
      ["c2", "البلدية الثانية - باماكو", "Commune II - Bamako"],
      ["c3", "البلدية الثالثة - باماكو", "Commune III - Bamako"],
      ["c4", "البلدية الرابعة - باماكو", "Commune IV - Bamako"],
      ["c5", "البلدية الخامسة - باماكو", "Commune V - Bamako"],
      ["c6", "البلدية السادسة - باماكو", "Commune VI - Bamako"],
      ["c7", "كايس", "Kayes"],
      ["c8", "كوليكورو", "Koulikoro"],
      ["c9", "سيكاسو", "Sikasso"],
      ["c10", "سيغو", "Ségou"],
      ["c11", "موبتي", "Mopti"],
      ["c12", "تمبكتو", "Tombouctou"],
      ["c13", "غاو", "Gao"],
      ["c14", "كيدال", "Kidal"]
    ];
    defaultCommunes.forEach(c => comSheet.appendRow(c));
  }
}

function getCentersFromSheet(ss) {
  const sheet = ss.getSheetByName(SHEET_CENTRES);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const centers = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[2]) continue;
    centers.push({
      id: row[0],
      ref_code: row[1],
      name_ar: row[2],
      name_fr: row[3],
      director_ar: row[4],
      director_fr: row[5],
      address_ar: row[6],
      address_fr: row[7],
      commune: row[8],
      phone: String(row[9]),
      boys: Number(row[10]) || 0,
      girls: Number(row[11]) || 0,
      total: Number(row[12]) || 0,
      gender_type: row[13] || "mixte",
      membership: row[14] || "Non",
      status: row[15] || "approved",
      created_at: row[16] || new Date().toISOString()
    });
  }
  return centers;
}

function saveCenterToSheet(ss, center) {
  const sheet = ss.getSheetByName(SHEET_CENTRES);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(center.id)) {
      foundRow = i + 1;
      break;
    }
  }

  const rowValues = [
    center.id || Date.now(),
    center.ref_code || "",
    center.name_ar || "",
    center.name_fr || "",
    center.director_ar || "",
    center.director_fr || "",
    center.address_ar || "",
    center.address_fr || "",
    center.commune || "",
    center.phone || "",
    center.boys || 0,
    center.girls || 0,
    center.total || 0,
    center.gender_type || "mixte",
    center.membership || "Non",
    center.status || "approved",
    center.created_at || new Date().toISOString()
  ];

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, 17).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function getCommunesFromSheet(ss) {
  const sheet = ss.getSheetByName(SHEET_COMMUNES);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const communes = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] && !row[1]) continue;
    communes.push({
      id: String(row[0]),
      name_ar: String(row[1]),
      name_fr: String(row[2])
    });
  }
  return communes;
}

function saveCommunesToSheet(ss, communes) {
  let sheet = ss.getSheetByName(SHEET_COMMUNES);
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet(SHEET_COMMUNES);
  sheet.appendRow(["ID", "Nom_Ar", "Nom_Fr"]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 3).setBackground("#1b4332").setFontColor("#ffffff").setFontWeight("bold");

  communes.forEach(c => {
    sheet.appendRow([c.id, c.name_ar, c.name_fr]);
  });
}

function updateCenterStatusInSheet(ss, centerId, newStatus) {
  const sheet = ss.getSheetByName(SHEET_CENTRES);
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(centerId)) {
      sheet.getRange(i + 1, 16).setValue(newStatus);
      break;
    }
  }
}

function deleteCenterFromSheet(ss, centerId) {
  const sheet = ss.getSheetByName(SHEET_CENTRES);
  if (!sheet) return;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(centerId)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}
