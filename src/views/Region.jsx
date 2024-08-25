import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Pastikan path ini benar
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Region = () => {
  const [regions, setRegions] = useState([]); // State untuk menyimpan data region
  const [show, setShow] = useState(false); 
  const [editMode, setEditMode] = useState(false); 
  const [currentRegion, setCurrentRegion] = useState({ regionName: '' }); // Menyimpan region yang sedang diedit atau ditambahkan
  const [error, setError] = useState(''); // Menyimpan pesan error

  useEffect(() => {
    fetchRegions(); // Ambil data region ketika komponen pertama kali dirender
  }, []);

  // Fungsi untuk mengambil data region dari server
  const fetchRegions = async () => {
    try {
      const response = await axios.get('/regions'); // Endpoint API untuk mengambil data region
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions', error);
    }
  };

  // Fungsi untuk menyimpan atau memperbarui region
  const handleSave = async () => {
    if (!currentRegion.regionName.trim()) {
      setError('Region name cannot be empty.');
      return;
    }
  
    try {
      setError('');
      const regionData = { regionName: currentRegion.regionName }; // Hanya kirim data yang perlu
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
  

  // Fungsi untuk mengatur state ketika user mengedit region
  const handleEdit = (region) => {
    setCurrentRegion(region);
    setEditMode(true);
    setShow(true);
  };

  // Fungsi untuk menghapus region
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this region?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/regions/${id}`); // Endpoint API untuk menghapus region
      fetchRegions(); // Ambil ulang data region setelah operasi berhasil
    } catch (error) {
      console.error('Error deleting region', error);
      alert('Failed to delete the region. Please try again.');
    }
  };

  // Fungsi untuk menutup modal dan mengatur ulang state
  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentRegion({ regionName: '' });
    setError('');
  };

  // Fungsi untuk menangani perubahan input pada form
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
