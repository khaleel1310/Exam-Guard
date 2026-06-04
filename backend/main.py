# backend/main.py
import cv2, torch, base64, asyncio, uuid
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

device = 'cuda' if torch.cuda.is_available() else 'cpu'
phone_model = YOLO('best_phone_detection.pt').to(device)
cheat_model = YOLO('best.pt').to(device)

PHONE_CONF = 0.28
CHEAT_CONF = 0.2
COOLDOWN_FRAMES = 60  # don't spam alerts — one alert per ~2 seconds

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    cap = cv2.VideoCapture("http://192.168.100.140:4747/video")  # or 0 for webcam
    
    frame_idx = 0
    last_alert_frame = {"phone": -999, "cheat": -999}
    previous_counts = {"phone": 0, "cheat": 0}

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.resize(frame, (854, 480))
            frame_idx += 1

            detections = []

            # Phone detection
            for result in phone_model(frame, verbose=False):
                for box in result.boxes:
                    if phone_model.names[int(box.cls)] == 'cell-phones' and float(box.conf) > PHONE_CONF:
                        if frame_idx - last_alert_frame["phone"] > COOLDOWN_FRAMES:
                            detections.append(("Phone Usage", float(box.conf), "phone"))
                            last_alert_frame["phone"] = frame_idx

            # Cheat detection
            for result in cheat_model(frame, verbose=False):
                for box in result.boxes:
                    if float(box.conf) > CHEAT_CONF:
                        if frame_idx - last_alert_frame["cheat"] > COOLDOWN_FRAMES:
                            detections.append(("Cheating Paper", float(box.conf), "cheat"))
                            last_alert_frame["cheat"] = frame_idx

            for (vtype, conf, key) in detections:
                previous_counts[key] += 1
                _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
                img_b64 = base64.b64encode(buf).decode('utf-8')

                alert = {
                    "alert_id": str(uuid.uuid4())[:8],
                    "violation_type": vtype,
                    "confidence_rate": round(conf * 100),
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "image_url": f"data:image/jpeg;base64,{img_b64}",
                    "previous_alerts": previous_counts[key] - 1,
                    "status": "pending",
                }
                await ws.send_json(alert)

            await asyncio.sleep(0.03)  # ~30fps loop

    except WebSocketDisconnect:
        pass
    finally:
        cap.release()