import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState({
    months: [],
    totals: []
  });
  const [years, setYears] = useState([]); 

  useEffect(() => {
    fetchYears(); 
    fetchData(year);
  }, []);

  useEffect(() => {
    fetchData(year); 
  }, [year]);

  const fetchYears = async () => {
    try {
      const response = await axios.get('/deposits/years');
      setYears(response.data);
    } catch (error) {
      console.error('Error fetching years', error);
    }
  };

  const fetchData = async (selectedYear) => {
    try {
      const response = await axios.get('/deposits');
      const deposits = response.data;

      const filteredDeposits = deposits.filter(deposit => deposit.year === selectedYear);
      
      const monthlyTotals = new Array(12).fill(0);
      filteredDeposits.forEach(deposit => {
        monthlyTotals[deposit.month - 1] += deposit.amount;
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      setData({
        months,
        totals: monthlyTotals
      });
    } catch (error) {
      console.error('Error fetching deposits', error);
    }
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value, 10));
  };

  const option = {
    title: {
      text: `Total Setoran per Bulan - ${year}`
    },
    tooltip: {},
    legend: {
      data: ['Total Setoran'],
      orient: 'horizontal',
      bottom: 0,
      itemWidth: 20,
      itemHeight: 14
    },
    xAxis: {
      data: data.months
    },
    yAxis: {},
    series: [
      {
        name: 'Total Setoran',
        type: 'bar',
        data: data.totals
      }
    ]
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h1>Dashboard</h1>
        <div className="form-group">
          <label htmlFor="yearSelect">Pilih Tahun:</label>
          <select id="yearSelect" className="form-select" value={year} onChange={handleYearChange}>
            {years.map(yr => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          <ReactECharts option={option} style={{ height: '500px' }} className="chart" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
