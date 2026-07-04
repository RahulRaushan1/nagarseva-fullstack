import React from "react";
import styles from "./officerDashboardOverview.module.css";

const OfficerDashboardOverview = ({ dashboardData, onQuickAction }) => {
  // Row 1: KPI Cards
  const kpiCards = [
    {
      id: "assigned",
      title: "Assigned Complaints",
      value: dashboardData ? dashboardData.assignedComplaints : 0,
      subtext: "Total complaints assigned to you",
      icon: "ph ph-file-text",
      gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconColor: "#2563eb",
    },
    {
      id: "active",
      title: "Active Complaints",
      value: dashboardData ? dashboardData.activeComplaints : 0,
      subtext: "Assigned & In Progress",
      icon: "ph ph-warning-circle",
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      iconColor: "#d97706",
    },
    {
      id: "pending",
      title: "Pending Verification",
      value: dashboardData ? dashboardData.pendingVerificationComplaints : 0,
      subtext: "Waiting for citizen confirmation",
      icon: "ph ph-hourglass-medium",
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
      iconColor: "#059669",
    },
    {
      id: "resolved",
      title: "Resolved Complaints",
      value: dashboardData ? dashboardData.resolvedComplaints : 0,
      subtext: "Resolved & Closed",
      icon: "ph ph-check-circle",
      gradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      iconColor: "#7c3aed",
    },
  ];

  // Overview Stats
  const overview = dashboardData?.workOverview || {
    assignedCount: 0,
    inProgressCount: 0,
    pendingVerificationCount: 0,
    resolvedCount: 0,
  };

  const overviewStats = [
    { label: "Assigned", count: overview.assignedCount, color: "#2563eb", bg: "#eff6ff", icon: "ph ph-file-text" },
    { label: "In Progress", count: overview.inProgressCount, color: "#d97706", bg: "#fef3c7", icon: "ph ph-activity" },
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

  // Helper for Priority styling
  const getPriorityClass = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "critical") return styles.priority_critical;
    if (p === "high") return styles.priority_high;
    if (p === "medium") return styles.priority_medium;
    return styles.priority_low;
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

  // Performance values with safe fallback handling
  const resolvedThisMonthVal = dashboardData?.resolvedThisMonth ?? 0;
  const averageResolutionDaysVal = dashboardData?.averageResolutionDays ?? 0;
  const departmentVal = (dashboardData?.department && dashboardData.department !== "None") ? dashboardData.department : "N/A";
  const completionRateVal = dashboardData?.completionRate ?? 0;

  // Performance child cards config
  const performanceCards = [
    {
      label: "Resolved This Month",
      value: `${resolvedThisMonthVal}`,
      subtext: "Resolved complaints",
      icon: "ph ph-check-circle",
    },
    {
      label: "Average Resolution Time",
      value: `${averageResolutionDaysVal} Days`,
      subtext: "Average completion duration",
      icon: "ph ph-clock",
    },
    {
      label: "Department",
      value: departmentVal,
      subtext: "Assigned department",
      icon: "ph ph-buildings",
    },
    {
      label: "Completion Rate",
      value: `${completionRateVal}%`,
      subtext: "Resolved vs assigned complaints",
      icon: "ph ph-chart-line-up",
    },
  ];

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

      {/* Row 2: Work Overview & Quick Actions */}
      <div className={styles.row_two_grid}>
        {/* Work Overview Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-chart-pie-slice"></i> Work Overview
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
                onClick={() => onQuickAction("view_assigned")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-files"></i>
                </div>
                <span>View Assigned Complaints</span>
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

      {/* Row 3: Recent Assigned Complaints & Performance Snapshot */}
      <div className={styles.row_three_grid}>
        {/* Recent Assigned Complaints Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-clock-counter-clockwise"></i> Recent Assigned Complaints
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
                      <div className={styles.tags_row}>
                        <span className={`${styles.priority_pill} ${getPriorityClass(c.priority)}`}>
                          {c.priority}
                        </span>
                        <span className={`${styles.status_badge} ${getStatusClass(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
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
                  <p>No complaints assigned yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Snapshot Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-gauge"></i> Performance Snapshot
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.performance_grid}>
              {performanceCards.map((card) => (
                <div key={card.label} className={styles.performance_card}>
                  <div className={styles.perf_child_header}>
                    <div className={styles.perf_icon_wrapper}>
                      <i className={card.icon}></i>
                    </div>
                    <h4 className={styles.perf_title}>{card.label}</h4>
                  </div>
                  <span className={styles.perf_value}>{card.value}</span>
                  <span className={styles.perf_subtext}>{card.subtext}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboardOverview;
