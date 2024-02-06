const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const {
  getGoogleSheetsData,
  updateGoogleSheetsData,
} = require("./libs/googleSheet");
const { transcationProcess } = require("./features/transcactions");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/api/sheet", async (req, res) => {
  try {
    const range = `Sheet1!A:Q`;
    const posts = await getGoogleSheetsData(range);

    const startIndex = posts.findIndex((row) => row[1] == "Abi Ayassi");

    const formattedData = posts.slice(startIndex).map((row) => {
      const student = {
        nama: row[1],
        harga: parseFloat(row[14]),
        jumlahBayar: parseFloat(row[15]),
        total: parseFloat(row[16]),
      };

      // Mengambil status pembayaran (kolom 3 hingga akhir)
      for (let i = 2; i < row.length; i++) {
        student[`minggu${i - 1}`] = row[i] === "TRUE";
      }

      return student;
    });

    formattedData.forEach((data) => {
      // console.log(data);
    });

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/sheet/update", async (req, res) => {
  try {
    const { nama, mingguIndex } = req.body;
    const data = await getGoogleSheetsData("Sheet1!A:Q");

    const rowIndex = data.findIndex((row) => row[1] === nama);

    if (rowIndex === -1) {
      return res
        .status(404)
        .json({ error: "Nama tidak ditemukan dalam data." });
    }

    const columnIndex = mingguIndex + 2;
    data[rowIndex][columnIndex] = true;

    await updateGoogleSheetsData(data);

    res.status(200).json({ message: "Data berhasil diperbarui." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat memperbarui data." });
  }
});

app.post("/api/midtrans/transaction-process", async (req, res) => {
  const {name ,price, order_id, gross_amount} = await req.body
  try {
    const data = await transcationProcess(name, price, order_id, gross_amount)
    res.status(201).json({data})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.listen(port, () => {
  console.log("Server Running");
});
