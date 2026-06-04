
import React from "react";
import { Clock3, Check, TriangleAlert } from "lucide-react";
 
export default function AlertCard({ alert, isSelected, onClick, onDismiss, onFlag }) {
  const {
    violation_type,
    confidence_rate,
    timestamp,
    image_url,
    previous_alerts,
    status,
  } = alert;
 
  const risk_level =
    confidence_rate >= 90 ? "High" : confidence_rate >= 65 ? "Medium" : "Low";
 
  // An alert is "done" once the supervisor has acted on it
  const isDone = status !== "pending";
 
  // ── Helpers ─────────────────────────────────────────────────────────────────
 
  // Fixed: no longer takes an unused param; reads risk_level from outer scope
  function getBorderColor() {
    if (isDone) return "border-l-[6px] border-gray-300";
    if (risk_level === "High")   return "border-l-[6px] border-red-500";
    if (risk_level === "Medium") return "border-l-[6px] border-yellow-400";
    return "border-l-[6px] border-gray-400";
  }
 
  function getHoverColor() {
    if (isDone) return "hover:bg-gray-50";
    if (risk_level === "High")   return "hover:bg-red-50";
    if (risk_level === "Medium") return "hover:bg-yellow-50";
    return "hover:bg-gray-50";
  }
 
  function getStatusBadge() {
    if (status === "dismissed")
      return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Dismissed</span>;
    if (status === "flagged")
      return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Flagged</span>;
    if (status === "escalated")
      return <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Escalated</span>;
    return null;
  }
 
  // ── Render ───────────────────────────────────────────────────────────────────
 
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer w-full transition-all
        ${getBorderColor()}
        ${getHoverColor()}
        ${isDone ? "opacity-60" : "border border-gray-200"}
        ${isSelected ? "ring-2 ring-[#9e1c20] ring-offset-1" : ""}
      `}
      onClick={onClick}
    >
      {/* Card body */}
      <div className="flex flex-row items-start p-4">
        <img
          src={image_url}
          alt="Alert capture"
          className="w-20 h-20 object-cover rounded-lg mr-4 flex-shrink-0"
        />
 
        <div className="flex flex-col items-start flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 text-sm">{violation_type} detected</p>
            {getStatusBadge()}
          </div>
 
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock3 size={12} />
              <span>{timestamp}</span>
            </div>
            <span
              className={`text-xs font-bold ${
                risk_level === "High"
                  ? "text-red-500"
                  : risk_level === "Medium"
                    ? "text-yellow-500"
                    : "text-gray-400"
              }`}
            >
              {confidence_rate}% confidence
            </span>
          </div>
 
          {previous_alerts > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {previous_alerts} previous alert{previous_alerts > 1 ? "s" : ""}
            </p>
          )}
        </div>
 
        {/* Risk badge */}
        <div className="ml-2 flex-shrink-0">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-md ${
              risk_level === "High"
                ? "bg-red-100 text-red-600"
                : risk_level === "Medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {risk_level}
          </span>
        </div>
      </div>
 
      {/* Confidence bar */}
      <div className="bg-gray-100 h-1.5 mx-4 mb-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            risk_level === "High"
              ? "bg-red-500"
              : risk_level === "Medium"
                ? "bg-yellow-400"
                : "bg-gray-400"
          }`}
          style={{ width: `${confidence_rate}%` }}
        />
      </div>
 
      {/* Action buttons — hidden once alert is done.
          stopPropagation prevents the card's onClick from also firing. */}
      {!isDone && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium w-1/2 h-9 rounded-lg transition-colors cursor-pointer"
          >
            <Check size={14} />
            Dismiss
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFlag(); }}
            className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium w-1/2 h-9 rounded-lg transition-colors cursor-pointer"
          >
            <TriangleAlert size={14} />
            Flag Student
          </button>
        </div>
      )}
    </div>
  );
}





























// import React from "react";
// import { Clock3, Check, TriangleAlert } from "lucide-react";
// export default function AlertCard({ alert, onClick }) {
//   const {
//     alert_id,
//     violation_type,
//     confidence_rate,
//     timestamp,
//     image_url,
//     previous_alerts,
//   } = alert

//   const risk_level =
//     confidence_rate >= 90 ? "High" : confidence_rate >= 65 ? "Medium" : "Low";

//   const getBorderColor = (confidence_rate) => {
//     if (risk_level == "High") {
//       return " border-l-6 border-red-500 hover:bg-red-100 transition-colors";
//     }

//     if (risk_level == "Medium") {
//       return "border-l-6 border-yellow-400 hover:bg-yellow-50 transition-colors";
//     }

//     return "border-l-6 border-gray-400 hover:bg-gray-300 transition-colors";
//   };
//   return (
//     <>
//       <div
//         className={`bg-gray-100 rounded-xl shadow-md overflow-hidden cursor-pointer w-full max-w-xl ${getBorderColor(confidence_rate)}`}
//         onClick={onClick}
//       >
//         {/* Alert Header */}
//         {/**the image */}
//         <div className="flex flex-row items-start p-4">
//           <img
//             src={image_url}
//             alt="Alert Image"
//             className="w-24 h-24 object-cover rounded-md mr-4"
//           />

//           {/**the card info */}
//           <div className="flex flex-col items-start pt-2">
//             <p>{violation_type} detected</p>
//             <div className="flex flex-row items-center gap-4">
//               {/* <p className="text-sm text-gray-500">{timestamp}</p> */}
//               <div className="flex items-center gap-1 text-sm text-gray-500">
//                 <Clock3 size={14} />
//                 <p>{timestamp}</p>
//               </div>
//               <p
//                 className={`text-sm font-bold text-gray-500 ${risk_level === "High" ? "text-red-500" : risk_level === "Medium" ? "text-yellow-500" : " text-gray-500"}`}
//               >
//                 Confidence {confidence_rate}%
//               </p>
//             </div>
//             <p className="text-sm text-gray-500">previous alerts: {previous_alerts}</p>
//           </div>

//           {/**the risk level at the most left */}
//           <div className="ml-auto">
//             <p
//               className={`text-sm font-bold p-1.5 rounded-md ${risk_level === "High" ? "bg-red-200 text-red-500" : risk_level === "Medium" ? "bg-yellow-200 text-yellow-500" : "bg-gray-200 text-gray-500"}`}
//             >
//               {risk_level} Risk
//             </p>
//           </div>
//         </div>

//         {/**The rating Bar */}
//         <div className="bg-gray-200 h-2 w-auto mx-4 mb-4 rounded-lg overflow-hidden">
//           {/* Inner Bar: Uses style attribute for dynamic width, and stronger colors for visibility */}
//           <div
//             className={`h-full rounded-lg transition-all duration-500 ease-out ${
//               risk_level === "High"
//                 ? "bg-red-500"
//                 : risk_level === "Medium"
//                   ? "bg-yellow-400"
//                   : "bg-gray-500"
//             }`}
//             style={{ width: `${confidence_rate}%` }}
//           ></div>
//         </div>

//         {/**The Buttons */}
//         <div className="flex flex-col items-center w-full">
//           <div className="flex flex-row gap-2 items-center w-full mb-4 pl-14 pr-14">
//             <button className="flex flex-row items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium w-1/2 h-10 rounded-lg gap-2 transition-colors cursor-pointer">
//               <Check size={18} />
//               Dismiss
//             </button>
//             <button className="flex flex-row items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium w-1/2 h-10 rounded-lg gap-2 transition-colors cursor-pointer">
//                <TriangleAlert size={18} />
//               Flag Student
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
