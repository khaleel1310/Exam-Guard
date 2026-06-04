import cv2
import torch
from ultralytics import YOLO

# CONFIG 
CAMERA_INDEX = "http://172.20.10.2:4747/video"
PHONE_CONF = 0.28
CHEAT_CONF = 0.2
PERSIST_FRAMES = 13
#172.18.4.217

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")

phone_model = YOLO('C:\\Users\\Khaleel\\Desktop\\Grad\\examguard-ui\\best_phone_detection.pt')
cheat_model = YOLO('C:\\Users\\Khaleel\\Desktop\\Grad\\examguard-ui\\best.pt')
phone_model.to(device)
cheat_model.to(device)

cap = cv2.VideoCapture(CAMERA_INDEX)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cap.set(cv2.CAP_PROP_FPS, 30)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

print("Camera opened. Press Q to quit.")

phone_boxes = {}
cheat_boxes = {}
frame_idx = 0

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error reading frame.")
        break

    frame = cv2.resize(frame, (854, 480))
    annotated = frame.copy()

    #  PHONE DETECTION 
    phone_boxes = {}
    for result in phone_model(frame, verbose=False):
        for i, box in enumerate(result.boxes):
            if phone_model.names[int(box.cls)] == 'cell-phones' and float(box.conf) > PHONE_CONF:
                x1,y1,x2,y2 = map(int, box.xyxy[0])
                phone_boxes[i] = (x1,y1,x2,y2,float(box.conf),frame_idx)

    #  CHEATING DETECTION 
    cheat_boxes = {}
    for result in cheat_model(frame, verbose=False):
        for i, box in enumerate(result.boxes):
            if float(box.conf) > CHEAT_CONF:
                x1,y1,x2,y2 = map(int, box.xyxy[0])
                cheat_boxes[i] = (x1,y1,x2,y2,float(box.conf),frame_idx)

    #  DRAW PHONE BOXES 
    phone_detected = False
    for x1,y1,x2,y2,conf,last in phone_boxes.values():
        if frame_idx - last < PERSIST_FRAMES:
            cv2.rectangle(annotated, (x1,y1), (x2,y2), (0,0,255), 1)
            cv2.putText(annotated, f'PHONE {conf:.2f}', (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)
            phone_detected = True
    if phone_detected:
        cv2.putText(annotated, '! PHONE DETECTED !', (10,30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)

    #  DRAW CHEAT BOXES
    cheat_detected = False
    for x1,y1,x2,y2,conf,last in cheat_boxes.values():
        if frame_idx - last < PERSIST_FRAMES:
            cv2.rectangle(annotated, (x1,y1), (x2,y2), (255,0,0), 1)
            cv2.putText(annotated, f'CHEATING {conf:.2f}', (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,0,0), 1)
            cheat_detected = True
    if cheat_detected:
        cv2.putText(annotated, '! CHEATING DETECTED !', (10,60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,0,0), 2)

    cv2.imshow('Cheating Detector - Live', annotated)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    frame_idx += 1

cap.release()
cv2.destroyAllWindows()
print("Done!")