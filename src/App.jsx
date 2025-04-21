import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL;

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("");

  useEffect(() => {
    axios.get(`${API}/doctors/`).then(res => setDoctors(res.data));
  }, []);

  const handleDoctorSelect = (id) => {
    setSelectedDoctor(id);
    axios.get(`${API}/appointments/${id}`).then(res => setAppointments(res.data));
  };

  const handleCreatePatientAndAppointment = async () => {
    try {
      const patientRes = await axios.post(`${API}/patients/`, {
        full_name: newPatientName,
        birth_date: "1990-01-01",
        phone: newPatientPhone
      });

      const patientId = patientRes.data.id;

      await axios.post(`${API}/appointments/`, {
        patient_id: patientId,
        doctor_id: selectedDoctor,
        appointment_time: newAppointmentTime,
        note: "Запись через сайт"
      });

      alert("Запись успешно создана!");
      handleDoctorSelect(selectedDoctor);
    } catch (err) {
      alert("Ошибка при создании записи");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Система учёта записей</h1>

      <div className="mb-6">
        <label className="block mb-2">Выберите врача:</label>
        <select onChange={(e) => handleDoctorSelect(e.target.value)} className="p-2 border rounded">
          <option value="">-- Врачи --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.full_name} ({doc.specialization})</option>
          ))}
        </select>
      </div>

      {selectedDoctor && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Создать запись</h2>
          <input
            type="text"
            placeholder="ФИО пациента"
            value={newPatientName}
            onChange={(e) => setNewPatientName(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={newPatientPhone}
            onChange={(e) => setNewPatientPhone(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={newAppointmentTime}
            onChange={(e) => setNewAppointmentTime(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleCreatePatientAndAppointment}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Записать пациента
          </button>
        </div>
      )}

      <h2 className="font-semibold mt-6 mb-2">Записи к врачу</h2>
      <ul className="list-disc pl-5">
        {appointments.map((a) => (
          <li key={a.id}>Пациент #{a.patient_id} - {new Date(a.appointment_time).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
