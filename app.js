const SheetID = "1Y7ED307UPHP6S3GxhcdyEPtZgoVW6KSRahJtfKBVU5k"
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
