import React, { useEffect, useState } from "react";
import AlertCard from "../components/AlertCard/AlertCard";
import AlertDetails from "../components/AlertDetails/AlertDetails";
 
function LiveTime() {
  const [time, setTime] = useState(new Date());
 
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <p className="text-gray-900 font-bold tabular-nums">{time.toLocaleTimeString()}</p>
  );
}
 
// Dummy data — replace with real WebSocket data later.
// Added seat, camera_id, camera_label, and status to match the full alert contract.
const DUMMY_ALERTS = [
  {
    alert_id: "123",
    violation_type: "Phone usage",
    confidence_rate: 90,
    timestamp: "10:30:54",
    image_url: "/student_1.JPG",
    previous_alerts: 3,
    status: "pending",
  },
  {
    alert_id: "124",
    violation_type: "Cheating paper",
    confidence_rate: 77,
    timestamp: "10:35:22",
    image_url: "/student_2.JPG",
    previous_alerts: 1,
    status: "pending",
  },
  {
    alert_id: "125",
    violation_type: "Turning head",
    confidence_rate: 50,
    timestamp: "10:45:30",
    image_url: "/student_3.JPG",
    previous_alerts: 0,
    status: "pending",
  },
  {
    alert_id: "126",
    violation_type: "Turning head",
    confidence_rate: 33,
    timestamp: "10:15:48",
    image_url: "/student_4.JPG",
    previous_alerts: 0,
    status: "pending",
  },
];
 
export default function Dashboard() {
  const [alerts, setAlerts] = useState(DUMMY_ALERTS);
  // null = nothing selected yet, so AlertDetails shows a placeholder
  const [selectedAlert, setSelectedAlert] = useState(null);
 
  // Helper: update one alert's fields and keep selectedAlert in sync
  function updateAlert(alert_id, changes) {
    setAlerts((prev) =>
      prev.map((a) => (a.alert_id === alert_id ? { ...a, ...changes } : a))
    );
    setSelectedAlert((prev) =>
      prev?.alert_id === alert_id ? { ...prev, ...changes } : prev
    );
  }
 
  function handleAlertClick(alert) {
    setSelectedAlert(alert);
  }
 
  function handleDismiss(alert_id) {
    updateAlert(alert_id, { status: "dismissed" });
  }
 
  function handleFlag(alert_id) {
    updateAlert(alert_id, { status: "flagged" });
  }
 
  function handleEscalate(alert_id) {
    updateAlert(alert_id, { status: "escalated" });
  }
 
  // Derived counts for the stats row
  const pendingCount  = alerts.filter((a) => a.status === "pending").length;
  const flaggedCount  = alerts.filter((a) => a.status === "flagged" || a.status === "escalated").length;
  const reviewedCount = alerts.filter((a) => a.status === "dismissed").length;
 
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
 
      {/* ── Topbar ── */}
      <div className="w-full flex flex-row bg-[#9e1c20] items-center px-4 py-2 shadow-md">
        <img src="/icons/AUM_logo.png" alt="AUM Logo" className="h-20" />
        <p className="pl-4 text-white font-bold text-2xl">AUM ExamGuard Portal</p>
      </div>
 
      <div className="flex flex-col flex-1 px-6 py-4 gap-4">
 
        {/* ── Info bar ── */}
        <div className="w-full bg-white border border-gray-200 rounded-xl flex flex-row justify-between items-center px-6 py-3">
          <div>
            <p className="text-lg font-bold text-gray-900">ExamGuard — Alert Dashboard</p>
            <p className="text-sm text-gray-500">Exam room: BB-S07</p>
          </div>
          <LiveTime />
        </div>
 
        {/* ── Stats row ── */}
        <div className="w-full grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Total alerts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{alerts.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Pending</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Flagged</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">{flaggedCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Dismissed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{reviewedCount}</p>
          </div>
        </div>
 
        {/* ── Main content ── */}
        <div className="w-full flex flex-row gap-6 flex-1">
 
          {/* Alert list */}
          <div className="w-[40%] flex flex-col gap-4 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.alert_id}
                alert={alert}
                isSelected={selectedAlert?.alert_id === alert.alert_id}
                onClick={() => handleAlertClick(alert)}
                // stopPropagation is handled inside AlertCard so card click isn't also fired
                onDismiss={() => handleDismiss(alert.alert_id)}
                onFlag={() => handleFlag(alert.alert_id)}
              />
            ))}
          </div>
 
          {/* Details panel */}
          <div className="w-[60%]">
            <AlertDetails
              alert={selectedAlert}
              onDismiss={() => handleDismiss(selectedAlert.alert_id)}
              onFlag={() => handleFlag(selectedAlert.alert_id)}
              onEscalate={() => handleEscalate(selectedAlert.alert_id)}
            />
          </div>
 
        </div>
      </div>
    </div>
  );
}























// import React, { useEffect, useState } from "react";
// import AlertCard from "../components/AlertCard/AlertCard";
// import AlertDetails from "../components/AlertDetails/AlertDetails";
// function LiveTime() {
//   const [time, setTime] = useState(new Date());
  

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return <p className="text-black font-bold">{time.toLocaleTimeString()}</p>;
// }
// export default function Dashboard() {
//   const [selectedAlert, setSelectedAlert] = useState({
//     alert_id: "123",
//     violation_type: "Phone usage",
//     confidence_rate: 90,
//     timestamp: "10:30:54",
//     image_url: "/student_1.JPG",
//     previous_alerts: 3,
//   });
//   function handleAlertClick(alert) {
//     setSelectedAlert(alert);
//     console.log("Selected Alert:", alert);
//   }
//     const [alerts, setAlerts] = useState([
//     {
//     alert_id: "123",
//     violation_type: "Phone usage",
//     confidence_rate: 90,
//     timestamp: "10:30:54",
//     image_url: "/student_1.JPG",
//     previous_alerts: 3,
//   },
//   {
//     alert_id: "124",
//     violation_type: "Cheating paper",
//     confidence_rate: 77,
//     timestamp: "10:30:54",
//     image_url: "/student_2.JPG",
//     previous_alerts: 1,
//   },
//   {
//     alert_id: "125",
//     violation_type: "Turning head",
//     confidence_rate: 50,
//     timestamp: "10:45:30",
//     image_url: "/student_3.JPG",
//     previous_alerts: 0,
//   },
//   {
//     alert_id: "126",
//     violation_type: "Turning head",
//     confidence_rate: 33,
//     timestamp: "10:15:48",
//     image_url: "/student_4.JPG",
//     previous_alerts: 0,
//   }
//   ])

//   return (
//     <>
//       <div className="flex flex-col items-center">
//         <div className="w-full flex flex-row bg-[#9e1c20] items-center pl-4 pt-2 pb-2">
//           <img src="/icons/AUM_logo.png" alt="AUM Logo" className="h-20"></img>
//           <p className="pl-4 text-white font-bold text-2xl">
//             AUM ExamGuard Portal
//           </p>
//         </div>

//         <div className = "w-[70%]">
//         <div className="w-full flex flex-col items-center bg-amber-800 mt-4">
//           {/*the upper half of the div*/}
//           <div className="items-center bg-mist-300 w-full flex flex-row justify-between pr-4 pl-4 pt-2 pb-2">
//             <div className="flex flex-col items-start ">
//               <p className="text-x1 text-black font-bold">
//                 ExamGuard -- Alert Dashboard
//               </p>
//               <p className="text-1">exam room BB-S07</p>{" "}
//               {/*the API should return the exam room name or number*/}
//             </div>
//             <p>
//               <LiveTime />
//             </p>
//           </div>

//           {/*the lower half of the div*/}
//           <div className="flex flex-row bg-mist-400 w-full">
//             <div className="flex flex-col items-start pl-6 pt-2 pb-2 bg-black w-60">
//               <p className="font-bold text-xl">TOTAL ALERTS</p>
//               <p className="text-red-600 font-bold text-xl">{alerts.length}</p>{" "}
//               {/*here the API should return the total number of alerts so far*/}
//             </div>
//           </div>
//         </div>

//         <div className="w-full bg-red-500 flex flex-row gap-8 p-8">
//         <div className="w-[40%] flex flex-col items-start gap-4">
//           {alerts.map((alert) =>(
//               <AlertCard 
//               key={alert.alert_id} 
//               alert={alert}
//               onClick={() => handleAlertClick(alert)} />            
//           ))}
//         </div>
        
//         <div className="w-[60%]  ">
//           <AlertDetails alert={selectedAlert} />
//           </div>
//         </div>
//       </div>
//       </div>
//     </>
//   );
// }
