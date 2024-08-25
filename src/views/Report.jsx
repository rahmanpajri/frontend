import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const Report = () => {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const months = [...Array(12).keys()].map(i => i + 1);

  useEffect(() => {
    fetchDeposits();
    fetchYears();
  }, []);

  useEffect(() => {
    filterDeposits();
  }, [selectedMonth, selectedYear, deposits]);

  const fetchYears = async () => {
    try {
      const response = await axios.get('/deposits/years');
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years', error);
    }
  };

  const fetchDeposits = async () => {
    try {
      const response = await axios.get('/deposits/report');
      setDeposits(response.data);
    } catch (error) {
      console.error('Error fetching deposits', error);
    }
  };

  const filterDeposits = () => {
    const filtered = deposits.filter(deposit => {
      return (
        (selectedMonth ? deposit.month === parseInt(selectedMonth) : true) &&
        (selectedYear ? deposit.year === parseInt(selectedYear) : true)
      );
    });
    setFilteredDeposits(filtered);
  };

  const calculateTotalAmount = () => {
    return filteredDeposits.reduce((total, deposit) => total + deposit.amount, 0);
  };

  const exportToExcel = () => {
    const formattedData = filteredDeposits.map(deposit => ({
      No: filteredDeposits.indexOf(deposit) + 1,
      Month: deposit.month,
      Year: deposit.year,
      Source: deposit.source ? deposit.source.sourceName : 'N/A',
      Allocations: deposit.source?.allocations && deposit.source.allocations.length > 0
        ? deposit.source.allocations.map(allocation => 
            `${allocation.region?.regionName ?? 'N/A'}: ${allocation.percentage}%`).join(', ')
        : 'N/A',
        Amount: deposit.amount,
    }));
    const totalAmount = calculateTotalAmount();
    formattedData.push({
        No: '',
        Month: '',
        Year: '',
        Source: '',
        Allocations: '',
        Amount: `Total Amount: ${totalAmount}`
      });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deposits');

    const filename = 'deposits_report.xlsx';
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h1>Report Rekapitulasi Deposit Negara</h1>
        <Form inline className="mb-3">
          <Form.Group controlId="formMonth">
            <Form.Label className="mr-2">Month:</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              <option value="">All</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formYear" className="ml-3">
            <Form.Label className="mr-2">Year:</Form.Label>
            <Form.Control
              as="select"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              <option value="">All</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        <Button className="my-2" variant="primary" onClick={exportToExcel}>
          Export Excel
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>No</th>
              <th>Month</th>
              <th>Year</th>
              <th>Source</th>
              <th>Allocations</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.map((deposit, index) => (
              <tr key={deposit.id}>
                <td>{index + 1}</td>
                <td>{deposit.month}</td>
                <td>{deposit.year}</td>
                <td>{deposit.source ? deposit.source.sourceName : 'N/A'}</td>
                <td>
                  {deposit.source?.allocations && deposit.source.allocations.length > 0
                    ? deposit.source.allocations.map(allocation => 
                        `${allocation.region?.regionName ?? 'N/A'}: ${allocation.percentage}% = ${(deposit.amount * allocation.percentage / 100).toFixed(2)}`).join(', ')
                    : 'N/A'}
                </td>
                <td>{deposit.amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" className="text-right"><strong>Total Amount:</strong></td>
              <td><strong>{calculateTotalAmount().toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Report;
