import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Pastikan path import ini benar sesuai dengan struktur proyek Anda
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState({ roleName: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const handleSave = async () => {
    if (!currentRole.roleName.trim()) {
      setError('Role name cannot be empty.');
      return;
    }

    try {
      setError('');
      if (editMode) {
        await axios.put(`/roles/${currentRole.id}`, { roleName: currentRole.roleName });
      } else {
        await axios.post('/roles', { roleName: currentRole.roleName });
      }
      fetchRoles();
      handleClose();
    } catch (error) {
      console.error('Error saving role', error);
      setError('Failed to save the role. Please try again.');
    }
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this role?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role', error);
      alert('Failed to delete the role. Please try again.');
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentRole({ roleName: '' });
    setError('');
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td>{role.roleName}</td>
                <td>
                  <Button className='mx-1' variant="info" onClick={() => handleEdit(role)}>Edit</Button>
                  <Button className='mx-1' variant="danger" onClick={() => handleDelete(role.id)}>Delete</Button>
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
            {error && <div className="alert alert-danger">{error}</div>}
            <Form>
              <Form.Group controlId="formRoleName">
                <Form.Label>Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Role Name"
                  name="roleName"
                  value={currentRole.roleName}
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
