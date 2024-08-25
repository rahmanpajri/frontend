import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Deposit = () => {
  const userRole = localStorage.getItem('userRole');
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState({month: '',year: '',amount: '',source: { id: '', sourceName: '' },});
  const [sources, setSources] = useState([]);
  const [userSources, setUserSources] = useState(null);
  const [isRoleAMPPN, setIsRoleAMPPN] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserSources();
      await fetchDeposits();
      await fetchSources();
      checkUserRole();
    };

    fetchData();
}, []);

  useEffect(() => {
    filterDepositsByYear();
  }, [deposits, selectedYear]);

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
      setUserSources(response.data);
    } catch (error) {
      console.error('Error fetching user sources', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/deposits');

      if (userRole === 'AM PPN') {
        setDeposits(response.data);
      } else {
        const filtered = response.data.filter(deposit =>
          deposit.source && deposit.source.id === userSources?.id
        );
        setDeposits(filtered);
      }
    } catch (error) {
      console.error('Error fetching deposits', error);
    }
  };

  const checkUserRole = () => {
    setIsRoleAMPPN(userRole === 'AM PPN');
  };

  const filterDepositsByYear = () => {
    if (selectedYear) {
      const filtered = deposits.filter(deposit => deposit.year === parseInt(selectedYear, 10));
      setFilteredDeposits(filtered);
    } else {
      setFilteredDeposits(deposits);
    }
  };

  const handleSave = async () => {
    try {
      const formattedDeposit = {
        month: parseInt(currentDeposit.month, 10),
        year: parseInt(currentDeposit.year, 10),
        amount: parseFloat(currentDeposit.amount),
        source: currentDeposit.source,
      };

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
    const confirmDelete = window.confirm('Are you sure you want to delete this deposit?');
    if (!confirmDelete) return;

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
    if (name === 'source') {
      setCurrentDeposit({ ...currentDeposit, source: { id: value } });
    } else {
      setCurrentDeposit({ ...currentDeposit, [name]: value });
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };


  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h1>Deposit</h1>
        <Form.Group controlId="formYearFilter">
          <Form.Label>Filter by Year</Form.Label>
          <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
            <option value="">All Years</option>
            {generateYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button className="my-2" variant="primary" onClick={() => setShow(true)}>
          Add Deposit
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Year</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.map((deposit, index) => (
              <tr key={deposit.id}>
                <td>{index + 1}</td>
                <td>{deposit.amount}</td>
                <td>{deposit.month}</td>
                <td>{deposit.year}</td>
                <td>{deposit.source ? deposit.source.sourceName : 'N/A'}</td>
                <td>
                  <Button className='mx-1' variant="info" onClick={() => handleEdit(deposit)}>
                    Edit
                  </Button>
                  <Button className='mx-1' variant="danger" onClick={() => handleDelete(deposit.id)}>
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
                  value={currentDeposit.source.id}
                  onChange={handleInputChange}
                  disabled={editMode}
                >
                  <option value="">Select a source</option>
                  {isRoleAMPPN ? (
                    sources.map(source => (
                      <option key={source.id} value={source.id}>
                        {source.sourceName}
                      </option>
                    ))
                  ) : (
                    userSources && <option value={userSources.id}>{userSources.sourceName}</option>
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
