package com.nagarseva.backend.service;

import com.nagarseva.backend.dto.AdminDashboardResponse;
import com.nagarseva.backend.dto.DepartmentPerformance;
import com.nagarseva.backend.dto.IssueSummary;
import com.nagarseva.backend.dto.WardAnalysis;
import com.nagarseva.backend.dto.CitizenDashboardResponse;
import com.nagarseva.backend.dto.ComplaintOverviewDTO;
import com.nagarseva.backend.dto.RecentComplaintDTO;
import com.nagarseva.backend.dto.RecentUpdateDTO;
import com.nagarseva.backend.dto.WardInsightDTO;
import com.nagarseva.backend.dto.OfficerDashboardResponse;
import com.nagarseva.backend.dto.WorkOverviewDTO;
import com.nagarseva.backend.dto.RecentAssignedComplaintDTO;
import com.nagarseva.backend.dto.WorkQueueDTO;
import com.nagarseva.backend.dto.PerformanceSnapshotDTO;
import com.nagarseva.backend.dto.CouncillorDashboardResponse;
import com.nagarseva.backend.dto.WardSummaryDTO;
import com.nagarseva.backend.entity.Complaint;
import com.nagarseva.backend.entity.ComplaintStatusHistory;
import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.entity.Ward;
import com.nagarseva.backend.enums.Department;
import com.nagarseva.backend.enums.IssueType;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.enums.Status;
import com.nagarseva.backend.enums.Priority;
import com.nagarseva.backend.exception.InvalidUserRoleException;
import com.nagarseva.backend.repository.ComplaintRepository;
import com.nagarseva.backend.repository.UserRepository;
import com.nagarseva.backend.repository.WardRepository;
import com.nagarseva.backend.repository.ComplaintStatusHistoryRepository;
import com.nagarseva.backend.security.CustomUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final WardRepository wardRepository;
    private final ComplaintStatusHistoryRepository complaintStatusHistoryRepository;

    private User fetchAuthenticatedUser() {
        CustomUserDetails user = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        return user.getUser();
    }

    private void validateAdmin(User user) {
        if (!user.getRole().equals(Role.ADMIN)) {
            throw new InvalidUserRoleException("Invalid User! Only Officer are allowed");
        }
    }

    private Department getComplaintDepartment(Complaint complaint) {
        if (complaint.getAssignedTo() != null && complaint.getAssignedTo().getDepartment() != null) {
            return complaint.getAssignedTo().getDepartment();
        }
        if (complaint.getIssueType() != null) {
            switch (complaint.getIssueType()) {
                case WATER:
                    return Department.WATER;
                case ELECTRICITY:
                    return Department.ELECTRICITY;
                case SEWAGE:
                    return Department.DRAINAGE;
                case GARBAGE:
                    return Department.SANITATION;
                default:
                    return Department.OTHER;
            }
        }
        return Department.OTHER;
    }

    public AdminDashboardResponse getAdminDashboardData() {
        User admin = fetchAuthenticatedUser();
        validateAdmin(admin);

        List<Complaint> complaints = complaintRepository.findAll();
        List<Ward> allWards = wardRepository.findAll();

        int totalUsers = (int) (userRepository.countByRole(Role.CITIZEN) 
                             + userRepository.countByRole(Role.OFFICER) 
                             + userRepository.countByRole(Role.COUNCILLOR));

        // 1. Group by IssueType for IssueSummary
        Map<IssueType, Integer> issueCounts = new HashMap<>();
        for (IssueType type : IssueType.values()) {
            issueCounts.put(type, 0);
        }
        for (Complaint c : complaints) {
            if (c.getIssueType() != null) {
                issueCounts.put(c.getIssueType(), issueCounts.get(c.getIssueType()) + 1);
            }
        }
        List<IssueSummary> issueSummaries = new ArrayList<>();
        for (Map.Entry<IssueType, Integer> entry : issueCounts.entrySet()) {
            IssueSummary summary = new IssueSummary();
            summary.setIssueType(entry.getKey());
            summary.setComplaintsCounts(entry.getValue());
            issueSummaries.add(summary);
        }

        // 2. Group by Department for DepartmentPerformance
        Map<Department, DepartmentPerformance> deptPerfMap = new HashMap<>();
        for (Department dept : Department.values()) {
            DepartmentPerformance perf = new DepartmentPerformance();
            perf.setDepartment(dept);
            perf.setActiveCount(0);
            perf.setResolvedCount(0);
            perf.setPendingCount(0);
            deptPerfMap.put(dept, perf);
        }
        for (Complaint c : complaints) {
            Department dept = getComplaintDepartment(c);
            DepartmentPerformance perf = deptPerfMap.get(dept);
            if (perf != null) {
                Status status = c.getStatus();
                if (status == Status.CLOSED || status == Status.AUTO_CLOSED) {
                    perf.setResolvedCount(perf.getResolvedCount() + 1);
                } else if (status == Status.ASSIGNED || status == Status.IN_PROGRESS || status == Status.REOPENED || status == Status.APPROVED) {
                    perf.setActiveCount(perf.getActiveCount() + 1);
                } else {
                    perf.setPendingCount(perf.getPendingCount() + 1);
                }
            }
        }
        List<DepartmentPerformance> departmentPerformances = new ArrayList<>(deptPerfMap.values());

        // 3. Group by Ward for WardAnalysis
        Map<Integer, Integer> wardCounts = new HashMap<>();
        for (Ward w : allWards) {
            wardCounts.put(w.getId(), 0);
        }
        for (Complaint c : complaints) {
            if (c.getWard() != null) {
                int wardId = c.getWard().getId();
                wardCounts.put(wardId, wardCounts.getOrDefault(wardId, 0) + 1);
            }
        }
        List<WardAnalysis> wardAnalyses = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : wardCounts.entrySet()) {
            WardAnalysis wa = new WardAnalysis();
            wa.setWardId(entry.getKey());
            wa.setComplaintCount(entry.getValue());
            wardAnalyses.add(wa);
        }

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setSuccess(true);
        response.setMessage("Admin dashboard data fetched successfully.");
        response.setTotalUsers(totalUsers);
        response.setTotalComplaints(complaints.size());
        response.setTotalWards(allWards.size());
        response.setTotalOfficers((int) userRepository.countByRole(Role.OFFICER));
        response.setIssueSummary(issueSummaries);
        response.setDepartmentPerformance(departmentPerformances);
        response.setWardAnalyses(wardAnalyses);

        return response;
    }

    public CitizenDashboardResponse getCitizenDashboard() {
        User citizen = fetchAuthenticatedUser();
        if (!citizen.getRole().equals(Role.CITIZEN)) {
            throw new InvalidUserRoleException("Invalid User! Only Citizens are allowed");
        }

        Integer citizenId = citizen.getId();

        // 1. KPI Counts
        Long totalComplaints = complaintRepository.countByCreatedById(citizenId);
        
        // Active: CREATED, ASSIGNED, IN_PROGRESS
        Long activeComplaints = complaintRepository.countByCreatedByIdAndStatusIn(
                citizenId, 
                List.of(Status.CREATED, Status.ASSIGNED, Status.IN_PROGRESS)
        );

        // Resolved: CLOSED, AUTO_CLOSED
        Long resolvedComplaints = complaintRepository.countByCreatedByIdAndStatusIn(
                citizenId, 
                List.of(Status.CLOSED, Status.AUTO_CLOSED)
        );

        // Reopened: REOPENED
        Long reopenedComplaints = complaintRepository.countByCreatedByIdAndStatus(citizenId, Status.REOPENED);

        // 2. ComplaintOverviewDTO
        ComplaintOverviewDTO overview = new ComplaintOverviewDTO();
        overview.setActiveCount(activeComplaints);
        overview.setResolvedCount(resolvedComplaints);
        overview.setPendingVerificationCount(complaintRepository.countByCreatedByIdAndStatus(citizenId, Status.PENDING_VERIFICATION));
        overview.setReopenedCount(reopenedComplaints);

        // 3. Recent Complaints: top 4 by citizen ordered by createdAt desc
        List<Complaint> recentComplaintsEntities = complaintRepository.findTop4ByCreatedByIdOrderByCreatedAtDesc(citizenId);
        List<RecentComplaintDTO> recentComplaints = new ArrayList<>();
        for (Complaint c : recentComplaintsEntities) {
            RecentComplaintDTO dto = new RecentComplaintDTO();
            dto.setId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setStatus(c.getStatus());
            dto.setCreatedAt(c.getCreatedAt());
            recentComplaints.add(dto);
        }

        // 4. Recent Updates: top 5 complaint status history for this citizen
        List<ComplaintStatusHistory> recentHistories = complaintStatusHistoryRepository
                .findTop5ByComplaintCreatedByIdOrderByChangedAtDesc(citizenId);
        List<RecentUpdateDTO> recentUpdates = new ArrayList<>();
        for (ComplaintStatusHistory h : recentHistories) {
            RecentUpdateDTO dto = new RecentUpdateDTO();
            dto.setId(h.getId());
            dto.setUpdatedAt(h.getChangedAt());
            
            // Format message based on status
            String msg;
            Integer compId = h.getComplaint().getId();
            Status status = h.getStatus();
            if (status == Status.PENDING_VERIFICATION) {
                msg = "Officer uploaded completion proof for Complaint #" + compId;
            } else if (status == Status.IN_PROGRESS) {
                msg = "Complaint #" + compId + " moved to IN_PROGRESS";
            } else if (status == Status.REOPENED) {
                msg = "Complaint #" + compId + " reopened";
            } else if (status == Status.CREATED) {
                msg = "Complaint #" + compId + " created";
            } else if (status == Status.ASSIGNED) {
                msg = "Complaint #" + compId + " assigned to officer";
            } else if (status == Status.CLOSED || status == Status.AUTO_CLOSED) {
                msg = "Complaint #" + compId + " resolved";
            } else {
                msg = "Complaint #" + compId + " status updated to " + status;
            }
            dto.setMessage(msg);
            recentUpdates.add(dto);
        }

        // 5. WardInsightDTO
        WardInsightDTO wardInsight = new WardInsightDTO();
        Ward ward = citizen.getCitizensWard();
        if (ward != null) {
            wardInsight.setWardId(ward.getId());
            wardInsight.setTotalComplaintsInWard(complaintRepository.countByWardId(ward.getId()));
            
            // Calculate most reported issue in citizen's ward
            List<Complaint> wardComplaints = complaintRepository.findByWard_Id(ward.getId());
            if (wardComplaints != null && !wardComplaints.isEmpty()) {
                Map<IssueType, Long> issueCounts = new HashMap<>();
                for (Complaint c : wardComplaints) {
                    if (c.getIssueType() != null) {
                        issueCounts.put(c.getIssueType(), issueCounts.getOrDefault(c.getIssueType(), 0L) + 1);
                    }
                }
                IssueType mostReported = null;
                long maxCount = -1;
                for (Map.Entry<IssueType, Long> entry : issueCounts.entrySet()) {
                    if (entry.getValue() > maxCount) {
                        maxCount = entry.getValue();
                        mostReported = entry.getKey();
                    }
                }
                if (mostReported != null) {
                    // Turn enum into user friendly name
                    String issueName = mostReported.name();
                    if (issueName.equalsIgnoreCase("WATER")) issueName = "Water Supply";
                    else if (issueName.equalsIgnoreCase("ELECTRICITY")) issueName = "Electricity";
                    else if (issueName.equalsIgnoreCase("SEWAGE")) issueName = "Sewage/Drainage";
                    else if (issueName.equalsIgnoreCase("GARBAGE")) issueName = "Garbage/Sanitation";
                    else issueName = issueName.charAt(0) + issueName.substring(1).toLowerCase();
                    wardInsight.setMostReportedIssue(issueName);
                } else {
                    wardInsight.setMostReportedIssue("None");
                }
            } else {
                wardInsight.setMostReportedIssue("None");
            }
        } else {
            wardInsight.setWardId(null);
            wardInsight.setTotalComplaintsInWard(0L);
            wardInsight.setMostReportedIssue("None");
        }
        wardInsight.setCitizenContributionCount(totalComplaints);

        // 6. Response
        CitizenDashboardResponse response = new CitizenDashboardResponse();
        response.setSuccess(true);
        response.setMessage("Citizen dashboard data fetched successfully.");
        response.setTotalComplaints(totalComplaints);
        response.setActiveComplaints(activeComplaints);
        response.setResolvedComplaints(resolvedComplaints);
        response.setReopenedComplaints(reopenedComplaints);
        response.setComplaintOverview(overview);
        response.setRecentComplaints(recentComplaints);
        response.setRecentUpdates(recentUpdates);
        response.setWardInsight(wardInsight);

        return response;
    }

    public OfficerDashboardResponse getOfficerDashboard() {
        User officer = fetchAuthenticatedUser();
        if (!officer.getRole().equals(Role.OFFICER)) {
            throw new InvalidUserRoleException("Invalid User! Only Officers are allowed");
        }

        Integer officerId = officer.getId();

        // 1. KPI Counts
        Long totalAssigned = complaintRepository.countByAssignedToId(officerId);
        Long activeComplaints = complaintRepository.countByAssignedToIdAndStatusIn(
                officerId,
                List.of(Status.ASSIGNED, Status.IN_PROGRESS)
        );
        Long pendingVerification = complaintRepository.countByAssignedToIdAndStatus(officerId, Status.PENDING_VERIFICATION);
        Long resolvedCount = complaintRepository.countByAssignedToIdAndStatusIn(
                officerId,
                List.of(Status.CLOSED, Status.AUTO_CLOSED)
        );

        // 2. WorkOverviewDTO
        WorkOverviewDTO overview = new WorkOverviewDTO();
        overview.setAssignedCount(complaintRepository.countByAssignedToIdAndStatus(officerId, Status.ASSIGNED));
        overview.setInProgressCount(complaintRepository.countByAssignedToIdAndStatus(officerId, Status.IN_PROGRESS));
        overview.setPendingVerificationCount(pendingVerification);
        overview.setResolvedCount(resolvedCount);

        // 3. Recent Assigned Complaints: top 4 ordered by createdAt desc
        List<Complaint> recentAssigned = complaintRepository.findTop4ByAssignedToIdOrderByCreatedAtDesc(officerId);
        List<RecentAssignedComplaintDTO> recentComplaints = new ArrayList<>();
        for (Complaint c : recentAssigned) {
            RecentAssignedComplaintDTO dto = new RecentAssignedComplaintDTO();
            dto.setId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setPriority(c.getPriority() != null ? c.getPriority() : Priority.MEDIUM);
            dto.setStatus(c.getStatus());
            dto.setCreatedAt(c.getCreatedAt());
            recentComplaints.add(dto);
        }

        // 4. Performance Calculations (Simplified)
        long resolvedThisMonth = resolvedCount;
        double avgResolutionTime = 0.0;

        String deptName = "N/A";
        if (officer.getDepartment() != null) {
            String rawDept = officer.getDepartment().name();
            deptName = rawDept.charAt(0) + rawDept.substring(1).toLowerCase();
        }

        double completionRate = totalAssigned > 0 ? ((double) resolvedCount * 100.0) / totalAssigned : 0.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        // 5. Response
        OfficerDashboardResponse response = new OfficerDashboardResponse();
        response.setSuccess(true);
        response.setMessage("Officer dashboard data fetched successfully.");
        response.setAssignedComplaints(totalAssigned);
        response.setActiveComplaints(activeComplaints);
        response.setPendingVerificationComplaints(pendingVerification);
        response.setResolvedComplaints(resolvedCount);
        response.setWorkOverview(overview);
        response.setRecentComplaints(recentComplaints);
        response.setResolvedThisMonth(resolvedThisMonth);
        response.setAverageResolutionDays(avgResolutionTime);
        response.setDepartment(deptName);
        response.setCompletionRate(completionRate);

        return response;
    }

    public CouncillorDashboardResponse getCouncillorDashboard() {
        User councillor = fetchAuthenticatedUser();
        if (!councillor.getRole().equals(Role.COUNCILLOR)) {
            throw new InvalidUserRoleException("Invalid User! Only Councillors are allowed");
        }

        Ward ward = councillor.getCouncillorWard();

        CouncillorDashboardResponse response = new CouncillorDashboardResponse();
        response.setSuccess(true);
        response.setMessage("Councillor dashboard data fetched successfully.");

        if (ward == null) {
            response.setTotalComplaints(0L);
            response.setActiveComplaints(0L);
            response.setResolvedComplaints(0L);
            response.setReopenedComplaints(0L);

            ComplaintOverviewDTO overview = new ComplaintOverviewDTO();
            overview.setActiveCount(0L);
            overview.setResolvedCount(0L);
            overview.setPendingVerificationCount(0L);
            overview.setReopenedCount(0L);
            response.setComplaintOverview(overview);

            response.setRecentComplaints(new ArrayList<>());



            WardSummaryDTO summary = new WardSummaryDTO();
            summary.setWardName("N/A");
            summary.setWardId(null);
            summary.setAssignedOfficersCount(0L);
            response.setWardSummary(summary);

            return response;
        }

        Integer wardId = ward.getId();

        // 1. KPI Counts
        Long totalComplaints = complaintRepository.countByWardId(wardId);
        Long activeComplaints = complaintRepository.countByWardIdAndStatusIn(
                wardId,
                List.of(Status.CREATED, Status.ASSIGNED, Status.IN_PROGRESS)
        );
        Long resolvedComplaints = complaintRepository.countByWardIdAndStatusIn(
                wardId,
                List.of(Status.CLOSED, Status.AUTO_CLOSED)
        );
        Long reopenedComplaints = complaintRepository.countByWardIdAndStatus(wardId, Status.REOPENED);

        response.setTotalComplaints(totalComplaints);
        response.setActiveComplaints(activeComplaints);
        response.setResolvedComplaints(resolvedComplaints);
        response.setReopenedComplaints(reopenedComplaints);

        // 2. ComplaintOverviewDTO
        ComplaintOverviewDTO overview = new ComplaintOverviewDTO();
        overview.setActiveCount(activeComplaints);
        overview.setResolvedCount(resolvedComplaints);
        overview.setPendingVerificationCount(complaintRepository.countByWardIdAndStatus(wardId, Status.PENDING_VERIFICATION));
        overview.setReopenedCount(reopenedComplaints);
        response.setComplaintOverview(overview);

        // 3. Recent Complaints: top 4 ordered by createdAt desc
        List<Complaint> recentComplaintsEntities = complaintRepository.findTop4ByWardIdOrderByCreatedAtDesc(wardId);
        List<RecentComplaintDTO> recentComplaints = new ArrayList<>();
        for (Complaint c : recentComplaintsEntities) {
            RecentComplaintDTO dto = new RecentComplaintDTO();
            dto.setId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setStatus(c.getStatus());
            dto.setCreatedAt(c.getCreatedAt());
            recentComplaints.add(dto);
        }
        response.setRecentComplaints(recentComplaints);



        // 5. WardSummaryDTO
        WardSummaryDTO wardSummary = new WardSummaryDTO();
        wardSummary.setWardName(ward.getWardName());
        wardSummary.setWardId(wardId);
        wardSummary.setAssignedOfficersCount(complaintRepository.countDistinctOfficersByWardId(wardId));
        response.setWardSummary(wardSummary);

        return response;
    }
}
