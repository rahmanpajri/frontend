import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import ReactECharts from 'echarts-for-react';

const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Tahun default adalah tahun saat ini
  const [data, setData] = useState({
    months: [],
    totals: []
  });

  useEffect(() => {
    // Simulasi fetching data dari API berdasarkan tahun yang dipilih
    const fetchData = async () => {
      // Contoh data setoran per bulan
      const monthlyDeposits = {
        2023: [1200, 1500, 1300, 1600, 1700, 1400, 1800, 1900, 2000, 2100, 2200, 2300],
        2024: [1100, 1400, 1200, 1500, 1600, 1300, 1700, 1800, 1900, 2000, 2100, 2200]
      };

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const totals = monthlyDeposits[year] || new Array(12).fill(0);

      setData({
        months,
        totals
      });
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const option = {
    title: {
      text: `Total Setoran per Bulan - ${year}`
    },
    tooltip: {},
    legend: {
        data: ['Total Setoran'],
        orient: 'horizontal', // Orientasi legend horizontal
        bottom: 0, // Tempatkan legend di bawah grafik
        itemWidth: 20, // Lebar item legend
        itemHeight: 14 // Tinggi item legend
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
      <Navbar/>
      <div className="container mt-3">
      <h1>Dashboard</h1>
        <div className="form-group">
          <label htmlFor="yearSelect">Pilih Tahun:</label>
          <select id="yearSelect" className="form-select" value={year} onChange={handleYearChange}>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Tambahkan opsi tahun lainnya sesuai kebutuhan */}
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
