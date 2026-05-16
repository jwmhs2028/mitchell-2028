const SHEET_NAME = "Unique Viewers";

function doGet(event) {
  event = event || { parameter: {} };
  event.parameter = event.parameter || {};

  const action = event.parameter.action || "";

  if (action === "trackViewer") {
    return trackViewer(event);
  }

  return jsonResponse(event, {
    success: false,
    message: "Unknown action"
  });
}

function setupViewerSheet() {
  getViewerSheet();
}

function testViewerCounter() {
  return trackViewer({
    parameter: {
      action: "trackViewer",
      visitorId: "apps-script-test",
      path: "/test",
      page: "Apps Script Test",
      referrer: "",
      userAgent: "Apps Script editor"
    }
  });
}

function trackViewer(event) {
  const visitorId = cleanValue(event.parameter.visitorId);

  if (!visitorId) {
    return jsonResponse(event, {
      success: false,
      message: "Missing visitorId"
    });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const sheet = getViewerSheet();
    const now = new Date();
    const path = cleanValue(event.parameter.path);
    const page = cleanValue(event.parameter.page);
    const referrer = cleanValue(event.parameter.referrer);
    const userAgent = cleanValue(event.parameter.userAgent);
    const values = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let index = 1; index < values.length; index += 1) {
      if (values[index][1] === visitorId) {
        rowIndex = index + 1;
        break;
      }
    }

    if (rowIndex > -1) {
      const visitCount = Number(sheet.getRange(rowIndex, 5).getValue()) || 0;
      sheet.getRange(rowIndex, 4, 1, 5).setValues([[
        now,
        visitCount + 1,
        path,
        page,
        referrer
      ]]);
      sheet.getRange(rowIndex, 9).setValue(userAgent);
    }
    else {
      sheet.appendRow([
        now,
        visitorId,
        now,
        now,
        1,
        path,
        page,
        referrer,
        userAgent
      ]);
    }

    return jsonResponse(event, {
      success: true,
      uniqueViewers: Math.max(sheet.getLastRow() - 1, 0),
      updatedAt: now.toISOString()
    });
  }
  finally {
    lock.releaseLock();
  }
}

function getViewerSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Created At",
      "Visitor ID",
      "First Seen",
      "Last Seen",
      "Visit Count",
      "Last Path",
      "Last Page",
      "Referrer",
      "User Agent"
    ]);
  }

  return sheet;
}

function cleanValue(value) {
  return String(value || "").slice(0, 500);
}

function jsonResponse(event, payload) {
  const callback = cleanCallback(event.parameter.callback || event.parameter.prefix);

  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(payload) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function cleanCallback(value) {
  const callback = String(value || "");

  if (/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return callback;
  }

  return "";
}
