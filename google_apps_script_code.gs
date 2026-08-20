/**
 * =========================================================================
 * منصة حصر مدارس ومراكز تحفيظ القرآن الكريم في مالي - AECMEC MALI
 * Google Apps Script Engine (النسخة المطورة المتوافقة 100% مع كودكم السابق)
 * =========================================================================
 * 
 * المزايا المدمجة مع كودكم السابق:
 * 1. الحفاظ التام على نفس أسماء وترتيب الأعمدة (14 عموداً + عمود حالة التوثيق).
 * 2. الحفاظ على تنسيق أرقام الهواتف (') حتى لا يحذف إكسل الأصفار.
 * 3. الحفاظ على نفس صيغة التاريخ المحببة لديكم (toLocaleString("ar-MA")).
 * 4. إضافة ورقة ثانية مستقلة باسم "البلديات" لحفظ وتعديل وحذف البلديات مركزياً.
 * 5. إضافة إمكانية تعديل وحذف المراكز وتحديث حالة الاعتماد/الرفض سحابياً.
 */

const SHEET_COMMUNES_NAME = "البلديات";

// جلب ورقة المراكز الرئيسية بدقة (حتى لو كان المسؤول يفتح ورقة أخرى)
function getCentresSheet(ss) {
  var sheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("ورقة1") || ss.getSheetByName("المراكز") || ss.getSheets()[0];
  return sheet;
}

// جلب أو إنشاء ورقة البلديات
function getCommunesSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_COMMUNES_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_COMMUNES_NAME);
    sheet.appendRow(["ID", "اسم البلدية (عربي)", "Nom Commune (FR)"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 3).setBackground("#0b5d3f").setFontColor("#ffffff").setFontWeight("bold");

    var defaultCommunes = [
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
    defaultCommunes.forEach(function(c) { sheet.appendRow(c); });
  }
  return sheet;
}

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAllData";

    var sheet = getCentresSheet(ss);
    var rows = sheet.getDataRange().getValues();
    var centers = [];

    if (rows.length > 1) {
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (!row[1] && !row[2]) continue;

        var rawStatus = row[14] ? String(row[14]).trim() : "approved";
        var status = "approved";
        if (rawStatus === "pending" || rawStatus === "قيد المراجعة") status = "pending";
        else if (rawStatus === "rejected" || rawStatus === "مرفوض") status = "rejected";

        centers.push({
          id: i,
          date: String(row[0] || ""),
          created_at: String(row[0] || ""),
          refCode: String(row[1] || ""),
          ref_code: String(row[1] || ""),
          name_ar: String(row[2] || ""),
          name_fr: String(row[3] || ""),
          director_ar: String(row[4] || ""),
          director_fr: String(row[5] || ""),
          commune: String(row[6] || ""),
          address_ar: String(row[7] || ""),
          address_fr: String(row[7] || ""),
          phone: String(row[8] || "").replace(/^'/, ''),
          gender_type: String(row[9] || "mixte"),
          boys: parseInt(row[10]) || 0,
          girls: parseInt(row[11]) || 0,
          total: parseInt(row[12]) || 0,
          membership: String(row[13] || "Non"),
          status: status
        });
      }
    }

    var communes = readCommunes(ss);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      success: true,
      centers: centers,
      communes: communes
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = data.action || "addCenter";

    // 1. إضافة أو تعديل مركز قرآني
    if (action === "addCenter" || action === "saveCenter" || !data.action) {
      var center = data.center || data;
      var sheet = getCentresSheet(ss);

      // إنشاء صف العناوين تلقائياً إذا كان الجدول جديداً
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "التاريخ",
          "رمز التسجيل",
          "اسم المركز (عربي)",
          "Nom du centre (Fr)",
          "المدير (عربي)",
          "Directeur (Fr)",
          "البلدية",
          "العنوان",
          "رقم الهاتف",
          "نوع الطلاب",
          "بنين",
          "بنات",
          "المجموع",
          "عضوية الاتحاد",
          "حالة التوثيق"
        ]);
        sheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#0b5d3f").setFontColor("#ffffff");
      }

      var rows = sheet.getDataRange().getValues();
      var foundRow = -1;
      var targetRef = center.refCode || center.ref_code;

      if (targetRef) {
        for (var i = 1; i < rows.length; i++) {
          if (String(rows[i][1]).trim() === String(targetRef).trim()) {
            foundRow = i + 1;
            break;
          }
        }
      }

      var cleanPhone = String(center.phone || "").replace(/^'/, '');
      var rowData = [
        center.date || center.created_at || new Date().toLocaleString("ar-MA"),
        targetRef || ("AECMEC-" + Math.floor(1000 + Math.random() * 9000)),
        center.name_ar || "",
        center.name_fr || "",
        center.director_ar || "",
        center.director_fr || "",
        center.commune || "",
        center.address_ar || center.address_fr || "",
        "'" + cleanPhone,
        center.gender_type || "mixte",
        parseInt(center.boys) || 0,
        parseInt(center.girls) || 0,
        parseInt(center.total) || 0,
        center.membership || "Non",
        center.status || "approved"
      ];

      if (foundRow > 0) {
        sheet.getRange(foundRow, 1, 1, 15).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. حفظ كامل قائمة البلديات
    if (action === "saveCommunes") {
      var communes = data.communes || [];
      var comSheet = getCommunesSheet(ss);
      comSheet.clear();
      comSheet.appendRow(["ID", "اسم البلدية (عربي)", "Nom Commune (FR)"]);
      comSheet.setFrozenRows(1);
      comSheet.getRange(1, 1, 1, 3).setBackground("#0b5d3f").setFontColor("#ffffff").setFontWeight("bold");

      communes.forEach(function(c) {
        comSheet.appendRow([c.id, c.name_ar, c.name_fr]);
      });

      return ContentService.createTextOutput(JSON.stringify({ status: "success", success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. تحديث حالة المركز (اعتماد / رفض)
    if (action === "updateCenterStatus") {
      var sheet = getCentresSheet(ss);
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][1]).trim() === String(data.id).trim() || String(i) === String(data.id)) {
          sheet.getRange(i + 1, 15).setValue(data.status);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. حذف مركز
    if (action === "deleteCenter") {
      var sheet = getCentresSheet(ss);
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][1]).trim() === String(data.id).trim() || String(i) === String(data.id)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", success: false, message: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", success: false, message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function readCommunes(ss) {
  var sheet = getCommunesSheet(ss);
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var communes = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0] && !row[1]) continue;
    communes.push({
      id: String(row[0]),
      name_ar: String(row[1]),
      name_fr: String(row[2])
    });
  }
  return communes;
}
