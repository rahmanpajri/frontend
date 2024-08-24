import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../navbar/Navbar';

const Role = () => {
  const [roles, setRole] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const response = await axios.get('/roles'); 
      setRole(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.patch(`/roles/${currentRole.id}`, currentRole);
      } else {
        await axios.post('/roles', currentRole);
      }
      fetchRole();
      handleClose();
    } catch (error) {
      console.error('Error saving role', error);
    }
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/roles/${id}`);
      fetchRole();
    } catch (error) {
      console.error('Error deleting role', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentRole(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRole({ ...currentRole, [name]: value });
  };

  return (
    <div>
        <Navbar />
        <div className='container mt-3'>
            <h1>Manage Role</h1>
            <Button className='my-2' variant="primary" onClick={() => setShow(true)}>
                Add Role
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Role Name</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role, index) => (
                    <tr key={role.id}>
                    <td>{index + 1}</td>
                    <td>{role.roleName}</td>
                    <td>
                        <Button variant="info" onClick={() => handleEdit(role)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(role.id)}>Delete</Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Edit Role' : 'Add Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Role Name"
                        name="formName"
                        value={currentRole?.roleName || ''}
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

export default Role;
