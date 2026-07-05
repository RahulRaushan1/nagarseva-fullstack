import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './assignOfficerModal.module.css';
import { toast } from 'react-toastify';

const DEPARTMENTS = [
  "SANITATION",
  "WATER",
  "ELECTRICITY",
  "ROADS",
  "DRAINAGE",
  "OTHER"
];

const AssignOfficerModal = ({ complaint, onClose, setLoading, setLoaderText, refreshComplaintDetails, refreshComplaintList }) => {
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [assigningId, setAssigningId] = useState(null);

  const fetchOfficer = async () => {
    setLoaderText("Loading officers...");
    const loaderId = setTimeout(() => setLoading(true),300);

    try {
      const response = await fetch(`http://https://nagarseva-backend-oy56.onrender.com/admin/departments/officers?department=${selectedDept}`,{
        method : "GET",
        headers : {
          "Content-Type" : "Application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json();

        console.log(errorData)
        return;
      }

      const data = await response.json();
      console.log(data)
      setOfficers(data.officers)
    } catch (err) {
      toast.error("Unable to connect to server")
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
    }
  }

  useEffect(() => {
    // console.log(selectedDept)
    if (selectedDept != '') fetchOfficer()
  }, [selectedDept]);

  const filteredOfficers = officers.filter(off =>
    off.officerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async (officerId) => {
    setLoaderText("Loading officers...");
    const loaderId = setTimeout(() => setLoading(true),300);

    try {
      const response = await fetch(`http://https://nagarseva-backend-oy56.onrender.com/admin/complaint/${complaint.complaintId}/assign?offId=${officerId}`,{
        method : "PUT",
        headers : {
          "Content-Type" : "Application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === "COMPLAINT_NOT_APPROVED")
          toast.error("Cannot assign: Complaint must be approved first.")

        console.log(errorData)
        return;
      }

      const data = await response.json();
      toast.success(data.message)
      await refreshComplaintDetails(complaint.complaintId);
      refreshComplaintList();
      onClose()
    } catch (err) {
      toast.error("Unable to connect to server")
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
    }
  };

  const priorityClass = complaint?.priority?.toLowerCase() === 'high' 
    ? styles.badge_high 
    : complaint?.priority?.toLowerCase() === 'low' 
      ? styles.badge_low 
      : styles.badge_medium;

  return createPortal(
    <div className={styles.modal_overlay} onClick={onClose}>
      <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modal_header}>
          <div className={styles.header_text}>
            <h2 className={styles.modal_title}>Assign Officer</h2>
            <p className={styles.modal_subtitle}>Select a department and assign an officer for this complaint.</p>
          </div>
          <button className={styles.btn_close} onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modal_body}>
          {/* Summary Card */}
          <div className={styles.summary_card}>
            <div className={styles.summary_item}>
              <span className={styles.summary_label}>Issue Type</span>
              <span className={styles.summary_value}>{complaint?.issueType || 'N/A'}</span>
            </div>
            <div className={styles.summary_item}>
              <span className={styles.summary_label}>Priority</span>
              <span className={`${styles.badge} ${priorityClass}`}>
                {complaint?.priority || 'Medium'}
              </span>
            </div>
            <div className={styles.summary_item}>
              <span className={styles.summary_label}>Ward</span>
              <span className={styles.summary_value}>{complaint?.ward?.wardId || 'N/A'}</span>
            </div>
            <div className={styles.summary_item}>
              <span className={styles.summary_label}>Status</span>
              <span className={styles.summary_value}>{complaint?.issueStatus || 'PENDING'}</span>
            </div>
          </div>

          {/* Department Selection */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Select Department</label>
            <select 
              className={styles.form_select}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">-- Choose a department --</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Officers Section */}
          <div className={styles.officers_section}>
            <div className={styles.form_group}>
              <label className={styles.form_label}>Available Officers</label>
              
              {/* Revamped Search Bar */}
              <div className={styles.search_container}>
                <svg className={styles.search_icon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className={styles.search_input}
                  placeholder="Search officer by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={!selectedDept}
                />
              </div>
            </div>

            {/* Unified Fixed-Height Container */}
            <div className={styles.officers_list_container}>
              {isLoading ? (
                <div className={styles.list_empty_state}>
                  <div className={styles.loader}></div>
                </div>
              ) : !selectedDept ? (
                <div className={styles.list_empty_state}>
                  Select a department to view available officers.
                </div>
              ) : filteredOfficers.length === 0 ? (
                <div className={styles.list_empty_state}>
                  No matching officers found.
                </div>
              ) : (
                <div className={styles.officers_scroll_area}>
                  {filteredOfficers.map(officer => (
                    <div key={officer.officerId} className={styles.officer_row}>
                      <div className={styles.officer_info}>
                        <span className={styles.officer_name}>{officer.officerName}</span>
                        <div className={styles.officer_meta}>
                          <span>{officer.ward}</span>
                          <span>•</span>
                          <span>{officer.activeComplaints} Active Complaints</span>
                        </div>
                      </div>
                      <div className={styles.officer_actions}>
                        <div className={styles.officer_status_badge}>
                          <span className={officer.isActive ? styles.status_dot_active : styles.status_dot_inactive}></span>
                          {officer.isActive ? 'Active' : 'Disabled'}
                        </div>
                        <button 
                          className={styles.btn_assign}
                          onClick={() => handleAssign(officer.officerId)}
                          disabled={assigningId !== null}
                        >
                          {assigningId === officer.id ? 'Assigning...' : 'Assign'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modal_footer}>
          <button className={styles.btn_cancel} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AssignOfficerModal;
