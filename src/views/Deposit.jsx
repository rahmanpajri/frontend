import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Deposit = () => {
  const [deposits, setDeposits] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const [allocation, setAllocation] = useState({});

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/api/deposits'); 
      setDeposits(response.data);
    } catch (error) {
      console.error('Error fetching deposits', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`/api/deposits/${currentDeposit.id}`, currentDeposit);
      } else {
        await axios.post('/api/deposits', currentDeposit);
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
      await axios.delete(`/api/deposits/${id}`);
      fetchDeposits();
    } catch (error) {
      console.error('Error deleting deposit', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentDeposit(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDeposit({ ...currentDeposit, [name]: value });
  };

  const handleAllocationChange = (e) => {
    const { name, value } = e.target;
    setAllocation({ ...allocation, [name]: value });
  };

  return (
    <div>
        <Navbar />
        <div className='container mt-3'>
            <h1>Deposit</h1>
            <Button className='my-2' variant="primary" onClick={() => setShow(true)}>
                Add Deposit
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {deposits.map((deposit) => (
                    <tr key={deposit.id}>
                    <td>{deposit.id}</td>
                    <td>{deposit.amount}</td>
                    <td>{deposit.date}</td>
                    <td>
                        <Button variant="info" onClick={() => handleEdit(deposit)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(deposit.id)}>Delete</Button>
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
                        value={currentDeposit?.amount || ''}
                        onChange={handleInputChange}
                    />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="Enter date"
                        name="date"
                        value={currentDeposit?.date || ''}
                        onChange={handleInputChange}
                    />
                    </Form.Group>
                    <Form.Group controlId="formAllocation">
                    <Form.Label>Allocation</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter allocation percentage"
                        name="allocation"
                        value={allocation?.allocation || ''}
                        onChange={handleAllocationChange}
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

export default Deposit;
