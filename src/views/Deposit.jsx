import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Deposit = () => {
  const userRole = localStorage.getItem('userRole');
  const [deposits, setDeposits] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState({
    month: '',
    year: '',
    amount: '',
    source: { id: '', sourceName: '' },
  });
  const [sources, setSources] = useState([]); // New state for sources
  const [userSources, setUserSources] = useState(null);
  const [isRoleAMPPN, setIsRoleAMPPN] = useState(false); // New state for role check

  useEffect(() => {
    fetchDeposits();
    fetchSources(); // Fetch sources for dropdown
    fetchUserSources();
    checkUserRole(); // Check if the role is 'AM PPN'
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('/sources');
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources', error);
    }
  };

  const fetchUserSources = async () => {
    try {
      const response = await axios.get(`/roles/${userRole}/source`);
      setUserSources(response.data)
    } catch (error) {
      console.error('Error fetching user sources', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/deposits');
      setDeposits(response.data);
    } catch (error) {
      console.error('Error fetching deposits', error);
    }
  };

  const checkUserRole = () => {
    if (userRole === 'AM PPN') {
      setIsRoleAMPPN(true);
    } else {
      setIsRoleAMPPN(false);
    }
  };

  const handleSave = async () => {
    try {
      const formattedDeposit = {
        month: parseInt(currentDeposit.month, 10),
        year: parseInt(currentDeposit.year, 10),
        amount: parseFloat(currentDeposit.amount),
        source: currentDeposit.source, // Use the selected source
      };

      console.log('Saving deposit with data:', formattedDeposit);

      if (editMode) {
        await axios.put(`/deposits/${currentDeposit.id}`, formattedDeposit);
      } else {
        await axios.post('/deposits', formattedDeposit);
      }

      fetchDeposits();
      handleClose();
    } catch (error) {
      console.error('Error saving deposit', error);
    }
  };

  const handleEdit = (deposit) => {
    setCurrentDeposit(deposit);
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deposits/${id}`);
      fetchDeposits();
    } catch (error) {
      console.error('Error deleting deposit', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentDeposit({
      month: '',
      year: '',
      amount: '',
      source: { id: '', sourceName: '' },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDeposit({ ...currentDeposit, [name]: value });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h1>Deposit</h1>
        <Button className="my-2" variant="primary" onClick={() => setShow(true)}>
          Add Deposit
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Year</th>
              <th></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id}>
                <td>{deposit.id}</td>
                <td>{deposit.amount}</td>
                <td>{deposit.month}</td>
                <td>{deposit.year}</td>
                <td>{deposit.source ? deposit.source.sourceName : 'N/A'}</td>
                <td>
                  <Button variant="info" onClick={() => handleEdit(deposit)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(deposit.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Deposit' : 'Add Deposit'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  name="amount"
                  value={currentDeposit.amount}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formMonth">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  type="number"
                  name="month"
                  min="1"
                  max="12"
                  value={currentDeposit.month}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formYear">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  min="2000"
                  value={currentDeposit.year}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formSource">
                <Form.Label>Source</Form.Label>
                <Form.Control
                  as="select"
                  name="source"
                  value={currentDeposit.source.id} // Display selected source ID
                  onChange={handleInputChange}
                  disabled={editMode} // Conditionally disable based on role
                >
                  <option value="">Select a source</option>
                  {isRoleAMPPN ? (
                    sources.map(source => (
                      <option key={source.id} value={source.id}>
                        {source.sourceName}
                      </option>
                    ))
                  ) : (
                    userSources && (
                      <option key={userSources.id} value={userSources.id}>
                        {userSources.sourceName}
                      </option>
                    )
                  )}
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

export default Deposit;
