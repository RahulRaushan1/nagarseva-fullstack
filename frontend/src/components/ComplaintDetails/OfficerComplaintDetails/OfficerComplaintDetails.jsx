import React, { useState } from "react";
import styles from "../complaintDetails.module.css";
import OverviewCard from "../OverviewCard";
import CitizenCard from "../CitizenCard";
import OfficerCard from "../OfficerCard";
import ImageGalleryCard from "../ImageGalleryCard";
import RemarksCard from "../RemarksCard";
import Header from "../Header";
import { toast } from "react-toastify";
import Timeline from "../Timeline";
import WorkCompletionModal from "../../WorkCompletionModal/WorkCompletionModal";
import CurrentCycleCard from "../CurrentCycleCard";
import PreviousCycleAccordion from "../PreviousCycleAccordion";

const OfficerComplaintDetails = ({
  complaint,
  onBack,
  setLoading,
  setLoaderText,
  refreshComplaintDetails,
  refreshComplaintList,
}) => {
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e) => {
    if (isExiting && e.target.classList.contains(styles.page_wrapper)) {
      onBack();
    }
  };

  const handleCompletionSuccess = async () => {
    setIsCompletionModalOpen(false);
    await refreshComplaintDetails(complaint.complaintId);
    refreshComplaintList();
    handleBack();
  };

  const handleBeginComplaint = async () => {
    setLoaderText("Starting complaint work...");
    const loaderId = setTimeout(() => setLoading(true), 300);

    try {
      const response = await fetch(
        `http://localhost:8080/officer/complaint/${complaint.complaintId}/start`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.log(errorData);
        return;
      }

      const data = await response.json();
      toast.success(data.message);

      await refreshComplaintDetails(complaint.complaintId);
      refreshComplaintList();
      handleBack();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
    }
  };

  let actionButton;

  if (
    complaint.issueStatus?.toUpperCase() === "ASSIGNED" ||
    complaint.issueStatus?.toUpperCase() === "REOPENED"
  ) {
    actionButton = (
      <button
        className={styles.btn_primary_action}
        onClick={handleBeginComplaint}
      >
        Begin Work
      </button>
    );
  } else if (complaint.issueStatus?.toUpperCase() === "IN_PROGRESS") {
    actionButton = (
      <button
        className={styles.btn_primary_action}
        onClick={() => setIsCompletionModalOpen(true)}
      >
        Mark As Complete
      </button>
    );
  }

  const store= ["CREATED","APPROVED","ASSIGNED"]

  return (
    <div 
      className={`${styles.page_wrapper} ${isExiting ? styles.fadeOut : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Header */}
      <Header
        complaint={complaint}
        onBack={handleBack}
        actionButton={actionButton}
      />

      {/* Main Content Layout */}
      <div className={styles.content_layout}>
        {/* Left Column (70%) */}
        <div className={styles.left_column}>
          <OverviewCard complaint={complaint} />
          <CitizenCard citizen={complaint.citizenInfo} />
          <ImageGalleryCard images={complaint.complaintRaisedImages || []} />
          {(() => {
            const cycles = complaint.cycles || [];
            const currentCycle = cycles.find(c => c.currentCycle) || cycles[cycles.length - 1];
            const previousCycles = cycles.filter(c => c !== currentCycle);
            const hasCurrentSubmission = currentCycle && (
              currentCycle.submittedAt || 
              (currentCycle.completionImages && currentCycle.completionImages.length > 0) || 
              currentCycle.officerRemarks
            );

            return (
              <>
                {hasCurrentSubmission && (
                  <CurrentCycleCard
                    cycle={currentCycle}
                    status={complaint.issueStatus}
                  />
                )}
                {previousCycles.length > 0 && (
                  <PreviousCycleAccordion cycles={previousCycles} />
                )}
              </>
            );
          })()}
          
        </div>

        {/* Right Column (30%) */}
        <div className={styles.right_column}>
          <Timeline currentStatus={complaint.issueStatus || "NA"} />
        </div>
      </div>

      {isCompletionModalOpen && (
        <WorkCompletionModal 
          complaint={complaint}
          onClose={() => setIsCompletionModalOpen(false)}
          onSuccess={handleCompletionSuccess}
          setLoading={setLoading}
          setLoaderText={setLoaderText}
        />
      )}
    </div>
  );
};

export default OfficerComplaintDetails;
