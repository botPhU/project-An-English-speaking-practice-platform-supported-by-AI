"""
Mentor Content Seed Data
Learning resources and tips for mentors to help learners
"""

# ==================== CONFIDENCE BUILDING ====================
CONFIDENCE_TECHNIQUES = [
    {
        "id": 1,
        "title": "Positive Self-Talk",
        "description": "Thay thế suy nghĩ tiêu cực bằng suy nghĩ tích cực",
        "tips": [
            "Thay 'Tôi không biết từ này' → 'Tôi đang học từ mới'",
            "Thay 'Tôi nói sai' → 'Tôi đang cải thiện'",
            "Chấp nhận sai lầm là một phần của học tập"
        ],
        "difficulty": "beginner"
    },
    {
        "id": 2,
        "title": "Start Small",
        "description": "Bắt đầu từ những câu đơn giản",
        "tips": [
            "Nói 1-2 câu đơn giản trước",
            "Tăng dần độ phức tạp",
            "Sử dụng những từ bạn chắc chắn"
        ],
        "difficulty": "beginner"
    },
    {
        "id": 3,
        "title": "Mirror Practice",
        "description": "Luyện tập trước gương",
        "tips": [
            "Quan sát biểu cảm khuôn mặt",
            "Chú ý ngôn ngữ cơ thể",
            "Làm quen với việc nói trước người khác"
        ],
        "difficulty": "intermediate"
    },
    {
        "id": 4,
        "title": "Shadow Speaking",
        "description": "Lặp lại theo người bản xứ",
        "tips": [
            "Nghe và lặp lại cùng lúc",
            "Bắt chước ngữ điệu",
            "Luyện tập với podcast/video"
        ],
        "difficulty": "intermediate"
    }
]

CONFIDENCE_ACTIVITIES = [
    {
        "id": 1,
        "title": "30-Second Introduction",
        "description": "Tự giới thiệu trong 30 giây",
        "duration": 5,
        "instructions": "Giới thiệu tên, sở thích, mục tiêu học tiếng Anh",
        "level": "A1"
    },
    {
        "id": 2,
        "title": "Daily Diary",
        "description": "Ghi lại một ngày bằng tiếng Anh",
        "duration": 10,
        "instructions": "Kể lại những việc bạn đã làm hôm nay",
        "level": "A2"
    },
    {
        "id": 3,
        "title": "Opinion Sharing",
        "description": "Chia sẻ ý kiến về một chủ đề",
        "duration": 15,
        "instructions": "Nói về quan điểm của bạn về một chủ đề đơn giản",
        "level": "B1"
    }
]

# ==================== EXPRESSION TIPS ====================
EXPRESSION_TIPS = [
    {
        "id": 1,
        "category": "clarity",
        "title": "Speak Slowly",
        "tip": "Nói chậm và rõ ràng hơn khi giao tiếp",
        "example": "Thay vì nói nhanh 'Iwannagostore', hãy nói 'I want to go to the store'",
        "level": "all"
    },
    {
        "id": 2,
        "category": "clarity",
        "title": "Pause Between Ideas",
        "tip": "Dừng lại giữa các ý để người nghe hiểu",
        "example": "I went to the market. [pause] Then I bought some vegetables.",
        "level": "all"
    },
    {
        "id": 3,
        "category": "structure",
        "title": "Use Linking Words",
        "tip": "Sử dụng từ nối để ý tưởng mạch lạc",
        "example": "First... Then... After that... Finally...",
        "level": "A2+"
    },
    {
        "id": 4,
        "category": "structure",
        "title": "Topic Sentence First",
        "tip": "Nói ý chính trước, chi tiết sau",
        "example": "'I love reading books. My favorite is...' thay vì nói lan man",
        "level": "B1+"
    },
    {
        "id": 5,
        "category": "vocabulary",
        "title": "Use Synonyms",
        "tip": "Sử dụng từ đồng nghĩa để phong phú",
        "example": "good → great, excellent, wonderful, amazing",
        "level": "B1+"
    }
]

# ==================== COMMON GRAMMAR ERRORS ====================
COMMON_GRAMMAR_ERRORS = [
    {
        "id": 1,
        "category": "tense",
        "error": "I go there yesterday",
        "correct": "I went there yesterday",
        "explanation": "Dùng quá khứ đơn với 'yesterday'",
        "frequency": "very_common"
    },
    {
        "id": 2,
        "category": "article",
        "error": "I am student",
        "correct": "I am a student",
        "explanation": "Cần mạo từ 'a' trước danh từ đếm được số ít",
        "frequency": "very_common"
    },
    {
        "id": 3,
        "category": "subject-verb",
        "error": "He don't like coffee",
        "correct": "He doesn't like coffee",
        "explanation": "Ngôi thứ ba số ít dùng 'doesn't'",
        "frequency": "common"
    },
    {
        "id": 4,
        "category": "preposition",
        "error": "I'm good in English",
        "correct": "I'm good at English",
        "explanation": "good at + subject/skill",
        "frequency": "common"
    },
    {
        "id": 5,
        "category": "word_order",
        "error": "I very much like pizza",
        "correct": "I like pizza very much",
        "explanation": "'Very much' đặt cuối câu",
        "frequency": "moderate"
    },
    {
        "id": 6,
        "category": "comparative",
        "error": "He is more taller than me",
        "correct": "He is taller than me",
        "explanation": "Không dùng 'more' với tính từ ngắn có đuôi -er",
        "frequency": "moderate"
    }
]

# ==================== PRONUNCIATION ERRORS ====================
COMMON_PRONUNCIATION_ERRORS = [
    {
        "id": 1,
        "word": "comfortable",
        "wrong": "com-for-ta-ble (4 syllables)",
        "correct": "COMF-ter-ble (3 syllables)",
        "ipa": "/ˈkʌmftəbl/",
        "difficulty": "common"
    },
    {
        "id": 2,
        "word": "vegetable",
        "wrong": "ve-ge-ta-ble",
        "correct": "VEJ-tə-bəl (3 syllables)",
        "ipa": "/ˈvedʒtəbl/",
        "difficulty": "common"
    },
    {
        "id": 3,
        "word": "schedule",
        "wrong": "sche-dule",
        "correct": "SKED-jool (US) / SHED-yool (UK)",
        "ipa": "/ˈskedʒuːl/",
        "difficulty": "moderate"
    },
    {
        "id": 4,
        "word": "recipe",
        "wrong": "re-SIPE",
        "correct": "RE-suh-pee",
        "ipa": "/ˈresəpi/",
        "difficulty": "common"
    },
    {
        "id": 5,
        "word": "entrepreneur",
        "wrong": "en-tre-pre-NOOR",
        "correct": "on-truh-pruh-NUR",
        "ipa": "/ˌɑːntrəprəˈnɜːr/",
        "difficulty": "advanced"
    }
]

# ==================== COLLOCATIONS ====================
COLLOCATIONS = [
    {
        "id": 1,
        "type": "verb + noun",
        "wrong": "do a mistake",
        "correct": "make a mistake",
        "example": "I made a mistake in my essay",
        "category": "common"
    },
    {
        "id": 2,
        "type": "verb + noun",
        "wrong": "do homework",
        "correct": "do homework ✓ (đúng!)",
        "example": "I need to do my homework",
        "category": "common"
    },
    {
        "id": 3,
        "type": "verb + noun",
        "wrong": "make exercise",
        "correct": "do exercise / take exercise",
        "example": "I do exercise every morning",
        "category": "common"
    },
    {
        "id": 4,
        "type": "adjective + noun",
        "wrong": "strong rain",
        "correct": "heavy rain",
        "example": "There was heavy rain yesterday",
        "category": "weather"
    },
    {
        "id": 5,
        "type": "adjective + noun",
        "wrong": "fast food (cũng đúng!)",
        "correct": "quick meal",
        "example": "Let's have a quick meal",
        "category": "food"
    }
]

# ==================== IDIOMS ====================
IDIOMS = [
    {
        "id": 1,
        "idiom": "Piece of cake",
        "meaning": "Rất dễ dàng",
        "example": "The test was a piece of cake!",
        "level": "A2",
        "topic": "difficulty"
    },
    {
        "id": 2,
        "idiom": "Break a leg",
        "meaning": "Chúc may mắn",
        "example": "Break a leg at your interview!",
        "level": "A2",
        "topic": "wishes"
    },
    {
        "id": 3,
        "idiom": "Hit the books",
        "meaning": "Bắt đầu học hành chăm chỉ",
        "example": "I need to hit the books for the exam",
        "level": "B1",
        "topic": "study"
    },
    {
        "id": 4,
        "idiom": "Under the weather",
        "meaning": "Không khỏe, ốm nhẹ",
        "example": "I'm feeling a bit under the weather today",
        "level": "B1",
        "topic": "health"
    },
    {
        "id": 5,
        "idiom": "Burning the midnight oil",
        "meaning": "Thức khuya làm việc/học",
        "example": "I was burning the midnight oil to finish the project",
        "level": "B2",
        "topic": "work"
    },
    {
        "id": 6,
        "idiom": "Kill two birds with one stone",
        "meaning": "Một công đôi việc",
        "example": "By biking to work, I kill two birds with one stone - exercise and commute",
        "level": "B2",
        "topic": "efficiency"
    }
]

# ==================== CONVERSATION TOPICS ====================
TOPIC_CATEGORIES = [
    {
        "id": 1,
        "name": "Daily Life",
        "name_vi": "Đời sống hàng ngày",
        "icon": "🏠",
        "topics": [
            "Morning routine",
            "Weekend activities", 
            "Shopping",
            "Cooking and food",
            "Family life"
        ],
        "level": "A1-A2"
    },
    {
        "id": 2,
        "name": "Work & Career",
        "name_vi": "Công việc",
        "icon": "💼",
        "topics": [
            "Job interview",
            "Office conversation",
            "Meeting discussion",
            "Email writing",
            "Career goals"
        ],
        "level": "B1-B2"
    },
    {
        "id": 3,
        "name": "Travel",
        "name_vi": "Du lịch",
        "icon": "✈️",
        "topics": [
            "Booking a hotel",
            "At the airport",
            "Asking for directions",
            "Restaurant ordering",
            "Tourist attractions"
        ],
        "level": "A2-B1"
    },
    {
        "id": 4,
        "name": "Technology",
        "name_vi": "Công nghệ",
        "icon": "💻",
        "topics": [
            "Social media",
            "Smartphones",
            "Online shopping",
            "AI and future",
            "Gaming"
        ],
        "level": "B1-B2"
    },
    {
        "id": 5,
        "name": "Culture & Entertainment",
        "name_vi": "Văn hóa & Giải trí",
        "icon": "🎭",
        "topics": [
            "Movies & TV shows",
            "Music",
            "Books and reading",
            "Sports",
            "Holidays and festivals"
        ],
        "level": "A2-B1"
    }
]

# ==================== REAL LIFE SITUATIONS ====================
SITUATIONS = [
    {
        "id": 1,
        "name": "At the Coffee Shop",
        "name_vi": "Tại quán cà phê",
        "icon": "☕",
        "description": "Gọi đồ uống tại quán cà phê",
        "level": "A1",
        "dialog_example": [
            {"role": "staff", "text": "Hi! What can I get for you?"},
            {"role": "learner", "text": "I'd like a latte, please."},
            {"role": "staff", "text": "What size? Small, medium, or large?"},
            {"role": "learner", "text": "Medium, please."},
            {"role": "staff", "text": "For here or to go?"},
            {"role": "learner", "text": "To go, please. How much is that?"}
        ],
        "key_phrases": [
            "I'd like...",
            "Can I have...?",
            "How much is...?",
            "To go / For here"
        ]
    },
    {
        "id": 2,
        "name": "Doctor's Appointment",
        "name_vi": "Khám bác sĩ",
        "icon": "🏥",
        "description": "Miêu tả triệu chứng cho bác sĩ",
        "level": "A2",
        "dialog_example": [
            {"role": "doctor", "text": "What seems to be the problem?"},
            {"role": "learner", "text": "I have a headache and a sore throat."},
            {"role": "doctor", "text": "How long have you had these symptoms?"},
            {"role": "learner", "text": "For about three days now."},
            {"role": "doctor", "text": "Do you have any allergies?"},
            {"role": "learner", "text": "No, I don't."}
        ],
        "key_phrases": [
            "I have a...",
            "I've been feeling...",
            "It started... ago",
            "I'm allergic to..."
        ]
    },
    {
        "id": 3,
        "name": "Job Interview",
        "name_vi": "Phỏng vấn xin việc",
        "icon": "💼",
        "description": "Trả lời các câu hỏi phỏng vấn",
        "level": "B1",
        "dialog_example": [
            {"role": "interviewer", "text": "Tell me about yourself."},
            {"role": "learner", "text": "I'm a recent graduate with a degree in..."},
            {"role": "interviewer", "text": "What are your strengths?"},
            {"role": "learner", "text": "I'm a quick learner and work well in teams."},
            {"role": "interviewer", "text": "Where do you see yourself in 5 years?"},
            {"role": "learner", "text": "I hope to develop my skills and take on more responsibilities."}
        ],
        "key_phrases": [
            "I'm a... person",
            "My strengths include...",
            "I'm passionate about...",
            "I'm looking forward to..."
        ]
    }
]

# ==================== LEARNING TIPS FOR MENTORS ====================
MENTOR_TIPS = [
    {
        "id": 1,
        "category": "encouragement",
        "tip": "Luôn bắt đầu bằng việc khen ngợi điểm tốt trước khi sửa lỗi",
        "example": "Your pronunciation is getting better! Let's work on..."
    },
    {
        "id": 2,
        "category": "correction",
        "tip": "Sửa lỗi một cách tự nhiên bằng cách lặp lại câu đúng",
        "example": "Learner: 'I goed to store' → Mentor: 'Oh, you went to the store? What did you buy?'"
    },
    {
        "id": 3,
        "category": "engagement",
        "tip": "Đặt câu hỏi mở để học viên nói nhiều hơn",
        "example": "Thay vì 'Do you like coffee?' → 'What's your favorite drink and why?'"
    },
    {
        "id": 4,
        "category": "patience",
        "tip": "Cho học viên thời gian suy nghĩ, không vội vã",
        "example": "Đợi ít nhất 5 giây sau khi đặt câu hỏi trước khi gợi ý"
    },
    {
        "id": 5,
        "category": "personalization",
        "tip": "Sử dụng các chủ đề học viên quan tâm",
        "example": "Nếu học viên thích bóng đá, dùng ví dụ về bóng đá"
    }
]

# ==================== SEED FUNCTION ====================
def seed_mentor_content(db_session):
    """Seed mentor content data into database"""
    # This function can be called to populate database with learning content
    print("Seeding mentor content...")
    # Implementation depends on database models
    return {
        "confidence_techniques": len(CONFIDENCE_TECHNIQUES),
        "confidence_activities": len(CONFIDENCE_ACTIVITIES),
        "expression_tips": len(EXPRESSION_TIPS),
        "grammar_errors": len(COMMON_GRAMMAR_ERRORS),
        "pronunciation_errors": len(COMMON_PRONUNCIATION_ERRORS),
        "collocations": len(COLLOCATIONS),
        "idioms": len(IDIOMS),
        "topic_categories": len(TOPIC_CATEGORIES),
        "situations": len(SITUATIONS),
        "mentor_tips": len(MENTOR_TIPS)
    }
