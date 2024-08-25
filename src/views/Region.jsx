import React, { useState, useEffect } from 'react';
import axios from '../axios'; 
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [show, setShow] = useState(false); 
  const [editMode, setEditMode] = useState(false); 
  const [currentRegion, setCurrentRegion] = useState({ regionName: '' }); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    fetchRegions(); 
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await axios.get('/regions'); 
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions', error);
    }
  };

  const handleSave = async () => {
    if (!currentRegion.regionName.trim()) {
      setError('Region name cannot be empty.');
      return;
    }
  
    try {
      setError('');
      const regionData = { regionName: currentRegion.regionName }; 
      if (editMode) {
        await axios.put(`/regions/${currentRegion.id}`, regionData);
      } else {
        await axios.post('/regions', regionData);
      }
      fetchRegions();
      handleClose();
    } catch (error) {
      console.error('Error saving region', error);
      setError('Failed to save the region. Please try again.');
    }
  };
  

  const handleEdit = (region) => {
    setCurrentRegion(region);
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this region?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/regions/${id}`); 
      fetchRegions();
    } catch (error) {
      console.error('Error deleting region', error);
      alert('Failed to delete the region. Please try again.');
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentRegion({ regionName: '' });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRegion({ ...currentRegion, [name]: value });
  };

  return (
    <div>
      <Navbar />
      <div className='container mt-3'>
        <h1>Manage Regions</h1>
        <Button className='my-2' variant="primary" onClick={() => setShow(true)}>
          Add Region
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Region Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region, index) => (
              <tr key={region.id}>
                <td>{index + 1}</td>
                <td>{region.regionName}</td>
                <td>
                  <Button className='mx-1' variant="info" onClick={() => handleEdit(region)}>Edit</Button>
                  <Button className='mx-1' variant="danger" onClick={() => handleDelete(region.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Region' : 'Add Region'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form>
              <Form.Group controlId="formRegionName">
                <Form.Label>Region Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Region Name"
                  name="regionName"
                  value={currentRegion.regionName}
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

export default Region;
