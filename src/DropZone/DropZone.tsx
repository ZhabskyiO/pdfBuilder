/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from "react-dropzone";
import Paper from "@mui/material/Paper";
import { Grid, Button, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { combinePDFs } from "../utilities/combinePDF";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";

const DropZone = () => {
  const onDrop = useCallback(async (files: File[]) => {
    const pdfDocs = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      })
    );
    setFiles((prev) => [...prev, ...files]);
    setDocs((prev) => [...prev, ...pdfDocs]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    }
  });

  const [files, setFiles] = useState<File[]>([]);
  const [docs, setDocs] = useState<PDFDocument[]>([]);
  const [fleName, setFileName] = useState<string>("");
  console.log(files);

  const displayFiles = files.map((file: File) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));
  console.log(displayFiles);

  const generatePDF = async () => {
    const mergedPdf = await combinePDFs(docs);
    saveAs(mergedPdf, `${fleName}.pdf`);
    clearFiles();
  };

  const clearFiles = () => {
    setFiles([]);
    setDocs([]);
    setFileName("");
  };

  return (
    <Grid>
      <img src="/src/assets/Default_Image_is_a_digital_3D_icon_featuring_a_stylized_docume_1.png" alt="pdf" />
      <Paper
        {...getRootProps()}
        elevation={5}
        sx={{
          padding: "8px 24px",
          marginBottom: "16px"
        }}
      >
        <div>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </Paper>
      <Grid>
        <h4>Files</h4>
        <ol>{displayFiles}</ol>
      </Grid>
      {docs.length > 0 && (
        <Grid margin="24px">
          <TextField
            fullWidth
            id="outlined-basic"
            label="FILE NAME"
            variant="outlined"
            onChange={(e) => setFileName(e.target.value)}
          />
        </Grid>
      )}
      <Grid>
        <Button variant="outlined" onClick={generatePDF} disabled={fleName.length === 0}>
          Generate PDF
        </Button>
        <Button
          variant="outlined"
          onClick={clearFiles}
          sx={{
            marginLeft: "8px"
          }}
        >
          Clear Files
        </Button>
      </Grid>
    </Grid>
  );
};

export default DropZone;
