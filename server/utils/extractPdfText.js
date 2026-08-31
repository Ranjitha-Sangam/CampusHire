const axios = require("axios");
const pdfParse = require("pdf-parse");

const extractPdfText = async (pdfUrl) => {
  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });

  const pdfData = await pdfParse(response.data);

  return pdfData.text;
};

module.exports = extractPdfText;