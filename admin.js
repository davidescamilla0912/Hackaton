// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Chart data
    const chartData = [
      { month: 'Jan', value: 30 },
      { month: 'Feb', value: 40 },
      { month: 'Mar', value: 35 },
      { month: 'Apr', value: 50 },
      { month: 'May', value: 45 },
    ];
  
    // Create the line chart
    createLineChart(chartData);
  
    // Create the circular progress chart
    createCircularProgress(80);
  
    // Add event listener for the search input
    const searchInput = document.querySelector('.search input');
    searchInput.addEventListener('input', filterOrders);
  
    // Add event listener for the date range select
    const dateRangeSelect = document.querySelector('.date-range select');
    dateRangeSelect.addEventListener('change', updateDateRange);
  });
  
  function createLineChart(data) {
    const ctx = document.createElement('canvas');
    document.querySelector('.line-chart').appendChild(ctx);
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.month),
        datasets: [{
          label: 'Earnings',
          data: data.map(item => item.value),
          borderColor: '#6c5ce7',
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  }
  
  function createCircularProgress(percentage) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
  
    canvas.width = canvas.height = 200;
    document.querySelector('.circle-chart').appendChild(canvas);
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e9e3ff';
    ctx.lineWidth = 15;
    ctx.stroke();
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (percentage / 100) * 2 * Math.PI - Math.PI / 2);
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 15;
    ctx.stroke();
  
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentage + '%', centerX, centerY);
  }
  
  function filterOrders() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.order-status table tbody tr');
  
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }
  
  function updateDateRange() {
    const selectedValue = this.value;
    let startDate, endDate;
    const today = new Date();
  
    switch(selectedValue) {
      case 'daily':
        startDate = endDate = today;
        break;
      case 'weekly':
        startDate = new Date(today.setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'monthly':
        startDate = new Date(today.setMonth(today.getMonth() - 1));
        endDate = new Date();
        break;
      case 'yearly':
        startDate = new Date(today.setFullYear(today.getFullYear() - 1));
        endDate = new Date();
        break;
    }
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    document.querySelector('.date-range span').textContent = `${formattedStartDate} - ${formattedEndDate}`;
  }
  
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }