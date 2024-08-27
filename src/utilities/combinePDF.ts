/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument } from "pdf-lib";

export const combinePDFs = async (pdfDocs: any) => {
  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();

  for (const pdfDoc of pdfDocs) {
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  // Save the merged PDF to a file
  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
  return blob;
};
