import React from "react";
import styles from "./Feature.module.css";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const featureData = [
    {
      emoji: "📍",
      title: "Report Civic Problems",
      description:
        "Citizens can easily submit complaints with descriptions, categories, and supporting images.",
      categories: ["Potholes", "Garbage", "Water"],
      type: "categories",
    },
    {
      emoji: "📊",
      title: "Real-Time Tracking",
      description:
        "Track every stage of complaint resolution with transparent live status updates.",
      categories: ["Created", "In Progress", "Closed"],
      type: "track",
    },
    {
      emoji: "🏛️",
      title: "Smart Ward Routing",
      description:
        "Complaints are automatically assigned to the responsible ward authorities.",
      categories: ["Citizen", "Ward", "Officer"],
      type: "ward",
    },
    {
      emoji: "👥",
      title: "Role-Based Access",
      description:
        "Separate dashboards and permissions for citizens, officers, and administrators.",
      categories: ["Citizen", "Officer", "Admin", "Councillor"],
      type: "roles",
    },
    {
      emoji: "🔔",
      title: "Insights & Notifications",
      description:
        "Receive complaint updates while authorities monitor trends and resolution performance.",
      type: "notification",
    },
    {
      emoji: "🔔",
      title: "Transparent Complaint Lifecycle",
      description:
        "Receive complaint updates while authorities monitor trends and resolution performance.",
      type: "lifecycle",
    },
  ];

  return (
    <section className={styles.features_section}>
      <div className={styles.features_header}>
        <p className={styles.features_tag}>Platform Features</p>

        <h2 className={styles.features_title}>
          Designed For Smarter Civic Management
        </h2>

        <p className={styles.features_description}>
          NagarSeva simplifies complaint resolution through transparent
          workflows, real-time tracking, and role-based civic management.
        </p>
      </div>

      <div className={styles.features_grid}>
        {featureData.map((feature, idx) => (
          <>
            <FeatureCard
              key={idx}
              logo={feature.emoji}
              title={feature.title}
              description={feature.description}
              categories={feature.categories}
            >
              {feature.type === "categories" && (
                <div className={styles.category_tags}>
                  <span>Potholes</span>
                  <span>Garbage</span>
                  <span>Water</span>
                </div>
              )}

              {feature.type === "track" && (
                <div className={styles.status_preview}>
                  <span className={`${styles.status_chip} ${styles.created}`}>Created</span>

                  <span className={`${styles.status_chip} ${styles.progress}`}>In Progress</span>

                  <span className={`${styles.status_chip} ${styles.resolved}`}>Closed</span>
                </div>
              )}

              {feature.type === "ward" && (
                <div className={styles.routing_flow}>
                  <span>Citizen</span>

                  <div className={styles.flow_line}></div>

                  <span>Ward</span>

                  <div className={styles.flow_line}></div>

                  <span>Officer</span>
                </div>
              )}

              {feature.type === "roles" && (
                <>
                  <div className={styles.roles}>
                    <div className={styles.role_pill}>Citizen</div>

                    <div className={styles.role_pill}>Officer</div>

                    <div className={styles.role_pill}>Admin</div>

                    <div className={styles.role_pill}>Councillor</div>
                  </div>
                </>
              )}
              {feature.type === "notification" && (
                <div className={styles.mini_bars}>
                  <div className={`${styles.mini_bar} ${styles.small}`}></div>
                  <div className={`${styles.mini_bar} ${styles.medium}`}></div>
                  <div className={`${styles.mini_bar} ${styles.active}`}></div>
                  <div className={`${styles.mini_bar} ${styles.medium}`}></div>
                </div>
              )}
              {feature.type === "lifecycle" && (
                <div className={styles.timeline_horizontal}>
                  <div className={`${styles.timeline_step} ${styles.completed}`}>
                    <div className={styles.timeline_dot}></div>
                    <span>Created</span>
                  </div>

                  <div className={`${styles.timeline_step} ${styles.completed}`}>
                    <div className={styles.timeline_dot}></div>
                    <span>Assigned</span>
                  </div>

                  <div className={`${styles.timeline_step} ${styles.active}`}>
                    <div className={styles.timeline_dot}></div>
                    <span>In Progress</span>
                  </div>

                  <div className={styles.timeline_step}>
                    <div className={styles.timeline_dot}></div>
                    <span>Verified</span>
                  </div>
                </div>
              )}
            </FeatureCard>
          </>
        ))}
      </div>
    </section>
  );
};

export default Features;
