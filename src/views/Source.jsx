import React, { useState, useEffect } from 'react';
import axios from '../axios'; 
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Navbar from '../components/common/Navbar';

const Source = () => {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSource, setCurrentSource] = useState({
    sourceName: '',
    category: { id: '' },
    allocations: []
  });

  useEffect(() => {
    fetchSources();
    fetchCategories();
    fetchRegions();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('/sources');
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await axios.get('/regions');
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions', error);
    }
  };

  const handleSave = async () => {
    try {
      const allocationsWithIds = await Promise.all(
        currentSource.allocations.map(async (allocation) => {
          if (!allocation.id) {
            const response = await axios.post('/allocations', {
              percentage: Number(allocation.percentage),
              source: { id: Number(currentSource.id) },
              region: { id: Number(allocation.region?.id) },
            });
            const newAllocation = response.data;
            return {
              id: newAllocation.id, // Use ID from response
              percentage: Number(allocation.percentage),
              region: { id: Number(allocation.region?.id) },
            };
          }
          return {
            id: allocation.id,
            percentage: Number(allocation.percentage),
            region: { id: Number(allocation.region?.id) },
          };
        })
      );
  
      const sourceData = {
        id: currentSource.id,
        sourceName: currentSource.sourceName,
        categoryId: Number(currentSource.category.id), 
        allocations: allocationsWithIds
      };
  
      console.log("Source Data to Save:", sourceData);
  
      if (editMode) {
        await axios.put(`/sources/${currentSource.id}`, sourceData);
      } else {
        await axios.post('/sources', sourceData);
      }
      fetchSources();
      handleClose();
    } catch (error) {
      console.error('Error saving source', error);
    }
  };
  
  const handleEdit = (source) => {
    setCurrentSource({
      ...source,
      allocations: source.allocations || []
    });
    setEditMode(true);
    setShow(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this source?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/sources/${id}`);
      fetchSources();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert('Cannot delete source because it is used by one or more roles.');
      } else {
        console.error('Error deleting source', error);
      }
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentSource({
      sourceName: '',
      category: { id: '' },
      allocations: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSource({ ...currentSource, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setCurrentSource({ 
      ...currentSource, 
      category: { id: e.target.value }
    });
  };

  const handleAllocationChange = (index, e) => {
    const { name, value } = e.target;
    const allocations = [...currentSource.allocations];
    allocations[index] = { ...allocations[index], [name]: value };
    setCurrentSource({ ...currentSource, allocations });
  };
  
  const handleRegionChange = (index, e) => {
    const { value } = e.target;
    const allocations = [...currentSource.allocations];
    allocations[index] = { ...allocations[index], region: { id: value } };
    setCurrentSource({ ...currentSource, allocations });
  };  

  const addAllocation = () => {
    setCurrentSource({
      ...currentSource,
      allocations: [...(currentSource.allocations || []), { percentage: '', region: { id: '' } }]
    });
  };

  const removeAllocation = (index) => {
    const allocations = [...currentSource.allocations];
    allocations.splice(index, 1);
    setCurrentSource({ ...currentSource, allocations });
  };

  return (
    <div>
      <Navbar />
      <div className='container mt-3'>
        <h1>Manage Revenue Source</h1>
        <Button className='my-2' variant="primary" onClick={() => {
          setCurrentSource({ sourceName: '', category: { id: '' }, allocations: [] });
          setEditMode(false);
          setShow(true);
        }}>
          Add Source
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Source Name</th>
              <th>Category</th>
              <th>Region</th>
              <th>Allocation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((source, index) => (
              <tr key={source.id}>
                <td>{index + 1}</td>
                <td>{source.sourceName}</td>
                <td>{source.category?.categoryName}</td>
                <td>
                  {source.allocations.map((allocation, idx) => (
                    <div key={idx}>{allocation.region?.regionName}</div>
                  ))}
                </td>
                <td>
                  {source.allocations.map((allocation, idx) => (
                    <div key={idx}>
                      {allocation.percentage}%
                    </div>
                  ))}
                </td>
                <td>
                  <Button className='mx-1' variant="info" onClick={() => handleEdit(source)}>Edit</Button>
                  <Button className='mx-1' variant="danger" onClick={() => handleDelete(source.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Source' : 'Add Source'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSourceName">
                <Form.Label>Source Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Source Name"
                  name="sourceName"
                  value={currentSource.sourceName || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="categoryId"
                  value={currentSource.category.id || ''}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {currentSource.allocations && currentSource.allocations.map((allocation, index) => (
                <div key={index} className="mb-3">
                  <Form.Group controlId={`formPercentage-${index}`}>
                    <Form.Label>Percentage</Form.Label>
                    <Form.Control
                      type="number"
                      name="percentage"
                      value={allocation.percentage || ''}
                      onChange={(e) => handleAllocationChange(index, e)}
                      placeholder="Enter percentage"
                    />
                  </Form.Group>
                  <Form.Group controlId={`formRegion-${index}`}>
                    <Form.Label>Region</Form.Label>
                    <Form.Control
                      as="select"
                      name="regionId"
                      value={allocation.region?.id || ''}
                      onChange={(e) => handleRegionChange(index, e)}
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>{region.regionName}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button className='my-1' variant="danger" onClick={() => removeAllocation(index)}>
                    Remove Allocation
                  </Button>
                </div>
              ))}
              <Button className='my-1' variant="secondary" onClick={addAllocation}>
                Add Allocation
              </Button>
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

export default Source;
