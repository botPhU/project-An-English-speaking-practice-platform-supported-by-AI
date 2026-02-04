import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Certificate {
    name: string;
    score: string;
    year: number;
}

export default function MentorApplication() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState<number | null>(null);

    const [form, setForm] = useState({
        // Personal Info
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',

        // Professional
        current_job: '',
        company: '',
        years_experience: 0,

        // Education
        education_level: 'Bachelor',
        major: '',
        university: '',

        // English Qualifications
        english_certificates: [] as Certificate[],
        native_language: 'Vietnamese',
        english_level: 'C1',

        // Teaching
        teaching_experience: '',
        specializations: [] as string[],
        target_students: [] as string[],
        available_hours_per_week: 10,

        // Motivation
        motivation: '',
        teaching_style: ''
    });

    const [newCertificate, setNewCertificate] = useState({ name: '', score: '', year: 2024 });

    const specializations = ['IELTS', 'TOEFL', 'Business English', 'Conversation', 'Grammar', 'Pronunciation', 'Academic English', 'Kids English'];
    const targetStudents = ['Beginners (A1-A2)', 'Intermediate (B1-B2)', 'Advanced (C1-C2)', 'Kids (6-12)', 'Teens (13-18)', 'Adults', 'Business Professionals'];
    const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD', 'Other'];
    const englishLevels = ['B2', 'C1', 'C2', 'Native'];

    const updateForm = (field: string, value: unknown) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const addCertificate = () => {
        if (newCertificate.name && newCertificate.score) {
            updateForm('english_certificates', [...form.english_certificates, newCertificate]);
            setNewCertificate({ name: '', score: '', year: 2024 });
        }
    };

    const removeCertificate = (index: number) => {
        updateForm('english_certificates', form.english_certificates.filter((_, i) => i !== index));
    };

    const toggleSpecialization = (spec: string) => {
        const current = form.specializations;
        if (current.includes(spec)) {
            updateForm('specializations', current.filter(s => s !== spec));
        } else {
            updateForm('specializations', [...current, spec]);
        }
    };

    const toggleTargetStudent = (target: string) => {
        const current = form.target_students;
        if (current.includes(target)) {
            updateForm('target_students', current.filter(t => t !== target));
        } else {
            updateForm('target_students', [...current, target]);
        }
    };

    const handleSubmit = async () => {
        if (!form.full_name || !form.email || !form.motivation) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/mentor-application/submit', form);
            setApplicationId(response.data.application_id);
            setSubmitted(true);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            alert(err.response?.data?.error || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">👤 Thông tin cá nhân</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(e) => updateForm('full_name', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateForm('email', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => updateForm('phone', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="0901234567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={form.date_of_birth}
                                    onChange={(e) => updateForm('date_of_birth', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mt-6">💼 Công việc hiện tại</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                                <input
                                    type="text"
                                    value={form.current_job}
                                    onChange={(e) => updateForm('current_job', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="English Teacher"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Công ty/Tổ chức</label>
                                <input
                                    type="text"
                                    value={form.company}
                                    onChange={(e) => updateForm('company', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="ABC Language Center"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số năm kinh nghiệm</label>
                                <input
                                    type="number"
                                    value={form.years_experience}
                                    onChange={(e) => updateForm('years_experience', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">🎓 Học vấn & Chứng chỉ</h2>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ học vấn</label>
                                <select
                                    value={form.education_level}
                                    onChange={(e) => updateForm('education_level', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    {educationLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
                                <input
                                    type="text"
                                    value={form.major}
                                    onChange={(e) => updateForm('major', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="English Education"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trường</label>
                                <input
                                    type="text"
                                    value={form.university}
                                    onChange={(e) => updateForm('university', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="University of Languages"
                                />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mt-6">📜 Chứng chỉ tiếng Anh</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ tiếng Anh *</label>
                                <select
                                    value={form.english_level}
                                    onChange={(e) => updateForm('english_level', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    {englishLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ mẹ đẻ</label>
                                <input
                                    type="text"
                                    value={form.native_language}
                                    onChange={(e) => updateForm('native_language', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-700 mb-2">Thêm chứng chỉ:</p>
                            <div className="flex gap-2 flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Tên (VD: IELTS)"
                                    value={newCertificate.name}
                                    onChange={(e) => setNewCertificate(c => ({ ...c, name: e.target.value }))}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Điểm (VD: 8.0)"
                                    value={newCertificate.score}
                                    onChange={(e) => setNewCertificate(c => ({ ...c, score: e.target.value }))}
                                    className="w-24 px-3 py-2 border rounded-lg text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Năm"
                                    value={newCertificate.year}
                                    onChange={(e) => setNewCertificate(c => ({ ...c, year: parseInt(e.target.value) }))}
                                    className="w-24 px-3 py-2 border rounded-lg text-sm"
                                />
                                <button
                                    onClick={addCertificate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                >
                                    + Thêm
                                </button>
                            </div>

                            {form.english_certificates.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.english_certificates.map((cert, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                                            {cert.name}: {cert.score} ({cert.year})
                                            <button onClick={() => removeCertificate(i)} className="text-red-500">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">📚 Kinh nghiệm giảng dạy</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm giảng dạy</label>
                            <textarea
                                value={form.teaching_experience}
                                onChange={(e) => updateForm('teaching_experience', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={4}
                                placeholder="Mô tả kinh nghiệm dạy tiếng Anh của bạn..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn (chọn nhiều):</label>
                            <div className="flex flex-wrap gap-2">
                                {specializations.map(spec => (
                                    <button
                                        key={spec}
                                        onClick={() => toggleSpecialization(spec)}
                                        className={`px-4 py-2 rounded-full text-sm transition ${form.specializations.includes(spec)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {spec}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đối tượng học viên:</label>
                            <div className="flex flex-wrap gap-2">
                                {targetStudents.map(target => (
                                    <button
                                        key={target}
                                        onClick={() => toggleTargetStudent(target)}
                                        className={`px-4 py-2 rounded-full text-sm transition ${form.target_students.includes(target)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {target}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số giờ có thể dạy/tuần</label>
                            <input
                                type="number"
                                value={form.available_hours_per_week}
                                onChange={(e) => updateForm('available_hours_per_week', parseInt(e.target.value) || 0)}
                                className="w-32 px-4 py-2 border rounded-lg"
                                min="1"
                                max="40"
                            />
                            <span className="ml-2 text-gray-500">giờ/tuần</span>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">💡 Động lực & Phong cách</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tại sao bạn muốn trở thành Mentor? *</label>
                            <textarea
                                value={form.motivation}
                                onChange={(e) => updateForm('motivation', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={4}
                                placeholder="Chia sẻ động lực và đam mê giảng dạy của bạn..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phong cách giảng dạy của bạn</label>
                            <textarea
                                value={form.teaching_style}
                                onChange={(e) => updateForm('teaching_style', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows={4}
                                placeholder="Mô tả cách bạn tiếp cận và giảng dạy học viên..."
                            />
                        </div>

                        {/* Summary */}
                        <div className="bg-blue-50 rounded-xl p-4 mt-6">
                            <h3 className="font-bold text-blue-800 mb-2">📋 Tóm tắt hồ sơ:</h3>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>👤 {form.full_name || '(Chưa điền tên)'}</p>
                                <p>📧 {form.email || '(Chưa điền email)'}</p>
                                <p>🎓 {form.education_level} - {form.major || 'Chưa điền ngành'}</p>
                                <p>📜 Tiếng Anh: {form.english_level}</p>
                                <p>📚 Chuyên môn: {form.specializations.join(', ') || 'Chưa chọn'}</p>
                                <p>⏰ Thời gian: {form.available_hours_per_week} giờ/tuần</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
                    <span className="text-6xl">✅</span>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4">Đã gửi hồ sơ!</h1>
                    <p className="text-gray-600 mt-2">Mã đơn: #{applicationId}</p>
                    <p className="text-gray-500 mt-4">
                        Chúng tôi sẽ xem xét hồ sơ của bạn và phản hồi trong vòng 3-5 ngày làm việc.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center text-white mb-8">
                    <h1 className="text-3xl font-bold">👨‍🏫 Ứng tuyển Mentor</h1>
                    <p className="opacity-80 mt-2">Chia sẻ kiến thức, truyền cảm hứng</p>
                </div>

                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`w-12 h-2 rounded-full transition ${s <= step ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {renderStep()}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className="px-6 py-2 border rounded-lg disabled:opacity-50"
                        >
                            ← Quay lại
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Tiếp tục →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Đang gửi...' : '✓ Gửi hồ sơ'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
