const { resolve } = require('path');
const { google } = require('googleapis');
const keyFilenameSheet = resolve(process.cwd(), 'src', 'utils', 'google.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilenameSheet, 
  scopes: ['https://www.googleapis.com/auth/spreadsheets']  
});



 const readSheets = async (rangeCut) => {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1sCGFxocfq6EcR0jDQEmjKQSI2gkeH1pOzMSaA_B_XvE';
  const range = `Info!${rangeCut}`;  // Specifies the range to read.

  try {
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId, range
      });
      const rows = response.data.values;  // Extracts the rows from the response.
      return rows;  // Returns the rows.
  } catch (error) {
      console.error('error sheet', error);  // Logs errors.
  }
}

const writeToSheet = async (values) => {
    const sheets = google.sheets({ version: 'v4', auth });  // Creates a Sheets API client instance.
    const spreadsheetId = '1sCGFxocfq6EcR0jDQEmjKQSI2gkeH1pOzMSaA_B_XvE';  // The ID of the spreadsheet.
    const range = 'Предпочтения!A1';  // The range in the sheet where data will be written.
    const valueInputOption = 'USER_ENTERED';  // How input data should be interpreted.

    const resource = { values };  // The data to be written.

    try {
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId, range, valueInputOption, resource
        })
        return res;  // Returns the response from the Sheets API.
    } catch (error) {
        console.error('error', error);  // Logs errors.
    }
}

module.exports= {
    readSheets,
    writeToSheet
}


