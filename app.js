const SheetID = "1LK4Uz0gJC57zF2zvnDowkh1ZFPzi6sguKaPweZYxaqk"
const headerList = {
    "employee_id": true,
    "full_name": true,
    "position": true,
    "department": true,
    "tel": true,
    "equipment": true,
    "number": true,
    "purpose": true,
    "location": true,
    "start_date_time": true,
    "end_date_time": true,
    "date_request": true,
    "time_request": true
}


// Helper
const getSheet = () => SpreadsheetApp.openById(SheetID).getActiveSheet();
const responseJSON = (data) => ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);


//Controller
const createRecord = (data) => {
    const sheet = getSheet();
    sheet.appendRow(Object.values(data));
}

const readRecords = () => {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    return data.map(row => {
        const record = {};
        headers.forEach((header, i) => {
            if (headerList[header]) {
                record[header] = row[i];
            }
        });
        return record;
    });
}


// GET Medthod
function doGet(_) {
    const data = readRecords()
    return responseJSON(data)
}

// Post Medthod
function doPost(e) {
    const data = JSON.parse(e.postData.contents)
    createRecord(data)
    return responseJSON(data)
}


//set menu on google sheet
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('Autofill google docs')
    menu.addItem('Create new document', 'createNewGoogleDocs')
    menu.addToUi();
}

function createNewGoogleDocs() {
    /*const googleDocTemplate = DriveApp.getFileById('1Vjldq6qKBwkZdh7F_CueF4M8VSVee1-qjtrl6T2s6nk');*/
    const googleDocTemplate = DriveApp.getFileById('1epSN22x2XyqnT1HSSi8bh_aNdkObXIvUvCK431ThZnc');
    const destinationFolder = DriveApp.getFolderById('1kSZr4sIbo9bY87Z_RR016EYwn47aSsvG');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

    const rows = sheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {

        if (rows[i][13] === '') {

            // Get the row data
            const rowData = rows[i];

            const copy = googleDocTemplate.makeCopy(`${rowData[0]} ${rowData[1]} วันที่ร้องขอ ${rowData[11]}`, destinationFolder);
            const doc = DocumentApp.openById(copy.getId());

            // Access the Google Docs body
            const body = doc.getBody();

            // Replace placeholders in the document with the row data
            // Customize this part based on your specific Google Docs structure
            body.replaceText('{{employee_id}}', rowData[0]);
            body.replaceText('{{full_name}}', rowData[1]);
            body.replaceText('{{position}}', rowData[2]);
            body.replaceText('{{department}}', rowData[3]);
            body.replaceText('{{tel}}', rowData[4]);
            body.replaceText('{{equipment}}', rowData[5]);
            body.replaceText('{{number}}', rowData[6]);
            body.replaceText('{{purpose}}', rowData[7]);
            body.replaceText('{{location}}', rowData[8]);
            body.replaceText('{{start_date_time}}', rowData[9]);
            body.replaceText('{{end_date_time}}', rowData[10]);
            body.replaceText('{{date_request}}', rowData[11]);
            body.replaceText('{{time_request}}', rowData[12]);
            // Add more replaceText lines for additional placeholders

            // Save and close the document
            doc.saveAndClose();
            
            const url = doc.getUrl();
            sheet.getRange(i + 1, 14).setValue(url);
        }
    }
}