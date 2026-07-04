import React from "react";
import styles from "./councillorDashboardOverview.module.css";

const CouncillorDashboardOverview = ({ dashboardData, onQuickAction }) => {
  // Row 1: KPI Cards
  const kpiCards = [
    {
      id: "total",
      title: "Total Complaints",
      value: dashboardData ? dashboardData.totalComplaints : 0,
      subtext: "Complaints registered in your ward",
      icon: "ph ph-file-text",
      gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconColor: "#2563eb",
    },
    {
      id: "active",
      title: "Active Complaints",
      value: dashboardData ? dashboardData.activeComplaints : 0,
      subtext: "Currently active complaints",
      icon: "ph ph-warning-circle",
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      iconColor: "#d97706",
    },
    {
      id: "resolved",
      title: "Resolved Complaints",
      value: dashboardData ? dashboardData.resolvedComplaints : 0,
      subtext: "Successfully resolved complaints",
      icon: "ph ph-check-circle",
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
      iconColor: "#059669",
    },
    {
      id: "reopened",
      title: "Reopened Complaints",
      value: dashboardData ? dashboardData.reopenedComplaints : 0,
      subtext: "Complaints reopened for action",
      icon: "ph ph-arrow-counter-clockwise",
      gradient: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      iconColor: "#dc2626",
    },
  ];

  // Ward Overview Stats (Row 2 Left)
  const overview = dashboardData?.complaintOverview || {
    activeCount: 0,
    resolvedCount: 0,
    pendingVerificationCount: 0,
    reopenedCount: 0,
  };

  const overviewStats = [
    { label: "Created", count: dashboardData?.totalComplaints || 0, color: "#2563eb", bg: "#eff6ff", icon: "ph ph-plus-circle" },
    { label: "In Progress", count: overview.activeCount, color: "#d97706", bg: "#fef3c7", icon: "ph ph-activity" },
    { label: "Pending Verification", count: overview.pendingVerificationCount, color: "#059669", bg: "#f0fdf4", icon: "ph ph-shield-check" },
    { label: "Resolved", count: overview.resolvedCount, color: "#7c3aed", bg: "#faf5ff", icon: "ph ph-check-square" },
  ];

  // Helper for status classes
  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "in_progress") return styles.status_in_progress;
    if (s === "closed" || s === "auto_closed") return styles.status_closed;
    if (s === "pending_verification") return styles.status_pending_verification;
    if (s === "rejected") return styles.status_rejected;
    if (s === "reopened") return styles.status_reopened;
    return styles.status_created;
  };

  // Helper for time ago formatting
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className={styles.dashboard_container}>
      {/* Row 1: KPI Cards */}
      <div className={styles.kpi_grid}>
        {kpiCards.map((kpi) => (
          <div key={kpi.id} className={styles.kpi_card}>
            <div className={styles.kpi_header}>
              <div
                className={styles.kpi_icon_wrapper}
                style={{ background: kpi.gradient, color: kpi.iconColor }}
              >
                <i className={kpi.icon}></i>
              </div>
              <span className={styles.kpi_value}>{kpi.value}</span>
            </div>
            <div className={styles.kpi_content}>
              <h4 className={styles.kpi_title}>{kpi.title}</h4>
              <p className={styles.kpi_subtext}>{kpi.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Ward Complaint Overview & Quick Actions */}
      <div className={styles.row_two_grid}>
        {/* Ward Complaint Overview Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-chart-pie-slice"></i> Ward Complaint Overview
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.overview_child_grid}>
              {overviewStats.map((stat) => (
                <div key={stat.label} className={styles.overview_child_card}>
                  <div
                    className={styles.overview_icon_box}
                    style={{ backgroundColor: stat.bg, color: stat.color }}
                  >
                    <i className={stat.icon}></i>
                  </div>
                  <div className={styles.overview_info}>
                    <span className={styles.overview_label}>{stat.label}</span>
                    <span className={styles.overview_count}>
                      <strong>{stat.count}</strong> complaints
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-lightning"></i> Quick Actions
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.quick_actions_container}>
              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_view}`}
                onClick={() => onQuickAction("view_complaints")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-files"></i>
                </div>
                <span>View Complaints</span>
              </button>

              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_profile}`}
                onClick={() => onQuickAction("update_profile")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-user"></i>
                </div>
                <span>Update Profile</span>
              </button>

              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_ward}`}
                onClick={() => onQuickAction("view_ward_details")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-buildings"></i>
                </div>
                <span>View Ward Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Ward Complaints */}
      <div className={styles.row_four_full}>
        {/* Recent Ward Complaints Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-clock-counter-clockwise"></i> Recent Ward Complaints
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.complaints_child_list}>
              {dashboardData?.recentComplaints && dashboardData.recentComplaints.length > 0 ? (
                dashboardData.recentComplaints.map((c) => (
                  <div key={c.id} className={styles.complaint_child_card}>
                    <div className={styles.complaint_card_header}>
                      <span className={styles.complaint_id}>#NS-{c.id}</span>
                      <span className={styles.complaint_time}>{formatTimeAgo(c.createdAt)}</span>
                    </div>
                    <h4 className={styles.complaint_title}>{c.title}</h4>
                    <div className={styles.complaint_card_footer}>
                      <span className={`${styles.status_badge} ${getStatusClass(c.status)}`}>
                        {c.status}
                      </span>
                      <button
                        type="button"
                        className={styles.view_details_btn}
                        onClick={() => onQuickAction("view_complaints", c.id)}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty_state}>
                  <i className="ph ph-folder-open"></i>
                  <p>No complaints registered in your ward.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Ward Summary (Optional Row) */}
      {dashboardData?.wardSummary && (
        <div id="ward-summary-section" className={styles.row_four_full}>
          <div className={styles.parent_card}>
            <div className={styles.card_header}>
              <h3 className={styles.card_title}>
                <i className="ph ph-map-pin"></i> Ward Summary
              </h3>
            </div>
            <div className={styles.card_body}>
              <div className={styles.summary_insights_grid}>
                <div className={styles.summary_insight_item}>
                  <span className={styles.summary_insight_label}>Ward Name</span>
                  <span className={styles.summary_insight_value}>
                    {dashboardData.wardSummary.wardName || "N/A"}
                  </span>
                </div>
                <div className={styles.summary_insight_item}>
                  <span className={styles.summary_insight_label}>Ward ID</span>
                  <span className={styles.summary_insight_value}>
                    {dashboardData.wardSummary.wardId ? `#${dashboardData.wardSummary.wardId}` : "N/A"}
                  </span>
                </div>
                <div className={styles.summary_insight_item}>
                  <span className={styles.summary_insight_label}>Assigned Officers</span>
                  <span className={styles.summary_insight_value}>
                    {dashboardData.wardSummary.assignedOfficersCount ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncillorDashboardOverview;
