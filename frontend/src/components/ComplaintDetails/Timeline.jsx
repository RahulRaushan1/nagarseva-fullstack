import React from 'react';
import styles from './timeline.module.css';

const Timeline = ({ currentStatus }) => {
  const steps = [
    { 
      id: 'CREATED', 
      title: 'Complaint Created', 
      description: 'Complaint successfully registered by citizen' 
    },
    { 
      id: 'ASSIGNED', 
      title: 'Officer Assigned', 
      description: 'Assigned to a nodal officer' 
    },
    { 
      id: 'IN_PROGRESS', 
      title: 'Work In Progress', 
      description: 'Officer has started working on the issue' 
    },
    { 
      id: 'RESOLVED', 
      title: currentStatus === 'REOPENED' ? 'Work Rejected' : 'Resolved', 
      description: currentStatus === 'REOPENED' 
        ? 'Citizen reported issue still unresolved' 
        : 'Officer marked the issue as resolved'
    },
    { 
      id: 'CLOSED', 
      title: 'Closed', 
      description: 'Admin verified and closed the complaint' 
    }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'CREATED':
      case 'APPROVED':
        return 0;
      case 'ASSIGNED':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'PENDING_VERIFICATION':
      case 'REOPENED':
        return 3;
      case 'CLOSED':
      case 'AUTO_CLOSED':
      case 'REJECTED':
        return 4;
      default:
        return 0;
    }
  };

  const getStepState = (stepIndex, activeIndex) => {
    if (currentStatus === 'CLOSED' || currentStatus === 'AUTO_CLOSED' || currentStatus === 'REJECTED') {
      return 'completed';
    }
    if (stepIndex < activeIndex) return 'completed';
    if (stepIndex === activeIndex) {
      if (currentStatus === 'REOPENED' && stepIndex === 3) {
        return 'reopened_active';
      }
      return 'current';
    }
    return 'future';
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className={styles.timeline_card}>
      <h3 className={styles.timeline_title}>Complaint Status</h3>
      <div className={styles.timeline_container}>
        {steps.map((step, index) => {
          const state = getStepState(index, activeIndex);
          const isLineDashed = index === 2 && currentStatus === 'REOPENED';
          
          return (
            <div key={step.id} className={`${styles.timeline_step} ${styles[state] || ''}`}>
              <div className={styles.step_indicator}>
                <div className={styles.circle}>
                  {state === 'completed' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.check_icon}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  {state === 'current' && <div className={styles.inner_circle}></div>}
                  {state === 'reopened_active' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.warning_icon}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div className={`${styles.line} ${isLineDashed ? styles.line_dashed : ''}`}></div>
                )}
              </div>
              <div className={styles.step_content}>
                <h4 className={styles.step_title}>{step.title}</h4>
                <p className={styles.step_desc}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
