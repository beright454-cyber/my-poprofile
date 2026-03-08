/**
 * @file Code.gs
 * @description Master Controller for the 18-Project Ecosystem
 * @author Subrata Mondal | AI Web Developer
 */

// 1. INITIAL SETUP
function initialSetup() {
  const prop = PropertiesService.getScriptProperties();
  prop.setProperty('SYSTEM_STATUS', 'OPERATIONAL');
  prop.setProperty('ADMIN_CHAT_ID', 'MASTER_CONSOLE');
  prop.setProperty('VERSION', '2026.8.3');
  console.log("Ecosystem Initialized. All 18 Nodes standing by.");
}

// 2. WEB INTERFACE ROUTER
function doGet(e) {
  // Use a URL parameter to switch between your different projects
  // Example: ?page=vault or ?page=stark or ?page=luxe
  const page = e.parameter.page || 'index'; 
  
  return HtmlService.createTemplateFromFile(page)
      .evaluate()
      .setTitle('SUBRATA MONDAL | ' + page.toUpperCase())
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// 3. DATA INPUT HANDLER
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();
    
    // Log the interaction to your Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');
    sheet.appendRow([timestamp, data.nodeType, data.action, data.details]);
    
    // Send alert to admin
    sendMessage("SYSTEM_ALERT", `Interaction on ${data.nodeType}: ${data.action}`);
    
    return ContentService.createTextOutput(JSON.stringify({status: "SUCCESS", time: timestamp}))
        .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "ERROR", message: err.message}))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// 4. DATA PARSER (From Google Sheets)
function parseSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.toLowerCase()] = row[i];
    });
    return obj;
  });
}

// 5. MESSAGING SYSTEM
function sendMessage(chatId, text) {
  // This simulates a secure transmission log
  const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Security_Logs');
  logSheet.appendRow([new Date(), chatId, text]);
  console.log(`[TRANSMISSION SENDING] >> To: ${chatId} | Msg: ${text}`);
}