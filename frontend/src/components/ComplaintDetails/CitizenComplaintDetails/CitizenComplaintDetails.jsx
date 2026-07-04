import React, { useState } from "react";
import styles from "../complaintDetails.module.css";
import Header from "../Header";
import Timeline from "../Timeline";
import OverviewCard from "../OverviewCard";
import ImageGalleryCard from "../ImageGalleryCard";
import CurrentCycleCard from "../CurrentCycleCard";
import PreviousCycleAccordion from "../PreviousCycleAccordion";
import RejectWorkModal from "../../RejectWorkModal/RejectWorkModal"
import OfficerCard from "../OfficerCard";
import RemarksCard from "../RemarksCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CitizenComplaintDetails = ({
  complaint,
  onBack,
  setLoading,
  setLoaderText,
  refreshComplaintDetails,
  refreshComplaintList,
}) => {
  // console.log("Inside citizen", complaint);

  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e) => {
    if (isExiting && e.target.classList.contains(styles.page_wrapper)) {
      onBack();
    }
  };
  const [isRejectWorkModalOpen, setIsRejectWorkModalOpen] = useState(false)

  const store = ["CREATED", "APPROVED", "ASSIGNED"];

  const handleRejectWork = async () => {
    setIsRejectWorkModalOpen(true)
    await refreshComplaintDetails(complaint.complaintId)
    refreshComplaintList();
  }

  const handleAcceptWork = async () => {
    setLoaderText("Submitting acceptance...")
    const loaderId = setTimeout(() => setLoading(true),300)

    try {
      const response = await fetch(`http://localhost:8080/citizen/complaint/${complaint.complaintId}/accept`,{
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) 
          navigate("/login");

        const errorData = await response.json();
        console.log(errorData)
        return;
      }

      const data = await response.json();
      toast.success(data.message)
      await refreshComplaintDetails(complaint.complaintId)
      refreshComplaintList();
      handleBack();
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      clearTimeout(loaderId)
    }
  }

  let complaintActionButtons;

  if (complaint.issueStatus === "PENDING_VERIFICATION") {
    complaintActionButtons = (
      <>
        <button className={styles.btn_reject_work}
        onClick={handleRejectWork}>Reject Work</button>

        <button className={styles.btn_approve_work}
        onClick={handleAcceptWork}>Accept Work</button>
      </>
    );
  }

  return (
    <div 
      className={`${styles.page_wrapper} ${isExiting ? styles.fadeOut : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Header */}
      <Header
        complaint={complaint}
        onBack={handleBack}
        // actionButton={}
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
          {/* <CitizenCard citizen={complaint.citizenInfo} /> */}
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

      {isRejectWorkModalOpen && 
      <RejectWorkModal 
      isOpen={complaint}
      onClose={() => {
        setIsRejectWorkModalOpen(false)
      }}
      complaintId={complaint.complaintId}
      handleRejectWork={handleRejectWork}
      setLoaderText={setLoaderText}
      setLoading={setLoading}
      refreshComplaintDetails={refreshComplaintDetails}
      refreshComplaintList={refreshComplaintList}
      />}
    </div>
  );
};

export default CitizenComplaintDetails;
