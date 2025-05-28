import React from 'react';
import './WingManagement.css';

const WingManagement = ({
    wings,
    newWing,
    editWingId,
    onChange,
    onSubmit,
    onEdit
}) => {
    return (
        <section className="wing-management">
            <h3>Wing Management</h3>

            <form onSubmit={onSubmit} className="wing-form">
                <input
                    type="text"
                    name="wing_name"
                    value={newWing.wing_name}
                    onChange={onChange}
                    placeholder="Wing Name"
                    required
                />
                <input
                    type="text"
                    name="representative_id"
                    value={newWing.representative_id}
                    onChange={onChange}
                    placeholder="Representative ID"
                />
                <input
                    type="text"
                    name="room_start"
                    value={newWing.room_start}
                    onChange={onChange}
                    placeholder="Start Room"
                    required
                />
                <input
                    type="text"
                    name="room_end"
                    value={newWing.room_end}
                    onChange={onChange}
                    placeholder="End Room"
                    required
                />
                <button type="submit">{editWingId ? 'Update Wing' : 'Add Wing'}</button>
            </form>

            <ul>
                {wings.map(wing => (
                    <li key={wing.wing_id} className="wing-item">
                        <div className="wing-details">
                            <div><strong>Wing:</strong> {wing.wing_name}</div>
                            <div><strong>Rep ID:</strong> {wing.representative_id}</div>
                            <div><strong>Rooms:</strong> {wing.room_start} - {wing.room_end}</div>
                        </div>
                        <button onClick={() => onEdit(wing)} className="edit-button">Edit</button>
                    </li>

                ))}
            </ul>
        </section>
    );
};

export default WingManagement;
