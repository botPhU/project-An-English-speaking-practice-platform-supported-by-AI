
import requests
import json

def test_mentor(mid):
    url = f"http://localhost:5000/api/assignments/mentor/my-learner?mentor_id={mid}"
    try:
        resp = requests.get(url)
        print(f"Mentor {mid}: Status {resp.status_code}")
        try:
            data = resp.json()
            with open(f"api_response_{mid}.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Saved response to api_response_{mid}.json")
            print(f"Learners count: {len(data)}")
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            print(resp.text)
    except Exception as e:
        print(f"Request failed: {e}")

print("Testing ID 2 (mentor1)...")
test_mentor(2)

print("\nTesting ID 3 (admin1)...")
test_mentor(3)
