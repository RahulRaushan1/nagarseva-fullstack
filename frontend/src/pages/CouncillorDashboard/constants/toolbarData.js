export const getToolbarData = () => [
  {
    heading: "Dashboard",
    placeholder: "",
    buttonPlaceholder: null,
    filters: [],
  },
  {
    heading: "Ward Complaints",
    placeholder: "Search complaints...",
    buttonPlaceholder: null,
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
