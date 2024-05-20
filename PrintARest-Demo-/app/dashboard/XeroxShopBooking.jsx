import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const XeroxShopBooking = () => {
  // Define state variables for booked slots
  const [bookedSlots, setBookedSlots] = useState([]);
  const router = useRouter();
  // Define function to handle booking a slot
  const bookSlot = (shopId, slotTime) => {
    router.push(`/upload?shopId=${shopId}&slotTime=${slotTime}`);
    
  };

  // Define array of time slots
  const timeSlots = [
    '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Define array of shop names
  const shopNames = ['Xerox Shop 1', 'Xerox Shop 2', 'Xerox Shop 3', 'Xerox Shop 4', 'Xerox Shop 5'];

  return (
  <div className="container mx-auto p-4 bg-transparent ">
  {/* Repeat the section for each xerox shop */}
  {shopNames.map((shopName, index) => (
    <section key={index} className="mt-8">
      <div className="shop-container">
        <h3 className="text-xl font-semibold text-purple">{shopName}</h3>
        <div className="shop-buttons border border-primary_color1  shadow-md rounded-lg p-4">
          {/* Map over timeSlots array to render available slots for this shop */}
          {timeSlots.map((slot, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md inline-block mr-4 mb-4 border border-gray-300">
              <p className="text-lg font-semibold">{slot}</p>
              {/* Add button to book slot */}
              <button
                onClick={() => bookSlot(index + 1, slot)} // Assuming shopId starts from 1
                className="mt-2 bg-primary_color1 hover:bg-white hover:text-black text-white px-4 py-2 rounded-md border border-neutral-50 focus:outline-none"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  ))}
</div>

  );
};

export default XeroxShopBooking;
