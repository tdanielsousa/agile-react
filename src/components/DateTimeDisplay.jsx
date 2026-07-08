import React, { useState, useEffect } from 'react';

export default function DateTimeDisplay() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Formats to "7:56AM" (removes the space before AM/PM)
  const formattedTime = currentDate
    .toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    .replace(/\s+/g, ''); 

  // Formats to "Friday, 20 Dec 2024"
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="date-time">
      {formattedTime}  -  {formattedDate}
    </div>
  );
}
