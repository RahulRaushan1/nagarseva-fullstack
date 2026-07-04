import React from "react";
import styles from "./citizenDashboardOverview.module.css";

const CitizenDashboardOverview = ({ dashboardData, onQuickAction }) => {
  // Row 1: KPI Cards
  const kpiCards = [
    {
      id: "total",
      title: "Total Complaints",
      value: dashboardData ? dashboardData.totalComplaints : 0,
      subtext: "Complaints registered by you",
      icon: "ph ph-file-text",
      gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconColor: "#2563eb",
    },
    {
      id: "active",
      title: "Active Complaints",
      value: dashboardData ? dashboardData.activeComplaints : 0,
      subtext: "Under processing or assigned",
      icon: "ph ph-warning-circle",
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      iconColor: "#d97706",
    },
    {
      id: "resolved",
      title: "Resolved Complaints",
      value: dashboardData ? dashboardData.resolvedComplaints : 0,
      subtext: "Completed and closed issues",
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

  // Overview Stats
  const overview = dashboardData?.complaintOverview || {
    activeCount: 0,
    resolvedCount: 0,
    pendingVerificationCount: 0,
    reopenedCount: 0,
  };

  const overviewStats = [
    { label: "Active", count: overview.activeCount, color: "#3b82f6", bg: "#eff6ff", icon: "ph ph-activity" },
    { label: "Resolved", count: overview.resolvedCount, color: "#10b981", bg: "#f0fdf4", icon: "ph ph-check-square" },
    { label: "Pending Verification", count: overview.pendingVerificationCount, color: "#f59e0b", bg: "#fef3c7", icon: "ph ph-shield-check" },
    { label: "Reopened", count: overview.reopenedCount, color: "#ef4444", bg: "#fef2f2", icon: "ph ph-arrow-u-up-left" },
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

      {/* Row 2: Complaint Overview & Quick Actions */}
      <div className={styles.row_two_grid}>
        {/* Complaint Overview Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-chart-pie-slice"></i> Complaint Overview
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
                className={`${styles.action_btn} ${styles.action_btn_create}`}
                onClick={() => onQuickAction("create_complaint")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-plus-circle"></i>
                </div>
                <span>Create Complaint</span>
              </button>

              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_view}`}
                onClick={() => onQuickAction("view_complaints")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-files"></i>
                </div>
                <span>View My Complaints</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Complaints & Recent Updates */}
      <div className={styles.row_three_grid}>
        {/* Recent Complaints Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-clock-counter-clockwise"></i> Recent Complaints
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
                        onClick={() => onQuickAction("view_details", c.id)}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty_state}>
                  <i className="ph ph-folder-open"></i>
                  <p>No complaints submitted yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Updates Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-rss"></i> Recent Updates
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.updates_child_list}>
              {dashboardData?.recentUpdates && dashboardData.recentUpdates.length > 0 ? (
                dashboardData.recentUpdates.map((update) => (
                  <div key={update.id} className={styles.update_child_item}>
                    <div className={styles.update_icon_wrapper}>
                      <i className="ph ph-bell"></i>
                    </div>
                    <div className={styles.update_content}>
                      <p className={styles.update_message}>{update.message}</p>
                      <span className={styles.update_time}>{formatTimeAgo(update.updatedAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty_state}>
                  <i className="ph ph-bell-slash"></i>
                  <p>No recent updates available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Civic Participation / Ward Insights */}
      <div className={styles.row_four_full}>
        <div className={`${styles.parent_card} ${styles.ward_insights_card}`}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-buildings"></i> Civic Participation & Ward Insights
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.ward_insights_grid}>
              <div className={styles.ward_insight_item}>
                <span className={styles.ward_insight_label}>Your Ward</span>
                <span className={styles.ward_insight_value}>
                  {dashboardData?.wardInsight?.wardId ? `Ward ${dashboardData.wardInsight.wardId}` : "Not Assigned"}
                </span>
              </div>
              <div className={styles.ward_insight_item}>
                <span className={styles.ward_insight_label}>Most Reported Issue in Ward</span>
                <span className={styles.ward_insight_value}>
                  {dashboardData?.wardInsight?.mostReportedIssue || "None"}
                </span>
              </div>
              <div className={styles.ward_insight_item}>
                <span className={styles.ward_insight_label}>Total Ward Complaints</span>
                <span className={styles.ward_insight_value}>
                  {dashboardData?.wardInsight?.totalComplaintsInWard || 0}
                </span>
              </div>
            </div>
            
            <div className={styles.contribution_message_container}>
              <div className={styles.contribution_icon}>
                <i className="ph ph-sparkles"></i>
              </div>
              <p className={styles.contribution_message}>
                {dashboardData?.wardInsight?.citizenContributionCount && dashboardData.wardInsight.citizenContributionCount > 0 ? (
                  `You have contributed ${dashboardData.wardInsight.citizenContributionCount} complaint${dashboardData.wardInsight.citizenContributionCount > 1 ? "s" : ""} helping improve your locality.`
                ) : (
                  "You haven't contributed any complaints yet. Report an issue to help improve your locality!"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardOverview;
