# Mentor Availability Scheduling

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/mentor/availability/{id}` | GET | Get availability slots |
| `/api/mentor/availability/` | POST | Add slot |
| `/api/mentor/availability/bulk` | POST | Add multiple slots |
| `/api/mentor/availability/{id}` | PUT | Update slot |
| `/api/mentor/availability/{id}` | DELETE | Delete slot |
| `/api/mentor/availability/weekly/{id}` | GET | Get weekly schedule |

## Data Model

```
AvailabilityModel:
- id: int
- mentor_id: int (FK)
- date: Date
- start_time: Time
- end_time: Time
- slot_duration: int (minutes)
- is_recurring: bool
- recurrence_pattern: string
- is_booked: bool
- is_active: bool
- notes: text
```

## Files

| File | Description |
|------|-------------|
| `models/availability_model.py` | Database model |
| `controllers/availability_controller.py` | 6 API endpoints |
| `pages/Mentor/AvailabilitySchedule.tsx` | Weekly calendar UI |
