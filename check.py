import pymysql
conn = pymysql.connect(host='centerbeam.proxy.rlwy.net', port=33386, user='root', password='IIbTiYhuwUWZNEEUSLeKLcUkHbmIiRVD', database='railway')
c = conn.cursor()

# Get ALL confirmed bookings
c.execute('SELECT id, mentor_id, learner_id FROM mentor_bookings WHERE status="confirmed"')
bookings = c.fetchall()
print(f'Confirmed bookings: {len(bookings)}')
for b in bookings:
    print(f'  #{b[0]}: mentor_id={b[1]} -> learner_id={b[2]}')

# Create assignment for EACH booking
c.execute("SET FOREIGN_KEY_CHECKS = 0")
for b in bookings:
    bid, mid, lid = b
    c.execute('SELECT 1 FROM mentor_assignments WHERE mentor_id=%s AND learner_id=%s', (mid, lid))
    if not c.fetchone():
        c.execute('INSERT INTO mentor_assignments (mentor_id, learner_id, assigned_by, status, notes, assigned_at) VALUES (%s, %s, %s, "active", %s, NOW())', (mid, lid, mid, f'Booking #{bid}'))
        print(f'CREATED: mentor_id={mid} -> learner_id={lid}')
    else:
        c.execute('UPDATE mentor_assignments SET status="active" WHERE mentor_id=%s AND learner_id=%s', (mid, lid))
        print(f'UPDATED: mentor_id={mid} -> learner_id={lid}')
        
c.execute("SET FOREIGN_KEY_CHECKS = 1")
conn.commit()

# Final
print('\n=== ALL ACTIVE ASSIGNMENTS ===')
c.execute('SELECT a.mentor_id, a.learner_id, m.full_name, l.full_name FROM mentor_assignments a LEFT JOIN flask_user m ON a.mentor_id=m.id LEFT JOIN flask_user l ON a.learner_id=l.id WHERE a.status="active"')
for r in c.fetchall():
    print(f'  {r[2]} (id={r[0]}) -> {r[3]} (id={r[1]})')

conn.close()
print('\nDone!')
