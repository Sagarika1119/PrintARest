import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from "@/components/ui/button"; // Import your Button component or any other UI components you want to use

interface PdfViewerProps {
  url: string;
  onClose: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
          Previous
        </Button>
        <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= (numPages ?? 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};


export default PdfViewer;
