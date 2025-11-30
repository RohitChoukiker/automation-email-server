// // EmailPage.tsx

// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchEmailById, sendEmail } from "../api";
// import type { Email } from "../types";
// import { X, Send, Loader2, Sparkles } from "lucide-react";
// import { Navbar } from "./Navbar";
// import { useAuth } from "../context/AuthProvider";

// const EmailPage: React.FC = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);
//   const [email, setEmail] = React.useState<Partial<Email & any> | null>(null);
//   const [replyDraft, setReplyDraft] = React.useState("");
//   const [sending, setSending] = React.useState(false);
//   const [sendError, setSendError] = React.useState<string | null>(null);
//   const [sendSuccess, setSendSuccess] = React.useState<string | null>(null);

//   // SAMPLE + API FETCH
//   React.useEffect(() => {
//     if (!id) return;

//     const sample = {
//       _id: id,
//       subject: "Test Rohit",
//       from: "Rohit Choukiker rohit@stratsync.ai",
//       body: "Test Rohit is going on",
//       summary: "This is a test email from Rohit.",
//       replyDraft: "Hi Rohit,\n\nTest received. Thanks!",
//     };

//     setEmail(sample);
//     setReplyDraft(sample.replyDraft || "");

//     setLoading(true);
//     fetchEmailById(id)
//       .then((data) => {
//         setEmail(data);
//         setReplyDraft(data?.replyDraft || "");
//       })
//       .catch(() => setError("Failed to load full email."))
//       .finally(() => setLoading(false));
//   }, [id]);

//   // 🔄 REPLY SEND HANDLER
//   const handleSend = async () => {
//     if (!id) return;
//     setSending(true);
//     setSendError(null);
//     setSendSuccess(null);

//     try {
//       await sendEmail(id, replyDraft);
//       setSendSuccess("Reply sent successfully!");
//     } catch (err: any) {
//       setSendError(err?.message || "Failed to send.");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] text-slate-900">
//       <Navbar
//         isAuthenticated={isAuthenticated}
//         onGetStarted={() => navigate(isAuthenticated ? "/dashboard" : "/")}
        
//         scrollToSection={() => {}}
//         showSections={false}
//       />

//       <div className="mx-auto max-w-76xl px-4 py-8">
      

//         {/* Email Card */}
//         <div className="bg-white/90 backdrop-blur-lg shadow-xl border rounded-2xl p-6">
//           {loading && <div className="py-8 text-center text-gray-600"><Loader2 className="w-5 h-5 animate-spin inline-block mr-2" /> Loading email...</div>}
//           {error && <div className="text-red-600 py-2">{error}</div>}

//           {email ? (
//             <>
//               {/* Header */}
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex-1 min-w-0">
//                   <h1 className="text-2xl font-semibold text-gray-900 truncate">{email.subject || "(No subject)"}</h1>
//                   <p className="mt-1 text-sm text-gray-600"><strong>From:</strong> {email.from || "Unknown"}</p>
//                 </div>
               
//               </div>

//               {/* EMAIL BODY */}
//               <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed bg-slate-50 rounded-lg p-4 border">
//                 {email.body || email.snippet}
//               </div>

//               {/* AI SUMMARY */}
//               {email.summary && (
//                 <div className="mt-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
//                   <div className="flex items-center gap-2 text-purple-700 font-semibold">
//                     <Sparkles className="w-4 h-4" /> AI Summary
//                   </div>
//                   <div className="text-gray-700 text-sm mt-1">{email.summary}</div>
//                 </div>
//               )}

//               {/* REPLY */}
//               <div className="mt-6 border-t pt-6">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Reply</label>
//                 <textarea
//                   value={replyDraft}
//                   onChange={(e) => setReplyDraft(e.target.value)}
//                   placeholder="Write your reply here..."
//                   className="w-full min-h-[130px] rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 {/* SEND + CLEAR BUTTONS */}
//                 <div className="mt-3 flex gap-3">
//                   <button
//                     onClick={handleSend}
//                     disabled={sending}
//                     className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm shadow-sm hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
//                     {sending ? "Sending..." : "Send Reply"}
//                   </button>

//                   <button
//                     onClick={() => setReplyDraft("")}
//                     className="inline-flex items-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
//                   >
//                     Clear
//                   </button>
//                 </div>

//                 {/* STATUS */}
//                 {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
//                 {sendSuccess && <p className="mt-2 text-sm text-green-600">{sendSuccess}</p>}
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-8">No email found.</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailPage;
