const creds = require("./cred-sheet.json");
const { google } = require("googleapis");

async function sheetAuth() {
  const auth = await google.auth.getClient({
    projectId: creds.project_id,
    credentials: {
      type: creds.type,
      private_key: creds.private_key,
      client_email: creds.client_email,
      client_id: creds.client_id,
      token_url: creds.token_uri,
      universe_domain: creds.universe_domain,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

async function getGoogleSheetsData(range) {
  const auth = await sheetAuth();

  const sheets = google.sheets({ version: "v4", auth });

  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: "1LzBjlSZQA-JXSZ6Pqn6bHXiBR7KXgf9uDaDPMJDcEic",
    range: range,
  });

  return data.data.values;
}

async function updateGoogleSheetsData(values) {
    const auth = await sheetAuth();
    const sheets = google.sheets({ version: "v4", auth });
  
    const result = await sheets.spreadsheets.values.update({
        spreadsheetId: "1LzBjlSZQA-JXSZ6Pqn6bHXiBR7KXgf9uDaDPMJDcEic",
        range: "Sheet1!A1:Q",
        valueInputOption: "USER_ENTERED",
        resource: { values: values },
    });
  
    return result.data.values;
}

module.exports = { getGoogleSheetsData, updateGoogleSheetsData }
  
