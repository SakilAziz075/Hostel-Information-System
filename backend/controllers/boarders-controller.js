import * as boarderService from '../services/boarder-service.js';

// Controller to add a new boarder
export const addBoarder = async (req, res) => {
    const { student_id, name, email, room_id } = req.body;
    try {
        await boarderService.addBoarder(student_id, name, email, room_id);
        res.status(201).json({ message: 'Boarder added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to update an existing boarder
export const updateBoarder = async (req, res) => {
    const { student_id } = req.params;
    const { name, email, room_id } = req.body;
    try {
        await boarderService.updateBoarder(student_id, name, email, room_id);
        res.status(200).json({ message: 'Boarder updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to remove a boarder
export const removeBoarder = async (req, res) => {
    const { student_id } = req.params;
    try {
        await boarderService.removeBoarder(student_id);
        res.status(200).json({ message: 'Boarder removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to upload boarders from a spreadsheet
export const uploadBoarders = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        await boarderService.uploadBoarders(file.path);
        res.status(200).json({ message: 'Boarders uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
