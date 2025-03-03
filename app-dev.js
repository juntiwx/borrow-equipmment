// -------------------------
// ปรับค่าได้ตามต้องการ
// -------------------------
const SheetID = "1fAFzSLBIZBtfKQLFszLTLRzCmEfPxE7MVzHK1s_8PU4";

// headerList ใช้กรณีอ่านข้อมูล doGet (เป็น Option ไม่ใส่ก็ได้)
const headerList = {
  "employee_id": true,
  "full_name": true,
  "position": true,
  "department": true,
  "tel": true,
  "equipment": true,
  "purpose": true,
  "location": true,
  "number": true,
  "start_date_time": true,
  "end_date_time": true,
  "date_request": true,
  "time_request": true,
  "computer_name_1": true,
  "asset_number_1": true,
  "computer_name_2": true,
  "asset_number_2": true,
  "computer_name_3": true,
  "asset_number_3": true,
  "computer_name_4": true,
  "asset_number_4": true,
  "computer_name_5": true,
  "asset_number_5": true,
  // doc_url จะใส่หรือไม่ใส่ก็ได้
};

// -------------------------
// Helper
// -------------------------
const getSheet = () => SpreadsheetApp.openById(SheetID).getActiveSheet();

const responseJSON = (data) =>
  ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );

// -------------------------
// Controller
// -------------------------
const createRecord = (data) => {
  const sheet = getSheet();
  // data คาดว่าจะยาว 24 ช่อง (หรือ 1 ช่อง doc_url + 24 ช่องอื่น ๆ)
  sheet.appendRow(data);
};

const readRecords = () => {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues(); // 2D array
  const headers = data.shift(); // ดึงแถวแรกเป็น header

  // สร้าง array ของ records
  return data.map((row) => {
    const record = {};
    headers.forEach((header, i) => {
      if (headerList[header]) {
        record[header] = row[i];
      }
    });
    return record;
  });
};

// -------------------------
// GET Method
// -------------------------
function doGet(e) {
  const data = readRecords();
  return responseJSON(data);
}

// -------------------------
// POST Method
// -------------------------
function doPost(e) {
  // รับข้อมูลเป็น array
  const data = JSON.parse(e.postData.contents);
  createRecord(data);
  return responseJSON({ success: true });
}

// -------------------------
// สร้างเมนูใน Google Sheet
// -------------------------
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Autofill google docs")
    .addItem("Create new document", "createNewGoogleDocs")
    .addToUi();
}

// -------------------------
// สร้างเอกสารจาก Template
// -------------------------
function createNewGoogleDocs() {
  // ไฟล์ Template และโฟลเดอร์ปลายทาง
  const googleDocTemplate = DriveApp.getFileById("1gUSP9YVFf1Ag2Fn35zsrMy281R_gGwleEfA5jmjlig0");
  const destinationFolder = DriveApp.getFolderById("1SarPOIi0EpQsCUNoHy5STpNL4O3IwkHL");

  // ดึงข้อมูลจาก Sheet (รวม header)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const rows = sheet.getDataRange().getValues(); // แถวทั้งหมด

  // rows[0] คือ header
  // ดังนั้นเริ่ม loop จาก i=1 (ข้อมูลจริง)
  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i];

    // ตรวจคอลัมน์สุดท้าย (index 23) ว่าว่างหรือไม่ => ยังไม่เคยสร้าง Doc
    if (rowData[23] === "") {
      // สร้างไฟล์ copy จาก template
      const copy = googleDocTemplate.makeCopy(
        `${rowData[0]} ${rowData[1]} วันที่ร้องขอ ${rowData[11]}`, // ตัวอย่างชื่อไฟล์
        destinationFolder
      );
      const doc = DocumentApp.openById(copy.getId());
      const body = doc.getBody();

      // ------------------------------------
      //  แทนที่ข้อความ placeholder
      //  rowData[] index:
      //    [0]=employee_id
      //    [1]=full_name
      //    [2]=position
      //    [3]=department
      //    [4]=tel
      //    [5]=equipment
      //    [6]=purpose
      //    [7]=location
      //    [8]=number
      //    [9]=start_date_time
      //    [10]=end_date_time
      //    [11]=date_request
      //    [12]=time_request
      //    [13..22]=computer_name / asset_number
      //    [23]=doc_url (ว่างตอนแรก)
      // ------------------------------------
      body.replaceText("{{employee_id}}", rowData[0]);
      body.replaceText("{{full_name}}", rowData[1]);
      body.replaceText("{{position}}", rowData[2]);
      body.replaceText("{{department}}", rowData[3]);
      body.replaceText("{{tel}}", rowData[4]);
      body.replaceText("{{equipment}}", rowData[5]);
      body.replaceText("{{purpose}}", rowData[6]);
      body.replaceText("{{location}}", rowData[7]);
      body.replaceText("{{number}}", rowData[8]);
      body.replaceText("{{start_date_time}}", rowData[9]);
      body.replaceText("{{end_date_time}}", rowData[10]);
      body.replaceText("{{date_request}}", rowData[11]);
      body.replaceText("{{time_request}}", rowData[12]);

      // คอมพิวเตอร์ / Asset 1-5
      body.replaceText("{{computer_name_1}}", rowData[13]);
      body.replaceText("{{asset_number_1}}", rowData[14]);
      body.replaceText("{{computer_name_2}}", rowData[15]);
      body.replaceText("{{asset_number_2}}", rowData[16]);
      body.replaceText("{{computer_name_3}}", rowData[17]);
      body.replaceText("{{asset_number_3}}", rowData[18]);
      body.replaceText("{{computer_name_4}}", rowData[19]);
      body.replaceText("{{asset_number_4}}", rowData[20]);
      body.replaceText("{{computer_name_5}}", rowData[21]);
      body.replaceText("{{asset_number_5}}", rowData[22]);

      // บันทึกเอกสาร
      doc.saveAndClose();

      // นำ URL ของ doc มาใส่ใน column 24 (index 23)
      const url = doc.getUrl();
      sheet.getRange(i + 1, 24).setValue(url);
    }
  }
}
