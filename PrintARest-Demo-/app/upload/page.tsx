'use client'
import { useEffect } from "react";
import { ChangeEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { toast } from "sonner"
import { useSearchParams,useRouter } from "next/navigation";
import { auth,firestore,storage1 } from "../firebase";
import { collection,doc,getDoc,setDoc} from 'firebase/firestore';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '../../components/ui/card';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

interface Recipe {
  id: string;
  title: string;
  image: string;
  time?: number;
  description?: string;
  vegan?: boolean;
}

const data: Recipe[] = [
  {
    id: '1',
    title: 'PDF',
    image: '/images/download.png',
    time: 20,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.',
    vegan: false
  },
  {
    id: '2',
    title: 'EXCEL',
    image: '/images/excel.png',
    time: 25,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.',
    vegan: false
  },
  {
    id: '3',
    title: 'WORD',
    image: '/images/word.png',
    time: 30,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.',
    vegan: false
  },
  {
    id: '4',
    title: 'PHOTOS',
    image: '/images/photos.png',
    time: 40,
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti quae veritatis non ad consequatur voluptate fugiat sit obcaecati dicta! Nostrum.'
  }
];

export default function UploadPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [fileupload, setFileUpload] = useState<FileList | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); 
  const searchParams = useSearchParams()
  const shopId = searchParams.get("shopId");
  const slotTime = searchParams.get("slotTime");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileUpload(event.target.files);
    }
  };

  const upload = async () => {
    if (fileupload !== null && shopId && slotTime && userEmail) {
      const promises = Array.from(fileupload).map((file: File) => {
        const fileref = storageRef(storage1, `documents/${file.name}`);
        return uploadBytes(fileref, file)
          .then((snapshot) => {
            return getDownloadURL(snapshot.ref);
          })
          .then((url) => {
            // Get current date and time
            const uploadDate = new Date().toISOString();
            const documentCollection=doc(collection(firestore, 'documents'));
          

            // Store document data in Firestore
            return setDoc(documentCollection,{
              documentId: file.name,
              name: file.name,
              url: url,
              shopId: shopId,
              slotTime: slotTime,
              uploadDate: uploadDate,
              userEmail: userEmail, // Add user email to document data
            });
          })
          .catch((error) => {
            console.error("Error uploading document:", error);
            return null;
          });
      });

      Promise.all(promises)
        .then((urls) => {
          const successfulURLs = urls.filter((url) => url !== null);
          if (successfulURLs.length > 0) {
            toast("Documents uploaded successfully.")

            // alert('Documents uploaded successfully');
            
          } else {
            alert('No documents were uploaded successfully.');
          }
        })
        .catch((error) => {
          console.error('Error uploading documents:', error);
        });
    } else {
      alert('Please select a file');
    }
  };

  return (
    <main className="mt-8 px-4 sm:px-8 lg:px-12">    
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">What do you want to upload?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(recipe => (
          <Card key={recipe.id} className="flex flex-col justify-between border border-primary_color1 bg-white">
            <CardHeader className="flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage src={`${recipe.image}`} alt={recipe.title} />
                <AvatarFallback>
                  {recipe.title.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recipe.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p>{recipe.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between flex-col gap-4">
              <div className="flex gap-4">
                <Button onClick={() => setShowForm(true)} className="bg-primary_color1 text-white px-6 py-2 rounded hover:bg-white hover:text-purple-600 border border-purple-600">Upload document</Button>
              </div>
              {recipe.vegan && <p>Vegan!</p>}
            </CardFooter>
          </Card>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Form</h2>
            <input type="file" accept=".pdf" onChange={handleFileChange} multiple className="file-input file-input-bordered file-input-primary w-full max-w-xs" />
            <div className="mt-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input id="quantity" name="quantity" type="number"  className="mt-1 focus:ring-primary_color1 focus:border-primary_color1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="mt-4">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
              <select id="color" name="color" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary_color1 focus:border-primary_color1 sm:text-sm rounded-md">
                <option value="black_and_white">Color</option>
                <option value="color">CBlack and White</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={upload} className="bg-primary_color1 text-white px-6 py-2 rounded hover:bg-white hover:text-purple-600 border border-purple-600">Upload</Button>
              <Button onClick={() => setShowForm(false)} className="ml-4 bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};


