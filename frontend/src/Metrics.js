import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import { fetchMetrics } from "./api/nodeApi";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function Metrics() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [metrics, setMetrics] = useState([]);
    const [aggregation, setAggregation] = useState("none");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100); // State for data points per page
    const [error, setError] = useState("");
  
    const aggregateData = (data, interval) => {
        if (interval === "none") return data;
      
        const intervalMs = {
          "10s": 10 * 1000,
          "1m": 60 * 1000,
          "5m": 5 * 60 * 1000,
        }[interval];
      
        const aggregated = [];
        let bucket = [];
        let bucketStartTime = new Date(data[0].timestamp).getTime();
      
        data.forEach((point) => {
          const pointTime = new Date(point.timestamp).getTime();
          if (pointTime - bucketStartTime <= intervalMs) {
            bucket.push(point);
          } else {
            // Aggregate responseTime as average and numItems as average
            const avgResponseTime =
              bucket.reduce((sum, p) => sum + p.responseTime, 0) / bucket.length;
            const avgNumItems =
              bucket.reduce((sum, p) => sum + p.numItems, 0) / bucket.length;
            aggregated.push({
              timestamp: new Date(bucketStartTime).toISOString(),
              responseTime: avgResponseTime,
              numItems: avgNumItems,
            });
            bucket = [point];
            bucketStartTime = pointTime;
          }
        });
      
        // Add the last bucket
        if (bucket.length > 0) {
          const avgResponseTime =
            bucket.reduce((sum, p) => sum + p.responseTime, 0) / bucket.length;
          const avgNumItems =
            bucket.reduce((sum, p) => sum + p.numItems, 0) / bucket.length;
          aggregated.push({
            timestamp: new Date(bucketStartTime).toISOString(),
            responseTime: avgResponseTime,
            numItems: avgNumItems,
          });
        }
      
        return aggregated;
      };      
  
    const paginateData = (data, page, itemsPerPage) => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    };
  
    const totalPages = Math.ceil(metrics.length / itemsPerPage); // Calculate total pages
  
    useEffect(() => {
        const fetchFilteredMetrics = async () => {
          try {
            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
      
            const data = await fetchMetrics({
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            });
            setMetrics(data);
          } catch (err) {
            setError("Failed to fetch metrics");
          }
        };

      fetchFilteredMetrics();
    }, [startDate, endDate]);
  
    const chartData = {
      labels: paginateData(aggregateData(metrics, aggregation), page, itemsPerPage).map((metric, index, arr) => {
        const timestamp = new Date(metric.timestamp);
        const date = timestamp.toISOString().split("T")[0];
        const time = timestamp.toTimeString().split(" ")[0].slice(0, 5); // HH:mm
  
        if (index === 0 || new Date(arr[index - 1].timestamp).toISOString().split("T")[0] !== date) {
          return `${date}\n${time}`;
        } else {
          return time;
        }
      }),
      datasets: [
        {
          label: "Response Time (ms)",
          data: paginateData(aggregateData(metrics, aggregation), page, itemsPerPage).map(
            (metric) => metric.responseTime
          ),
          borderColor: "rgba(75,192,192,1)",
          fill: false,
        },
        {
          label: "Items Returned",
          data: paginateData(aggregateData(metrics, aggregation), page, itemsPerPage).map(
            (metric) => metric.numItems
          ),
          borderColor: "rgba(255,99,132,1)",
          fill: false,
        },
      ],
    };
  
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Time" },
            ticks: {
              callback: function (value, index, ticks) {
                return this.getLabelForValue(value).replace("\n", " ");
              },
              font: {
                size: 10,
              },
            },
          },
          y: {
            title: { display: true, text: "Value" },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                // Format response time in French style
                const value = tooltipItem.raw; // Get the raw value of the datapoint
                const formattedValue = new Intl.NumberFormat("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(value);
      
                // Add units and label
                if (tooltipItem.dataset.label === "Response Time (ms)") {
                  return `Response Time: ${formattedValue} ms`;
                } else if (tooltipItem.dataset.label === "Items Returned") {
                  return `Items Returned: ${value}`;
                }
                return value;
              },
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },
      };         
  
    return (
      <div className="metrics-page">
        <h2>API Metrics</h2>
        {error && <p className="error">{error}</p>}
  
        <div className="controls">
          <label>
            Start Date:
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </label>
          <label>
            End Date:
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </label>
          <label>
            Aggregation:
            <select value={aggregation} onChange={(e) => setAggregation(e.target.value)}>
              <option value="none">None</option>
              <option value="10s">10 Seconds</option>
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
            </select>
          </label>
          <label>
            Data Points per Page:
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1); // Reset to first page when items per page changes
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </label>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="page-number">
              Page {page} / {totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
  
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  }
  
  export default Metrics;
  