import React, { useState, useEffect } from "react";
import { storage1 } from "../firebase";
import { ref, listAll, getMetadata, getDownloadURL } from "firebase/storage";
import { Progress } from "@/components/ui/progress"


function ShowDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const listRef = ref(storage1, "documents");
      const list = await listAll(listRef);

      const promises = list.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);
        const timestamp = new Date(metadata.timeCreated).toLocaleString();
        return {
          name: itemRef.name,
          time: timestamp,
          downloadURL: downloadURL,
        };
      });

      Promise.all(promises).then((documentList) => {
        setDocuments(documentList);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

  const downloadDocument = (downloadURL, name) => {
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (downloadURL) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = downloadURL;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {loading && <div>Loading...</div>}
      {!loading && (
        <>
          <h2>Documents</h2>
          <ul>
            {documents.map((document, index) => (
              <li key={index} style={{ marginBottom: '20px' }}>
                <div>
                  <p>Name: {document.name}</p>
                  <p>Time: {document.time}</p>
                </div>
                <div>
                  <button onClick={() => downloadDocument(document.downloadURL, document.name)}>
                    Download
                  </button>
                  <button onClick={() => handlePrint(document.downloadURL)}>
                    Print
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ShowDocuments;
