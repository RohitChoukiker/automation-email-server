// import React from "react";
// import type { Email } from "../types";
// import { Calendar, Tag } from "lucide-react";
// import { clsx } from "clsx";

// interface EmailCardProps {
//   email: Email;
//   onClick?: (email: Email) => void;
//   showCategory?: boolean;
// }

// export const EmailCard: React.FC<EmailCardProps> = ({ email, onClick, showCategory = false }) => {
//   const categoryLabels: Record<string, string> = {
//     URGENT: "Urgent",
//     MEETING: "Meeting",
//     ORDER: "Order",
//     PAYMENT: "Payment",
//     AI_ANSWER: "AI Answer",
//     OTHER: "Other",
//     ALL: "All",
//   };

//   const categoryColors: Record<string, string> = {
//     URGENT: "bg-pink-50 text-red-700 border-red-200",
//     MEETING: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     ORDER: "bg-sky-50 text-sky-700 border-sky-200",
//     PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
//     AI_ANSWER: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
//     OTHER: "bg-gray-50 text-gray-700 border-gray-200",
//     ALL: "bg-gray-50 text-gray-700 border-gray-200",
//   };

//   const category = email.category || "OTHER";
//   const categoryLabel = categoryLabels[category] || "Other";
//   const categoryClass = categoryColors[category] || categoryColors.OTHER;

//   const dateLabel = email.date
//     ? new Date(email.date).toLocaleDateString(undefined, {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "";

//   const sender = email.from ;
//   const isRead = email.isRead;

//   return (
//     <button
//       type="button"
//       onClick={() => onClick?.(email)}
//       className={clsx(
//         "w-full text-left",
//         "rounded-2xl border border-gray-100 bg-white",
//         "hover:bg-gray-50 hover:shadow-sm",
    
//       )}
//     >
//       <div className="flex items-center gap-4 px-4 py-3">
//         {/* Left side: title + meta */}
//         <div className="flex-1 min-w-0">
//           {/* Title (subject) */}
//           <div className="flex items-center gap-2">
//             <p
//               className={clsx(
//                 "truncate text-sm",
//                 !isRead ? "font-semibold text-gray-900" : "font-medium text-gray-800"
//               )}
//             >
//               {email.subject || "(No subject)"}
//             </p>

//             {dateLabel && (
//               <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-400">
//                 <Calendar className="h-3 w-3" />
//                 {dateLabel}
//               </span>
//             )}
//           </div>

//           {/* Subtitle: sender • snippet */}
//           <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
//             <span className="truncate font-medium text-gray-600">{sender}</span>
//             <span className="text-gray-300">•</span>
//             <span className="truncate">
//               {email.snippet }
//             </span>
//           </div>
//         </div>

//         {/* Right side: category pill like in design */}
//         {category && showCategory && (
//           <span
//             className={clsx(
//               "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1",
//               "text-[11px] font-medium",
//               categoryClass
//             )}
//           >
//             <Tag className="h-3 w-3" />
//             {categoryLabel}
//           </span>
//         )}
//       </div>
//     </button>
//   );
// };


// // src/components/EmailCard.tsx
// import React from 'react';
// import type { Email } from '../types';

// interface EmailCardProps {
//   email: Email;
//   onClick: () => void;
//   showCategory?: boolean;
// }

// export const EmailCard: React.FC<EmailCardProps> = ({
//   email,
//   onClick,
//   showCategory = false,
// }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-1"
//     >
//       <div className="flex justify-between items-center gap-3">
//         <div className="font-semibold text-gray-900 truncate">
//           {email.subject}
//         </div>
//         <span className="text-xs text-gray-400 whitespace-nowrap">
//           {email.date}
//         </span>
//       </div>

//       <div className="text-sm text-gray-600 truncate">
//         From: <span className="font-medium">{email.sender}</span>
//       </div>

//       {showCategory && (
//         <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">
//           {email.category}
//         </span>
//       )}

//       <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//         {email.content}
//       </p>
//     </button>
//   );
// };
