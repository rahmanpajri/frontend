import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.patch(`/users/${currentUser.id}`, currentUser);
      } else {
        await axios.post('/users', currentUser);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  return (
    <div>
        <Navbar />
        <div className='container mt-3'>
            <h1>Manage User</h1>
            <Button className='my-2' variant="primary" onClick={() => setShow(true)}>
                Add User
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>
                        <Button variant="info" onClick={() => handleEdit(user)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Full Name"
                        name="fullName"
                        value={currentUser?.fullName || ''}
                        onChange={handleInputChange}
                    />
                    </Form.Group>
                    <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={currentUser?.username || ''}
                        onChange={handleInputChange}
                    />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
  );
};

export default User;
