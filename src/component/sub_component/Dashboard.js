import React from 'react';
import '../css_files/Dashboard.css';
import OverviewChart  from '../sub_component/OverviewChart'
import google_s from '../Data/google_s.png'


const Dashboard = () => {

    function AddRecentActiveUser({name,email,time}){
        return(
            <li>
                <span className="sales-name">{name}</span>
                <span className="sales-email">{email}</span>
                <span className="sales-amount">{time}</span>
            </li>
        )
    }
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-section">
          <img src={google_s} alt="User Avatar" className="avatar" />
          <span className="username">Shrey11_</span>
        </div>
        <div className="search-section">
          <input type="text" placeholder="Search..." />
        </div>
      </header>

      <div className="dashboard-toolbar">
        <div className="left-section">
          <h1>Dashboard</h1>
          <br />
          <div className="toolbar-options">
            <button>Overview</button>
            <button>Analytics</button>
            <button>Reports</button>
            <button>Email</button>
          </div>
        </div>
        <div className="right-section">
          <input type="date" />
          <button className="download-button">Download</button>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="stats-section">
          <div className="stat-item">
            <h3>Total Revenue</h3>
            <p>0</p>
            <small>0% from last month</small>
          </div>
          <div className="stat-item">
            <h3>Subscriptions</h3>
            <p>0</p>
            <small>0% from last month</small>
          </div>
          <div className="stat-item">
            <h3>Active Now</h3>
            <p>+1</p>
            <small>0% since last hour</small>
          </div>
        </div>

        <div className="main-content">
          <div className="overview-section">
            <h3>Overview</h3>
                <OverviewChart/>
          </div>

          <div className="recent-sales">
            <h3>Recent Active</h3>
            <ul>
              <AddRecentActiveUser name={"Olivia Martin"} email={"olivia.martin@email.com"} time={"1hr ago"}/>
              <AddRecentActiveUser name={"Jackson Lee"} email={"jackson.lee@email.com"} time={"3hr ago"}/>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
