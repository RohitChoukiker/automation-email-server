// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { Email, EmailCategory } from '../types';
// import { fetchEmails } from '../api';
// import { EmailCard } from './EmailCard';
// import { Loader2, Inbox } from 'lucide-react';

// interface EmailListProps {
//   category: EmailCategory;
// }

// export const EmailList: React.FC<EmailListProps> = ({ category }) => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadEmails = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = await fetchEmails(category);
//         setEmails(data);
//       } catch (err) {
//         setError('Failed to load emails. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadEmails();
//   }, [category]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
//         <p className="text-red-600 font-medium">{error}</p>
//       </div>
//     );
//   }

//   if (emails.length === 0) {
//     return (
//       <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
//         <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//         <p className="text-gray-500 font-medium">No emails found in this category</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       {/* Scrollable list container */}
//       <div className="overflow-auto max-h-[60vh] sm:max-h-[70vh] space-y-4">
//         {emails.map((email) => (
//           <EmailCard
//             key={email.id}
//             email={email}
//             onClick={() => {
//               // navigate to dedicated email page
//               // eslint-disable-next-line no-console
//               console.log('Navigate to email page:', email.id);
//               navigate(`/email/${email.id}`);
//             }}
//             showCategory={category === 'ALL'}
//           />
//         ))}
//       </div>
//       {/* Email detail is opened on a dedicated route */}
//     </div>
//   );
// };


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { Email, EmailCategory } from '../types';
// import { EmailCard } from './2EmailCard';
// import { Loader2, Inbox } from 'lucide-react';

// interface EmailListProps {
//   category: EmailCategory;
// }



// export const EmailList: React.FC<EmailListProps> = ({ category }) => {
//   const [emails, setEmails] = useState<Email[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // ---- LOAD SAMPLE DATA INSTEAD OF API ----
//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (category === 'ALL') {
//         setEmails(SAMPLE_EMAILS);
//       } else {
//         setEmails(SAMPLE_EMAILS.filter((email) => email.category === category));
//       }
//     } catch (err) {
//       setError('Failed to load emails.');
//     } finally {
//       setLoading(false);
//     }
//   }, [category]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12 bg-red-50 rounded-lg border border-red-100">
//         <p className="text-red-600 font-medium">{error}</p>
//       </div>
//     );
//   }

//   if (emails.length === 0) {
//     return (
//       <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
//         <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//         <p className="text-gray-500 font-medium">No emails found in this category</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="overflow-auto max-h-[60vh] sm:max-h-[70vh] space-y-4">
//         {emails.map((email) => (
//           <EmailCard
//             key={email.id}
//             email={email}
//             onClick={() => navigate(`/email/${email.id}`)}
//             showCategory={category === 'ALL'}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
