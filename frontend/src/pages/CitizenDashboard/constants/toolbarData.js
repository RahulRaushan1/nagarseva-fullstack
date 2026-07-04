export const getToolbarData = (ward) => [
  {
    heading: "Dashboard",
    placeholder: "",
    buttonPlaceholder: null,
    filters: [],
  },
  {
    heading: "My Complaints",
    placeholder: "Search complaints...",
    buttonPlaceholder: ["Complaint"],
    filters: [
      {
        filterBy: "status",
        values: [
          "",
          "CREATED",
          "APPROVED",
          "ASSIGNED",
          "IN_PROGRESS",
          "PENDING_VERIFICATION",
          "CLOSED",
          "AUTO_CLOSED",
          "REOPENED",
          "REJECTED",
        ],
      },
      {
        filterBy: "issueType",
        values: [
          "",
          "WATER",
          "ELECTRICITY",
          "SEWAGE",
          "GARBAGE",
          "OTHER"
        ],
      },
    ],
  },
  {
    heading: "Profile",
    placeholder: "",
    buttonPlaceholder: null,
    filters: [],
  },
  {
    heading: "Logout",
    placeholder: "",
    buttonPlaceholder: null,
    filters: [],
  },
];
