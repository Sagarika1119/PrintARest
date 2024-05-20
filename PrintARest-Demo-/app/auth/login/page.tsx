
'use client'

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { auth,firestore } from "../../firebase";
import { use } from "react";
import { toast } from "sonner"

import { collection,doc,getDoc,setDoc} from 'firebase/firestore';

export default function Login() {
    const router = useRouter();
    const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          if (result.user) {
          
            if (result.user.email && (result.user.email.endsWith('gmail.com') || result.user.email.endsWith('paruluniversity.ac.in'))){
                  const uid = result.user.uid;
                  const userRef = doc(collection(firestore, 'users'), uid);
                  try {
                      const docSnap = await getDoc(userRef);
                      if (!docSnap.exists()) {
                          await setDoc(userRef, {
                              email: result.user.email,
                              displayName: result.user.displayName || '',
                              uid: uid
                          });
                      }
                      router.push('/dashboard');
                  } catch (error) {
                      console.error("Error checking user data:", error);
                      toast("Error checking user data");
                  }
              } else {
        
                  await auth.signOut();
                  toast("Please Login With Your College Email Id")
              }
          } else {
              console.error("User information not found in the result.");
          }
      } catch (error) {
          console.error("Error signing in:", error);
          toast("Error signing in");
      }
  };
      return (
        <main className="flex min-h-screen flex-col items-center justify-center w-full flex-1 px-4 text-center sm:px-6 lg:px-8">
  <div className="bg-white rounded-2xl  flex flex-col sm:flex-row w-full max-w-4xl shadow-lg">
    <div className="w-full sm:w-2/5 bg-primary_color1 text-white py-10 px-6 rounded-lg flex flex-col justify-center items-center order-1 sm:order-2">
      <h2 className="text-3xl font-bold mb-2">Hello Everyone!</h2>
      <div className="border-2 w-10 border-white inline-block mb-2"></div>
      <p className="mb-10 text-center">
        Welcome to PrinARest, Let us Print The Rest
      </p>
    </div>
    <div className="w-full sm:w-3/5 p-5 order-2 sm:order-1">
      <div className="text-left font-bold">
        <span className="text-primary_color3">Print</span>Arest
      </div>
      <h2 className="text-3xl font-bold mb-2 pt-8">Login!</h2>
      <div className="border-2 w-10 border-primary_color1 inline-block mb-2"></div>
      <div className="flex flex-col items-center mb-5">
        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-5">
          <FaRegEnvelope className="text-gray-400" />
          <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none flex-1" />
        </div>
      </div>
      <div className="flex flex-col items-center mb-5">
        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center">
          <MdLockOutline className="text-gray-400" />
          <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none flex-1" />
        </div>
      </div>
      {/* Login button */}
      <button className="bg-primary_color1 w-full sm:w-80 rounded-full text-white px-12 py-2 inline-block mb-1">Login</button>

      <div className="py-5">or</div>
      {/* Add a button to trigger Google Sign-In */}
      <button onClick={handleGoogleSignIn} className="bg-primary_color1 w-full sm:w-80 rounded-full text-white px-12 py-2 inline-block">Login With Google</button>
    </div>
  </div>
</main>

      );
  }
