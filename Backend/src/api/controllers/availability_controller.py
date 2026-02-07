"""
Mentor Availability Controller
API endpoints for mentor scheduling and availability management
"""

from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flasgger import swag_from

availability_bp = Blueprint('availability', __name__, url_prefix='/api/mentor/availability')


@availability_bp.route('/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Get mentor availability slots',
    'parameters': [
        {'name': 'mentor_id', 'in': 'path', 'type': 'integer', 'required': True},
        {'name': 'start_date', 'in': 'query', 'type': 'string', 'description': 'YYYY-MM-DD'},
        {'name': 'end_date', 'in': 'query', 'type': 'string', 'description': 'YYYY-MM-DD'}
    ],
    'responses': {'200': {'description': 'List of availability slots'}}
})
def get_availability(mentor_id):
    """Get mentor's available time slots"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        session = get_db_session()
        query = session.query(AvailabilityModel).filter(
            AvailabilityModel.mentor_id == mentor_id,
            AvailabilityModel.is_active == True
        )
        
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            query = query.filter(AvailabilityModel.date >= start_date.date())
        
        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
            query = query.filter(AvailabilityModel.date <= end_date.date())
        
        slots = query.order_by(AvailabilityModel.date, AvailabilityModel.start_time).all()
        
        return jsonify({
            'mentor_id': mentor_id,
            'slots': [s.to_dict() for s in slots]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@availability_bp.route('/', methods=['POST'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Add availability slot',
    'responses': {'201': {'description': 'Slot created'}}
})
def add_availability():
    """Add a new availability slot"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        data = request.get_json()
        
        if not data.get('mentor_id') or not data.get('date'):
            return jsonify({'error': 'mentor_id and date are required'}), 400
        
        session = get_db_session()
        
        slot = AvailabilityModel(
            mentor_id=data['mentor_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            start_time=datetime.strptime(data.get('start_time', '09:00'), '%H:%M').time(),
            end_time=datetime.strptime(data.get('end_time', '10:00'), '%H:%M').time(),
            slot_duration=data.get('slot_duration', 30),
            is_recurring=data.get('is_recurring', False),
            recurrence_pattern=data.get('recurrence_pattern'),
            notes=data.get('notes'),
            is_active=True
        )
        
        session.add(slot)
        session.commit()
        
        return jsonify(slot.to_dict()), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@availability_bp.route('/bulk', methods=['POST'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Add multiple availability slots',
    'responses': {'201': {'description': 'Slots created'}}
})
def add_bulk_availability():
    """Add multiple availability slots at once"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        data = request.get_json()
        mentor_id = data.get('mentor_id')
        slots_data = data.get('slots', [])
        
        if not mentor_id or not slots_data:
            return jsonify({'error': 'mentor_id and slots are required'}), 400
        
        session = get_db_session()
        created_slots = []
        
        for slot_data in slots_data:
            slot = AvailabilityModel(
                mentor_id=mentor_id,
                date=datetime.strptime(slot_data['date'], '%Y-%m-%d').date(),
                start_time=datetime.strptime(slot_data.get('start_time', '09:00'), '%H:%M').time(),
                end_time=datetime.strptime(slot_data.get('end_time', '10:00'), '%H:%M').time(),
                slot_duration=slot_data.get('slot_duration', 30),
                is_active=True
            )
            session.add(slot)
            created_slots.append(slot)
        
        session.commit()
        
        return jsonify({
            'message': f'Created {len(created_slots)} slots',
            'count': len(created_slots)
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@availability_bp.route('/<int:slot_id>', methods=['PUT'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Update availability slot',
    'responses': {'200': {'description': 'Slot updated'}}
})
def update_availability(slot_id):
    """Update an availability slot"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        data = request.get_json()
        session = get_db_session()
        
        slot = session.query(AvailabilityModel).get(slot_id)
        if not slot:
            return jsonify({'error': 'Slot not found'}), 404
        
        if data.get('date'):
            slot.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if data.get('start_time'):
            slot.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        if data.get('end_time'):
            slot.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        if data.get('slot_duration'):
            slot.slot_duration = data['slot_duration']
        if data.get('notes') is not None:
            slot.notes = data['notes']
        if data.get('is_active') is not None:
            slot.is_active = data['is_active']
        
        session.commit()
        
        return jsonify(slot.to_dict()), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@availability_bp.route('/<int:slot_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Delete availability slot',
    'responses': {'200': {'description': 'Slot deleted'}}
})
def delete_availability(slot_id):
    """Delete an availability slot"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        session = get_db_session()
        
        slot = session.query(AvailabilityModel).get(slot_id)
        if not slot:
            return jsonify({'error': 'Slot not found'}), 404
        
        session.delete(slot)
        session.commit()
        
        return jsonify({'message': 'Slot deleted'}), 200
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()


@availability_bp.route('/weekly/<int:mentor_id>', methods=['GET'])
@swag_from({
    'tags': ['Mentor Availability'],
    'summary': 'Get weekly availability schedule',
    'responses': {'200': {'description': 'Weekly schedule'}}
})
def get_weekly_schedule(mentor_id):
    """Get mentor's weekly availability schedule"""
    try:
        from infrastructure.databases.mssql import get_db_session
        from infrastructure.models.availability_model import AvailabilityModel
        
        # Get current week
        today = datetime.now().date()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        session = get_db_session()
        slots = session.query(AvailabilityModel).filter(
            AvailabilityModel.mentor_id == mentor_id,
            AvailabilityModel.date >= week_start,
            AvailabilityModel.date <= week_end,
            AvailabilityModel.is_active == True
        ).order_by(AvailabilityModel.date, AvailabilityModel.start_time).all()
        
        # Group by day
        weekly_schedule = {}
        for i in range(7):
            day = week_start + timedelta(days=i)
            day_str = day.strftime('%Y-%m-%d')
            weekly_schedule[day_str] = {
                'day_name': ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'][i],
                'slots': []
            }
        
        for slot in slots:
            day_str = slot.date.strftime('%Y-%m-%d')
            if day_str in weekly_schedule:
                weekly_schedule[day_str]['slots'].append(slot.to_dict())
        
        return jsonify({
            'mentor_id': mentor_id,
            'week_start': week_start.strftime('%Y-%m-%d'),
            'week_end': week_end.strftime('%Y-%m-%d'),
            'schedule': weekly_schedule
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
