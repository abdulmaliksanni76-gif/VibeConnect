// export const formatTimestamp = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
  
//   // Check if it's today
//   const isToday = date.toDateString() === now.toDateString();
  
//   if (isToday) {
//     // Return just the time (e.g., "14:30")
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   } else {
//     // Return the date (e.g., "08/07/2026")
//     return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
//   }
// };

export const formatTimestamp = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};