const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const creds = require("../true-truck-386609-be2dd65ab973.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library")


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

function printSheet(sheet) {
  console.log(`Tanggal Pembelian: ${sheet[0]}`);
  console.log(`Wilayah: ${sheet[1]}`);
  console.log(`Pembeli: ${sheet[2]}`);
  console.log(`Produk: ${sheet[3]}`);
  console.log(`Jumlah: ${sheet[4]}`);
  console.log(`Harga: ${sheet[5]}`);
  console.log(`Total Nilai Pembelian: ${sheet[6]}`);
  console.log(`--------------------------------------`);
}

async function getDataSheet() {
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    "1LzBjlSZQA-JXSZ6Pqn6bHXiBR7KXgf9uDaDPMJDcEic",
    serviceAccountAuth
  );

  await doc.loadInfo(); // loads document properties and worksheets
  await doc.updateProperties({ title: "Catatan Penjualan" });

  const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`

  const rows = await sheet.getRows({
    offset: 5,
    limit: 10
  })

  rows.forEach(row => {
    printSheet(row._rawData)
  })
}


app.get("/", async (req, res) => {
  try {
    await getDataSheet();
    res.status(200).send("Main function executed successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error executing main function");
  }
});

app.listen(port, () => {
  console.log("Server Running");
});