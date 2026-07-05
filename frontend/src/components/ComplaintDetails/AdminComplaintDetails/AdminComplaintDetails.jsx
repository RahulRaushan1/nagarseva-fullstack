import React, { useState } from "react";
import styles from "../complaintDetails.module.css";
import Timeline from "../Timeline";
import AssignOfficerModal from "../../AssignOfficerModal/AssignOfficerModal";
import { toast } from "react-toastify";
import OverviewCard from "../OverviewCard";
import LocationDetailsCard from "../LocationDetailsCard";
import CitizenCard from "../CitizenCard";
import OfficerCard from "../OfficerCard";
import ImageGalleryCard from "../ImageGalleryCard";
import RemarksCard from "../RemarksCard";
import Header from "../Header";
import CurrentCycleCard from "../CurrentCycleCard";
import PreviousCycleAccordion from "../PreviousCycleAccordion";

const AdminComplaintDetails = ({
  complaint,
  onBack,
  setLoading,
  setLoaderText,
  refreshComplaintDetails,
  refreshComplaintList,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
  };

  const handleAnimationEnd = (e) => {
    if (isExiting && e.target.classList.contains(styles.page_wrapper)) {
      onBack();
    }
  };

  if (!complaint) return null;

  const handleApproveComplaints = async () => {
    setLoaderText("Approving complaint...");
    const loaderId = setTimeout(() => setLoading(true), 300);

    try {
      const response = await fetch(
        `http://https://nagarseva-backend-oy56.onrender.com/admin/complaint/${complaint.complaintId}/approve`,
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
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      clearTimeout(loaderId);
    }
  };

  let assignOfficerActionButton;

    if (complaint.issueStatus == "APPROVED") {
      assignOfficerActionButton = (
        <button
          className={styles.btn_outline}
          onClick={() => setIsAssignModalOpen(true)}
          disabled={complaint.issueStatus != "APPROVED"}
          title={
            complaint.issueStatus == "CREATED"
              ? "Approve the complaint first"
              : "Officer is Already assigned"
          }
        >
          Assign Officers
        </button>
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
        actionButton={
          complaint.issueStatus?.toUpperCase() === "CREATED" ? (
            <button
              className={styles.btn_primary_action}
              onClick={handleApproveComplaints}
            >
              Approve
            </button>
          ) : (
            <button className={styles.btn_primary_action_disabled} disabled>
              Approved
            </button>
          )
        }
      />

      {/* Main Content Layout */}
      <div className={styles.content_layout}>
        {/* Left Column (70%) */}
        <div className={styles.left_column}>
          <OverviewCard complaint={complaint} />
          <LocationDetailsCard location={complaint.locationResponse || complaint.location} />
          <CitizenCard citizen={complaint.citizenInfo} />
          <OfficerCard
          title={"Officer Assignment"}
            officer={complaint.assignedTo}
            // status={complaint.issueStatus}
            // onAssignClick={}
            assignOfficerActionButton={assignOfficerActionButton}
          />
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

      {isAssignModalOpen && (
        <AssignOfficerModal
          complaint={complaint}
          onClose={() => setIsAssignModalOpen(false)}
          setLoading={setLoading}
          setLoaderText={setLoaderText}
          refreshComplaintDetails={refreshComplaintDetails}
          refreshComplaintList={refreshComplaintList}
        />
      )}
    </div>
  );
};

export default AdminComplaintDetails;
