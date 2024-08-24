import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const User = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Fetch roles when component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };

  const handleSave = async () => {
    if (currentUser.username.length !== 10) {
      setError('Username must be exactly 10 digits long.');
      return;
    }

    try {
      setError('');
      const userPayload = {
        username: currentUser.username,
        fullName: currentUser.fullName,
        password: currentUser.password,
        roleId: parseInt(currentUser.role, 10)  // Convert role to integer
      };

      if (editMode) {
        await axios.put(`/users/${currentUser.id}`, userPayload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('/users', userPayload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
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
      await axios.delete(`/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentUser(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleRoleChange = (e) => {
    setCurrentUser({ ...currentUser, role: e.target.value });
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
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.role ? user.role.roleName : 'N/A'}</td>
                <td>
                  <Button className='mx-1' variant="info" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button className='mx-1' variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
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
            {error && <div className="alert alert-danger">{error}</div>}
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
                <Form.Control type="text" placeholder="Enter username" name="username" maxLength={10} value={currentUser?.username || ''} onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" name="password" value={currentUser?.password || ''} onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" name="role" value={currentUser?.role?.id || ''}onChange={handleRoleChange}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.roleName}</option>
                  ))}
                </Form.Control>
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
