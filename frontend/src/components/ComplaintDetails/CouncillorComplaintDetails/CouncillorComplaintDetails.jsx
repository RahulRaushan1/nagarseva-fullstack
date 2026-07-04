import React, { useState } from "react";
import Header from "../Header";
import OverviewCard from "../OverviewCard";
import OfficerCard from "../OfficerCard";
import ImageGalleryCard from "../ImageGalleryCard";
import CurrentCycleCard from "../CurrentCycleCard";
import PreviousCycleAccordion from "../PreviousCycleAccordion";
import styles from "../complaintDetails.module.css";
import Timeline from "../Timeline";
import ChangePriorityModal from "./ChangePriorityModal";

const CouncillorComplaintDetails = ({
  complaint,
  onBack,
  setLoading,
  setLoaderText,
  refreshComplaintDetails,
  refreshComplaintList,
}) => {

  const [isChangePriorityModalOpen, setIsChangePriorityModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e) => {
    if (isExiting && e.target.classList.contains(styles.page_wrapper)) {
      onBack();
    }
  };

  const allowedPrioritiesStatus = [
    "CREATED",
    "APPROVED",
    "ASSIGNED",
    "IN_PROGRESS",
    "PENDING_VERIFICATION",
    "REOPENED",
  ];

  const allowed = allowedPrioritiesStatus.includes(complaint.issueStatus);

  const complaintActionButtons = (
    <>
      <button
        className={styles.btn_outline}
        onClick={() => setIsChangePriorityModalOpen(true)}
        disabled={!allowedPrioritiesStatus.includes(complaint.issueStatus)}
        title={
          allowed
            ? ""
            : "Priority change not permitted once complaint is in progress"
        }
      >
        Change Priority
      </button>
    </>
  );

  return (
    <div 
      className={`${styles.page_wrapper} ${isExiting ? styles.fadeOut : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <Header
        complaint={complaint}
        onBack={handleBack}
        actionButton={complaintActionButtons}
      />

      {/* Main Content Layout */}
      <div className={styles.content_layout}>
        {/* Left Column (70%) */}
        <div className={styles.left_column}>
          <OverviewCard complaint={complaint} />
          <OfficerCard
            title={"Assigned Officer"}
            officer={complaint.assignedTo}
          />

          <ImageGalleryCard images={complaint.complaintRaisedImages || []} />
          {(() => {
            const cycles = complaint.cycles || [];
            const currentCycle =
              cycles.find((c) => c.currentCycle) || cycles[cycles.length - 1];
            const previousCycles = cycles.filter((c) => c !== currentCycle);
            const hasCurrentSubmission =
              currentCycle &&
              (currentCycle.submittedAt ||
                (currentCycle.completionImages &&
                  currentCycle.completionImages.length > 0) ||
                currentCycle.officerRemarks);

            return (
              <>
                {hasCurrentSubmission && (
                  <CurrentCycleCard
                    cycle={currentCycle}
                    status={complaint.issueStatus}
                    complaintActionButtons={complaintActionButtons}
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

      {isChangePriorityModalOpen && (
        <ChangePriorityModal
          isOpen={true}
          onClose={() => setIsChangePriorityModalOpen(false)}
          complaint={complaint}
          setLoading={setLoading}
          setLoaderText={setLoaderText}
          refreshComplaintDetails={refreshComplaintDetails}
          refreshComplaintList={refreshComplaintList}
        />
      )}
    </div>
  );
};

export default CouncillorComplaintDetails;
