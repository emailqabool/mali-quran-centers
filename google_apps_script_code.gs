/**
 * =========================================================================
 * منصة حصر مدارس ومراكز تحفيظ القرآن الكريم في مالي - AECMEC MALI
 * Google Apps Script Cloud Engine - متوافق 100% مع جدولكم الحالي
 * =========================================================================
 * 
 * كيفية التحديث في جدولكم الحالي:
 * 1. في جدولكم المفتوح في الصورة، اضغط من القائمة العلوية على (الإضافات / Extensions) -> (Apps Script).
 * 2. امسح أي كود موجود هناك، واستبدله بهذا الكود كاملاً.
 * 3. اضغط على (حفظ / Save 💾).
 * 4. اضغط على (نشر / Deploy) -> (إدارة عمليات النشر / Manage deployments) أو (نشر جديد / New deployment).
 * 5. تأكد أن الوصول (Who has access) مضبوط على: (Anyone / أي شخص).
 * 6. اضغط Deploy وانسخ رابط الويب (Web App URL).
 */

const SHEET_COMMUNES_NAME = "البلديات";

function getCentresSheet(ss) {
  // يختار الورقة الأولى في الملف تلقائياً مهما كان اسمها (الورقة 1 / Sheet1 / المراكز)
  const sheets = ss.getSheets();
  return sheets[0];
}

function getCommunesSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_COMMUNES_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_COMMUNES_NAME);
    sheet.appendRow(["ID", "اسم البلدية (عربي)", "Nom Commune (FR)"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 3).setBackground("#1b4332").setFontColor("#ffffff").setFontWeight("bold");

    // البلديات الافتراضية
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
    defaultCommunes.forEach(c => sheet.appendRow(c));
  }
  return sheet;
}

function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAllData";

    if (action === "getAllData" || action === "getData") {
      const centers = readCentersFromActiveSheet(ss);
      const communes = readCommunesFromSheet(ss);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        version: "2026.2",
        centers: centers,
        communes: communes
      })).setMimeType(ContentService.MimeType.JSON);
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
      appendOrUpdateCenter(ss, center);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Center saved" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "saveCommunes") {
      const communes = data.communes || [];
      saveCommunesToSheet(ss, communes);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Communes saved" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateCenterStatus") {
      updateCenterStatus(ss, data.id, data.status);
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Status updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "deleteCenter") {
      deleteCenter(ss, data.id);
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
// دوال قراءة وكتابة المراكز متوافقة 100% مع ترتيب أعمدة جدولكم الحالي
// [التاريخ | رمز التسجيل | اسم المركز (عربي) | Nom du centre | المدير (عربي) | Directeur (Fr) | البلدية | العنوان | رقم الهاتف | نوع الطلاب | بنين | بنات | المجموع | عضوية الإتحاد | حالة التوثيق]
// ----------------------------------------------------
function readCentersFromActiveSheet(ss) {
  const sheet = getCentresSheet(ss);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const centers = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // تجاهل الصفوف الفارغة
    if (!row[1] && !row[2]) continue;

    const rawStatus = row[14] ? String(row[14]).trim() : "";
    let status = "approved";
    if (rawStatus === "pending" || rawStatus === "قيد المراجعة") status = "pending";
    else if (rawStatus === "rejected" || rawStatus === "مرفوض") status = "rejected";

    centers.push({
      id: i,
      created_at: String(row[0] || ""),
      ref_code: String(row[1] || `AECMEC-${i}`),
      name_ar: String(row[2] || ""),
      name_fr: String(row[3] || ""),
      director_ar: String(row[4] || ""),
      director_fr: String(row[5] || ""),
      commune: String(row[6] || ""),
      address_ar: String(row[7] || ""),
      address_fr: String(row[7] || ""),
      phone: String(row[8] || ""),
      gender_type: String(row[9] || "mixte"),
      boys: Number(row[10]) || 0,
      girls: Number(row[11]) || 0,
      total: Number(row[12]) || 0,
      membership: String(row[13] || "Non"),
      status: status
    });
  }
  return centers;
}

function appendOrUpdateCenter(ss, center) {
  const sheet = getCentresSheet(ss);
  const data = sheet.getDataRange().getValues();
  let targetRow = -1;

  // البحث بالرمز المرجعي أو المعرف
  for (let i = 1; i < data.length; i++) {
    if (center.ref_code && String(data[i][1]).trim() === String(center.ref_code).trim()) {
      targetRow = i + 1;
      break;
    }
  }

  const nowFormatted = Utilities.formatDate(new Date(), "GMT", "yyyy/MM/dd HH:mm");
  const rowValues = [
    center.created_at || nowFormatted,
    center.ref_code || `AECMEC ${Math.floor(1000 + Math.random() * 9000)}`,
    center.name_ar || "",
    center.name_fr || "",
    center.director_ar || "",
    center.director_fr || "",
    center.commune || "",
    center.address_ar || center.address_fr || "",
    center.phone || "",
    center.gender_type || "mixte",
    Number(center.boys) || 0,
    Number(center.girls) || 0,
    Number(center.total) || 0,
    center.membership || "Non",
    center.status || "approved"
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, 15).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function updateCenterStatus(ss, centerIdOrRef, newStatus) {
  const sheet = getCentresSheet(ss);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === String(centerIdOrRef).trim() || String(i) === String(centerIdOrRef)) {
      sheet.getRange(i + 1, 15).setValue(newStatus);
      break;
    }
  }
}

function deleteCenter(ss, centerIdOrRef) {
  const sheet = getCentresSheet(ss);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === String(centerIdOrRef).trim() || String(i) === String(centerIdOrRef)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

// ----------------------------------------------------
// دوال إدارة البلديات في ورقة "البلديات" المنفصلة
// ----------------------------------------------------
function readCommunesFromSheet(ss) {
  const sheet = getCommunesSheet(ss);
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
  let sheet = ss.getSheetByName(SHEET_COMMUNES_NAME);
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet(SHEET_COMMUNES_NAME);
  }

  sheet.appendRow(["ID", "اسم البلدية (عربي)", "Nom Commune (FR)"]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 3).setBackground("#1b4332").setFontColor("#ffffff").setFontWeight("bold");

  communes.forEach(c => {
    sheet.appendRow([c.id, c.name_ar, c.name_fr]);
  });
}
