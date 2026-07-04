import React, { useState, useRef } from "react";
import styles from "./complaintDetails.module.css";
import CycleHistoryCard from "./CycleHistoryCard";

const PreviousCycleAccordion = ({ cycles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  if (!cycles || cycles.length === 0) return null;

  // Order cycles descending by cycleNumber to show the most recent rejected attempts first
  const sortedCycles = [...cycles].sort((a, b) => b.cycleNumber - a.cycleNumber);

  return (
    <div className={styles.accordion_container}>
      <button
        className={styles.accordion_header}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.accordion_title}>
          Previous Work Attempts ({cycles.length})
        </span>
        <svg
          className={`${styles.accordion_chevron} ${isOpen ? styles.chevron_open : ""}`}
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        className={styles.accordion_content_wrapper}
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div ref={contentRef} className={styles.accordion_content}>
          {sortedCycles.map((cycle) => (
            <CycleHistoryCard key={cycle.cycleNumber} cycle={cycle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousCycleAccordion;
