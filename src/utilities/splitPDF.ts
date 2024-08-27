/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const splitPdf = async (selectedFile: any) => {
  if (!selectedFile) return;

  const fileReader = new FileReader();

  fileReader.onload = async (event) => {
    const pdfBytes = event.target?.result as ArrayBuffer;

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    // Loop through each page and create a new PDF with that single page
    for (let i = 0; i < totalPages; i++) {
      const singlePagePdf = await PDFDocument.create();
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(copiedPage);

      const pdfDataUri = await singlePagePdf.save();
      const pdfBlob = new Blob([pdfDataUri], { type: "application/pdf" });

      // Save the new PDF file
      saveAs(pdfBlob, `page-${i + 1}.pdf`);
    }
  };

  fileReader.readAsArrayBuffer(selectedFile);
};
