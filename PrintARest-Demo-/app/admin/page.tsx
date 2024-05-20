"use client"
import { useEffect, useState } from 'react';
import { Payment, columns, ColumnsWithOpenDocument } from "./columns";
import { DataTable } from "./data-table";
import { firestore } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';

export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentsCollection = collection(firestore, "documents");
        const querySnapshot = await getDocs(paymentsCollection);
  
        const newData: Payment[] = [];
        querySnapshot.forEach((doc) => {
          const paymentData = doc.data();
          // Extract URL from document data
          const url = paymentData.url; // Assuming the URL field is named 'url'
          const payment: Payment = {
            id: doc.id,
            amount: 100, // You can set this value as needed
            status: "pending", // You can set this value as needed
            email: paymentData.userEmail,
            document: paymentData.name,
            url: paymentData.url, // Assign URL to the Payment object
            date:paymentData.uploadDate
          };
          newData.push(payment);
        });
  
        setData(newData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  // Define the openDocument function
  const openDocument = (url: string) => {
    // Implement the logic to open the document URL in React PDF viewer
    window.open(url, '_blank');

  };

  



  return (
    <div className="container mx-auto py-10 ">
      {/* Pass openDocument function as a parameter to the columns array */}
      <DataTable columns={columns(openDocument)} data={data} openDocument={openDocument} />
      
    </div>
  );
  };
