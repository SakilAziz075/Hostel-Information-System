// components/BoarderList.jsx
import React from 'react';

const BoarderList = ({ students }) => {
    return (
        <section>
            <h3>Boarders List</h3>
            <ul>
                {students.map(student => (
                    <li key={student.student_id}>
                        {student.name} - {student.email} (Room ID: {student.room_id})
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default BoarderList;
