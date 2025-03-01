const SheetID = "1fAFzSLBIZBtfKQLFszLTLRzCmEfPxE7MVzHK1s_8PU4";

// กำหนด Header สำหรับฟิลด์พื้นฐาน ตามลำดับใหม่ (ไม่รวม dynamic field computers)
const baseHeaders = [
  "employee_id",
  "full_name",
  "template", // สำหรับ placeholder ใน template Google Doc
  "position",
  "department",
  "tel",
  "equipment",
  "number",
  "purpose",
  "location",
  "start_date_time",
  "end_date_time",
  "date_request",
  "time_request"
];

// เปลี่ยนเป็นรองรับ dynamic fields สำหรับ computers 5 คู่
// รองรับ 5 คู่: computer_name_1, asset_number_1, ... , computer_name_5, asset_number_5
const maxComputers = 5;

// Helper: อ่าน Sheet
const getSheet = () => SpreadsheetApp.openById(SheetID).getActiveSheet();

// Helper: ส่ง JSON response
const responseJSON = (data) =>
  ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

// ฟังก์ชัน map payload ให้เป็น Array ตามลำดับ column ที่กำหนด
const mapPayloadToRow = (data) => {
  let row = [];
  // เติมข้อมูลฟิลด์พื้นฐานตาม baseHeaders (index 0 - 13)
  baseHeaders.forEach((header) => {
    row.push(data[header] || "");
  });
  
  // เติมข้อมูล dynamic fields สำหรับ computers (computer_name และ asset_number)
  const computers = Array.isArray(data.computers) ? data.computers : [];
  for (let i = 0; i < maxComputers; i++) {
    if (computers[i]) {
      row.push(computers[i].computer_name || "");
      row.push(computers[i].asset_number || "");
    } else {
      row.push("");
      row.push("");
    }
  }
  
  // เพิ่ม column สำหรับ doc_url (หากยังไม่มีข้อมูล)
  row.push("");
  
  return row;
};

// Controller: สร้าง record ใน Sheet
const createRecord = (data) => {
  const sheet = getSheet();
  const row = mapPayloadToRow(data);
  sheet.appendRow(row);
};

// Controller: อ่านข้อมูลจาก Sheet
const readRecords = () => {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  return data.map((row) => {
    let record = {};
    headers.forEach((header, i) => {
      record[header] = row[i];
    });
    return record;
  });
};

// GET Method
function doGet(_) {
  const data = readRecords();
  return responseJSON(data);
}

// POST Method
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    createRecord(data);
    return responseJSON({ success: true, data: data });
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

// Set custom menu บน Google Sheet
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Autofill google docs');
  menu.addItem('Create new document', 'createNewGoogleDocs');
  menu.addToUi();
}

function createNewGoogleDocs() {
  // ใช้ Google Doc template ที่ต้องการ
  const googleDocTemplate = DriveApp.getFileById('1gUSP9YVFf1Ag2Fn35zsrMy281R_gGwleEfA5jmjlig0');
  const destinationFolder = DriveApp.getFolderById('1SarPOIi0EpQsCUNoHy5STpNL4O3IwkHL');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const rows = sheet.getDataRange().getValues();

  // สมมติว่า header อยู่ในแถวแรก
  // จำนวน column ในแต่ละแถวจะเป็น: baseHeaders (14) + maxComputers * 2 (10) + doc_url (1) = 25
  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i];
    // ถ้า column doc_url (index 24) ว่าง ให้สร้างเอกสารใหม่
    if (!rowData[24]) {
      // สร้างชื่อเอกสาร โดยใช้ employee_id, full_name และ date_request
      const docName = `${rowData[0]} ${rowData[1]} วันที่ร้องขอ ${rowData[12]}`;
      const copy = googleDocTemplate.makeCopy(docName, destinationFolder);
      const doc = DocumentApp.openById(copy.getId());
      const body = doc.getBody();

      // แทนที่ placeholder สำหรับฟิลด์พื้นฐาน (index 0 - 13)
      baseHeaders.forEach((header, index) => {
        body.replaceText(`{{${header}}}`, rowData[index]);
      });
      
      // แทนที่ placeholder สำหรับ dynamic fields (computers)
      // placeholder: {{computer_name_1}}, {{asset_number_1}}, ... , {{computer_name_5}}, {{asset_number_5}}
      for (let j = 0; j < maxComputers; j++) {
        const compIndex = baseHeaders.length + j * 2; // เริ่มที่ index 14, 16, 18, 20, 22
        const assetIndex = compIndex + 1;             // index 15, 17, 19, 21, 23
        body.replaceText(`{{computer_name_${j + 1}}}`, rowData[compIndex]);
        body.replaceText(`{{asset_number_${j + 1}}}`, rowData[assetIndex]);
      }

      doc.saveAndClose();
      const url = doc.getUrl();
      // บันทึก URL ลง column doc_url (คอลัมน์ที่ 3)
      sheet.getRange(i + 1, 3).setValue(url);
    }
  }
}
