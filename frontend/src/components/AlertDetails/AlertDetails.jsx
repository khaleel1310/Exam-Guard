
import React, { useState, useEffect } from "react";
import {
  Check,
  TriangleAlert,
  ArrowUpCircle,
  Camera,
  MapPin,
  Clock3,
  ShieldAlert,
} from "lucide-react";
 
export default function AlertDetails({ alert, onDismiss, onFlag, onEscalate }) {
  // Controlled textarea — resets whenever the supervisor selects a different alert
  const [note, setNote] = useState("");
 
  useEffect(() => {
    setNote("");
  }, [alert?.alert_id]);
 
  // ── Empty state ───────────────────────────────────────────────────────────────
  if (!alert) {
    return (
      <div className="w-full min-h-[400px] bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-300">
        <ShieldAlert size={44} strokeWidth={1.2} />
        <p className="text-sm font-medium text-gray-400">
          Select an alert from the list to view its details
        </p>
      </div>
    );
  }
 
  // ── Destructure ───────────────────────────────────────────────────────────────
  const {
    alert_id,
    violation_type,
    confidence_rate,
    timestamp,
    image_url,
    previous_alerts,
    seat,
    camera_label,
    status,
  } = alert;
 
  const isDone = status !== "pending";
  const risk_level =
    confidence_rate >= 90 ? "High" : confidence_rate >= 65 ? "Medium" : "Low";
 
  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
 
      {/* Captured frame */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-cover"
          src={image_url}
          alt="Alert capture"
        />
      </div>
 
      <div className="p-6 flex flex-col gap-5">
 
        {/* Title + status badges */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-gray-900">{violation_type}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">ID: {alert_id}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-md ${
                risk_level === "High"
                  ? "bg-red-100 text-red-600"
                  : risk_level === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {risk_level} Risk
            </span>
 
            {/* Status badge only shows once an action has been taken */}
            {isDone && (
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-md capitalize ${
                  status === "flagged"
                    ? "bg-red-100 text-red-600"
                    : status === "escalated"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {status}
              </span>
            )}
          </div>
        </div>
 
        {/* Detail cards grid */}
        <div className="grid grid-cols-2 gap-3">
 
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
            <Clock3 size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Timestamp</p>
              <p className="text-sm font-semibold text-gray-900 tabular-nums">{timestamp}</p>
            </div>
          </div>
 
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
            <ShieldAlert size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Confidence</p>
              <p
                className={`text-sm font-bold tabular-nums ${
                  risk_level === "High"
                    ? "text-red-500"
                    : risk_level === "Medium"
                      ? "text-yellow-500"
                      : "text-gray-500"
                }`}
              >
                {confidence_rate}%
              </p>
            </div>
          </div>
 
          
 
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3 col-span-2">
            <TriangleAlert size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Previous alerts this session</p>
              <p
                className={`text-sm font-bold ${
                  previous_alerts > 0 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {previous_alerts === 0 ? "None" : previous_alerts}
              </p>
            </div>
          </div>
 
        </div>
 
        {/* Supervisor notes — controlled input, disabled once alert is resolved */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Supervisor Notes</p>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={isDone ? "No notes added." : "Add a note about this incident..."}
            disabled={isDone}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg resize-none
                       focus:outline-none focus:ring-2 focus:ring-[#9e1c20] focus:border-transparent
                       transition-all placeholder:text-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
 
        {/* Action buttons — three distinct actions, hidden once done */}
        {!isDone ? (
          <div className="flex gap-3">
            <button
              onClick={onDismiss}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200
                         text-gray-700 font-medium flex-1 h-10 rounded-lg transition-colors cursor-pointer text-sm"
            >
              <Check size={16} />
              Dismiss
            </button>
            <button
              onClick={onFlag}
              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100
                         text-red-600 font-medium flex-1 h-10 rounded-lg transition-colors cursor-pointer text-sm"
            >
              <TriangleAlert size={16} />
              Flag Student
            </button>
            <button
              onClick={onEscalate}
              className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100
                         text-orange-600 font-medium flex-1 h-10 rounded-lg transition-colors cursor-pointer text-sm"
            >
              <ArrowUpCircle size={16} />
              Escalate
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center text-sm text-gray-400">
            This alert has been <span className="font-medium capitalize">{status}</span>. No further actions available.
          </div>
        )}
 
      </div>
    </div>
  );
}



















// import React from "react";

// export default function AlertDetails({ alert }) {
//   const {
//     alert_id,
//     violation_type,
//     confidence_rate,
//     timestamp,
//     image_url,
//     previous_alerts,
//   } = alert;

//   return (
//     <>
//       <div className="w-full bg-white rounded-xl shadow-md p-6">
//         {/* The Picture */}
//         <div className="aspect-video w-full overflow-hidden rounded-xl">
//           <img className="w-full h-full object-cover" src={image_url} alt="Alert Image" />
//         </div>

//         {/* The Information/Details */}
//         <div className="w-full bg-zinc-900 rounded-xl p-6 shadow-lg">
//           {/* Details */}
//           <div className="grid grid-cols-2 gap-4 mt-6">
//             <div>
//               <span className="text-zinc-400">Violation Type:</span>
//               <p className="font-medium">{violation_type}</p>
//             </div>

//             <div>
//               <span className="text-zinc-400">Confidence:</span>
//               <p className="font-medium">{confidence_rate}%</p>
//             </div>

//             <div>
//               <span className="text-zinc-400">Timestamp:</span>
//               <p className="font-medium">{timestamp}</p>
//             </div>

//             <div>
//               <span className="text-zinc-400">Previous Alerts:</span>
//               <p className="font-medium">{previous_alerts}</p>
//             </div>
//           </div>
//         </div>

//         {/* Supervisor Notes */}
//         <div className="flex flex-col items-center w-full bg-mist-400 mt-8">
//           <p className="">Supervisor Notes</p>
//           <textarea
//             rows={4}
//             className="w-full box-border px-8 bg-amber-50 rounded-[5px] border border-[#ccc] resize-y min-h-[80px] text-[14px] transition-colors duration-200 ease-in-out my-2"
//             type="text"
//           />
//         </div>

//         {/* The Buttons */}
//         <div>
//             <button>Dismiss</button>
//             <button>Esclate</button>
//             <button>Flag</button>
//         </div>
//       </div>
//     </>
//   );
// }

// {
//   /* Alert Header 
    
//  _________________________________________________________________
// |                                                                 |
// |                     EXAM DASHBOARD                              |
// |_________________________________________________________________|

//  ___________________________      ________________________________
// |                           |    |                                |
// |      Alert Card           |    |                                |
// |  ----------------------   |    |         DETAILS CARD           |
// |  Phone Usage              |    |                                |
// |  Confidence: 92%          |    |   _________________________    |
// |  Time: 10:31:04           |    |  |                         |   |
// |___________________________|    |  |     LARGE IMAGE         |   |
//                                  |  |                         |   |
//  ___________________________     |  |_________________________|   |
// |                           |    |                                |
// |      Alert Card           |    |  Seat: B12                    |
// |  ----------------------   |    |  Camera: Cam-03               |
// |  Turning Head             |    |  Violation: Phone Usage       |
// |  Confidence: 77%          |    |  Confidence: 92%              |
// |___________________________|    |  Time: 10:31:04               |
//                                  |  Previous Alerts: 3            |
//  ___________________________     |                                |
// |                           |    | -----------------------------  |
// |      Alert Card           |    | Supervisor Notes               |
// |  ----------------------   |    | [___________________________]  |
// |  Cheat Paper              |    |                                |
// |  Confidence: 65%          |    | -----------------------------  |
// |___________________________|    | Actions                        |
//                                  |                                |
//                                  | [Dismiss] [Flag] [Escalate]    |
//                                  |                                |
//                                  |________________________________|
    
    
    
//                                  */
// }
