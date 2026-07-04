import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./dashboardOverview.module.css";

const DashboardOverview = ({
  dashboardData,
}) => {
  const navigate = useNavigate();
  // 1. KPI Cards Data
  const kpiData = [
    {
      id: "users",
      title: "Total Users",
      value: dashboardData ? dashboardData.totalUsers?.toLocaleString() : "1,245",
      subtext: "Citizens + Officers + Councillors",
      icon: "ph ph-users",
      gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconColor: "#2563eb",
    },
    {
      id: "complaints",
      title: "Total Complaints",
      value: dashboardData ? dashboardData.totalComplaints?.toLocaleString() : "842",
      subtext: "Overall complaints registered",
      icon: "ph ph-file-text",
      gradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      iconColor: "#7c3aed",
    },
    {
      id: "wards",
      title: "Total Wards",
      value: dashboardData ? dashboardData.totalWards?.toLocaleString() : "12",
      subtext: "Active wards in system",
      icon: "ph ph-map-trifold",
      gradient: "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)",
      iconColor: "#059669",
    },
    {
      id: "officers",
      title: "Total Officers",
      value: dashboardData ? dashboardData.totalOfficers?.toLocaleString() : "48",
      subtext: "Active officers",
      icon: "ph ph-user-gear",
      gradient: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      iconColor: "#dc2626",
    },
  ];

  // 2. Most Reported Issues Child Items
  const issueTypeMeta = {
    WATER: { label: "Water", icon: "ph ph-drop", color: "#3b82f6", bg: "#dbeafe" },
    ELECTRICITY: { label: "Electricity", icon: "ph ph-lightning", color: "#f59e0b", bg: "#fef3c7" },
    SEWAGE: { label: "Sewage", icon: "ph ph-wrench", color: "#6366f1", bg: "#e0e7ff" },
    GARBAGE: { label: "Garbage/Sanitation", icon: "ph ph-trash", color: "#10b981", bg: "#d1fae5" },
    OTHER: { label: "Other Issues", icon: "ph ph-info", color: "#64748b", bg: "#f1f5f9" }
  };

  const reportedIssues = dashboardData?.issueSummary
    ? dashboardData.issueSummary.map((item) => {
        const meta = issueTypeMeta[item.issueType] || issueTypeMeta.OTHER;
        return {
          id: item.issueType,
          label: meta.label,
          count: item.complaintsCounts || 0,
          icon: meta.icon,
          color: meta.color,
          bg: meta.bg,
        };
      })
    : [
        { id: "roads", label: "Roads", count: 35, icon: "ph ph-road-horizon", color: "#6366f1", bg: "#e0e7ff" },
        { id: "water", label: "Water", count: 22, icon: "ph ph-drop", color: "#3b82f6", bg: "#dbeafe" },
        { id: "electricity", label: "Electricity", count: 14, icon: "ph ph-lightning", color: "#f59e0b", bg: "#fef3c7" },
        { id: "sanitation", label: "Sanitation", count: 8, icon: "ph ph-trash", color: "#10b981", bg: "#d1fae5" },
      ];

  // 3. Department Performance Child Cards
  const deptMeta = {
    SANITATION: { name: "Sanitation Dept", icon: "ph ph-trash" },
    WATER: { name: "Water Department", icon: "ph ph-drop" },
    ELECTRICITY: { name: "Electricity Dept", icon: "ph ph-lightning" },
    ROADS: { name: "Road Department", icon: "ph ph-road-horizon" },
    DRAINAGE: { name: "Drainage Dept", icon: "ph ph-wrench" },
    OTHER: { name: "Other Services", icon: "ph ph-gear" },
  };

  const departments = dashboardData?.departmentPerformance
    ? dashboardData.departmentPerformance.map((item) => {
        const meta = deptMeta[item.department] || deptMeta.OTHER;
        return {
          name: meta.name,
          icon: meta.icon,
          active: item.activeCount || 0,
          resolved: item.resolvedCount || 0,
          pending: item.pendingCount || 0,
        };
      })
    : [
        { name: "Water Department", icon: "ph ph-drop", active: 24, resolved: 148, pending: 8 },
        { name: "Electricity Department", icon: "ph ph-lightning", active: 18, resolved: 112, pending: 4 },
        { name: "Road Department", icon: "ph ph-road-horizon", active: 36, resolved: 89, pending: 15 },
        { name: "Sanitation Department", icon: "ph ph-trash", active: 42, resolved: 201, pending: 9 },
      ];

  // 4. Recent Activity (max 4-5 items)
  const activities = [
    { id: 1, text: "Complaint #124 assigned to Water Dept", time: "2 min ago", icon: "ph ph-wrench", type: "assign" },
    { id: 2, text: "Officer Raj resolved complaint #89", time: "1 hr ago", icon: "ph ph-check-circle", type: "resolve" },
    { id: 3, text: "Ward #6 updated priority level", time: "3 hr ago", icon: "ph ph-warning", type: "update" },
    { id: 4, text: "New citizen user registered in system", time: "5 hr ago", icon: "ph ph-user-plus", type: "user" },
  ];

  // 5. Ward Analysis list
  const wardAnalysis = dashboardData?.wardAnalyses
    ? [...dashboardData.wardAnalyses]
        .sort((a, b) => (b.complaintCount || 0) - (a.complaintCount || 0))
        .map((item, index) => ({
          id: item.wardId,
          name: `Ward ${item.wardId}`,
          complaints: item.complaintCount || 0,
          alert: index === 0 && (item.complaintCount || 0) > 0,
        }))
    : [
        { id: 6, name: "Ward 6", complaints: 29, alert: true },
        { id: 4, name: "Ward 4", complaints: 14, alert: false },
        { id: 2, name: "Ward 2", complaints: 7, alert: false },
      ];

  return (
    <div className={styles.dashboard_container}>
      {/* Row 1: KPI Cards */}
      <div className={styles.kpi_grid}>
        {kpiData.map((kpi) => (
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

      {/* Row 2: Most Reported Issues & Quick Actions */}
      <div className={styles.row_two_grid}>
        {/* Most Reported Issues Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-warning-octagon"></i> Most Reported Issues
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.issues_child_grid}>
              {reportedIssues.map((issue) => (
                <div key={issue.id} className={styles.issue_child_card}>
                  <div
                    className={styles.issue_icon_box}
                    style={{ backgroundColor: issue.bg, color: issue.color }}
                  >
                    <i className={issue.icon}></i>
                  </div>
                  <div className={styles.issue_info}>
                    <span className={styles.issue_label}>{issue.label}</span>
                    <span className={styles.issue_count}>
                      <strong>{issue.count}</strong> complaints
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
                className={`${styles.action_btn} ${styles.action_btn_officer}`}
                onClick={() => navigate("/admin/dashboard?createOfficer=true")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-user-gear"></i>
                </div>
                <span>Create Officer</span>
              </button>

              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_councillor}`}
                onClick={() => navigate("/admin/dashboard?createCouncillor=true")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-users-three"></i>
                </div>
                <span>Create Councillor</span>
              </button>

              <button
                type="button"
                className={`${styles.action_btn} ${styles.action_btn_ward}`}
                onClick={() => navigate("/admin/dashboard?createWard=true")}
              >
                <div className={styles.action_icon_wrapper}>
                  <i className="ph ph-map-trifold"></i>
                </div>
                <span>Create Ward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Department Performance & Ward Analysis */}
      <div className={styles.row_three_grid}>
        {/* Department Performance Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-buildings"></i> Department Performance
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.depts_child_grid}>
              {departments.map((dept) => (
                <div key={dept.name} className={styles.dept_child_card}>
                  <div className={styles.dept_child_header}>
                    <span className={styles.dept_icon_wrapper}>
                      <i className={dept.icon}></i>
                    </span>
                    <h4 className={styles.dept_title}>{dept.name}</h4>
                  </div>
                  <div className={styles.dept_stats_container}>
                    <div className={styles.dept_stat_item}>
                      <span className={styles.dept_stat_val} style={{ color: "#3b82f6" }}>
                        {dept.active}
                      </span>
                      <span className={styles.dept_stat_lbl}>Active</span>
                    </div>
                    <div className={styles.dept_stat_item}>
                      <span className={styles.dept_stat_val} style={{ color: "#10b981" }}>
                        {dept.resolved}
                      </span>
                      <span className={styles.dept_stat_lbl}>Resolved</span>
                    </div>
                    <div className={styles.dept_stat_item}>
                      <span className={styles.dept_stat_val} style={{ color: "#f59e0b" }}>
                        {dept.pending}
                      </span>
                      <span className={styles.dept_stat_lbl}>Pending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ward Analysis Parent Card */}
        <div className={styles.parent_card}>
          <div className={styles.card_header}>
            <h3 className={styles.card_title}>
              <i className="ph ph-map-pin"></i> Ward Analysis
            </h3>
          </div>
          <div className={styles.card_body}>
            <div className={styles.wards_child_list}>
              {wardAnalysis.map((w) => (
                <div
                  key={w.id}
                  className={`${styles.ward_child_item} ${w.alert ? styles.ward_item_alert : ""}`}
                >
                  <div className={styles.ward_info_left}>
                    <i className="ph ph-map-trifold"></i>
                    <span className={styles.ward_name}>{w.name}</span>
                  </div>
                  <div className={styles.ward_info_right}>
                    <span className={styles.ward_complaints_count}>
                      {w.complaints} complaints
                    </span>
                    {w.alert && (
                      <span className={styles.alert_badge}>
                        <i className="ph ph-fire"></i> Most Affected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
