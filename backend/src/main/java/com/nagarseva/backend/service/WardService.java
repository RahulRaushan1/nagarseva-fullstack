package com.nagarseva.backend.service;

import com.nagarseva.backend.dto.*;
import com.nagarseva.backend.entity.User;
import com.nagarseva.backend.entity.Ward;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.exception.*;
import com.nagarseva.backend.repository.UserRepository;
import com.nagarseva.backend.repository.WardRepository;
import com.nagarseva.backend.security.CustomUserDetails;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class WardService {

    private WardRepository wardRepository;
    private UserRepository userRepository;

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

    private void validateCouncillor(User user) {
        if (!user.getRole().equals(Role.COUNCILLOR)) {
            throw new InvalidUserRoleException("Invalid User! Only Ward Councillor are allowed");
        }
    }

    public RegisterWardResponse addNewWard(RegisterWardRequest registerWardRequest) {

        if (wardRepository.existsById(registerWardRequest.getWardId())) {
            throw new WardAlreadyExistsException("Ward already exists. Please use a unique ward name or ID.");
        }

        User user = fetchAuthenticatedUser();

        validateAdmin(user);

        Ward ward = new Ward();
        ward.setId(registerWardRequest.getWardId());
        ward.setWardName(registerWardRequest.getWardName());

        Ward savedWard = wardRepository.save(ward);

        RegisterWardResponse response = new RegisterWardResponse();
        response.setSuccess(true);
        response.setWardId(savedWard.getId());
        response.setMessage("Ward created successfully.");

        return response;
    }

    public WardCouncillorAssignResponse setWardCouncillor(int wardId, int councillorId) {
        User admin = fetchAuthenticatedUser();

        Ward ward = wardRepository.findById(wardId).orElseThrow(
                () -> new InvalidWardException("No ward exists with this id")
        );

        User user = userRepository.findById(councillorId).orElseThrow(
                () -> new UserNotFoundException("No User found with this id")
        );

        validateAdmin(admin);
        validateCouncillor(user);

        if (wardRepository.existsByCouncillor_Id(councillorId)) {
            throw new CouncillorAlreadyAssignedException("Councillor already assigned to different ward");
        }

        ward.setCouncillor(user);

        Ward savedWard = wardRepository.save(ward);

        WardCouncillorAssignResponse response = new WardCouncillorAssignResponse();
        response.setSuccess(true);
        response.setMessage("Councillor added successfully");
        response.setWardId(savedWard.getId());
        response.setCouncillorName(savedWard.getCouncillor().getFullName());

        return response;
    }

    public WardFetchResponse getWardDetails() {
        List<Ward> allWardsList = wardRepository.findAllByOrderByIdAsc();

        if (allWardsList.isEmpty()) {
            System.out.println("No ward exists");
        }

        List<WardResponseData> allWardData = new ArrayList<>();

        for (Ward ward : allWardsList) {
            WardResponseData wardResponseData = new WardResponseData();
            wardResponseData.setWardId(ward.getId());
            wardResponseData.setWardName(ward.getWardName());
            if (ward.getCouncillor() != null) wardResponseData.setWardCouncillor(ward.getCouncillor().getFullName());

            allWardData.add(wardResponseData);
        }

        WardFetchResponse response = new WardFetchResponse();
        response.setSuccess(true);
        response.setMessage("Ward fetched successfully");
        response.setWards(allWardData);
        return response;
    }

    public UpdateWardResponse updateWard(Integer wardId, String wardName) {
        User admin = fetchAuthenticatedUser();

        validateAdmin(admin);

        Ward ward = wardRepository.findById(wardId).orElseThrow(
                () -> new InvalidWardException("No Ward Exists with this ID")
        );

        ward.setWardName(wardName);

        Ward updatedWard = wardRepository.save(ward);

        UpdateWardResponse response = new UpdateWardResponse();
        response.setSuccess(true);
        response.setMessage("Ward details updated successfully");
        response.setWardId(updatedWard.getId());

        return response;

    }

    public WardFetchResponse getWardDetailsByKeyword(String keyword) {
        User admin = fetchAuthenticatedUser();

        validateAdmin(admin);

        if (keyword == null || keyword.isBlank()) {
            WardFetchResponse wardFetchResponse = new WardFetchResponse();
            wardFetchResponse.setSuccess(true);
            wardFetchResponse.setMessage("Ward fetched successfully");
            wardFetchResponse.setWards(new ArrayList<>());

            return wardFetchResponse;
        }

        Integer wardId = null;
        try {
            wardId = Integer.parseInt(keyword);
        } catch (NumberFormatException e) {

        }

        List<Ward> wardsList = wardRepository.findAllWardsByKeyword(keyword,wardId);

        List<WardResponseData> wardResponseDataList = new ArrayList<>();

        for (Ward ward: wardsList) {
            WardResponseData wardResponseData = new WardResponseData();
            wardResponseData.setWardId(ward.getId());
            wardResponseData.setWardName(ward.getWardName());
            wardResponseData.setWardCouncillor(ward.getCouncillor().getFullName());

            wardResponseDataList.add(wardResponseData);
        }

        WardFetchResponse wardFetchResponse = new WardFetchResponse();
        wardFetchResponse.setSuccess(true);
        wardFetchResponse.setMessage("Ward fetched successfully");
        wardFetchResponse.setWards(wardResponseDataList);

        return wardFetchResponse;
    }
}
