package com.nagarseva.backend.exception;

import com.nagarseva.backend.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleLogin_RegisterValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(err.getField(), err.getDefaultMessage())
        );

        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Validation failed");

        if (errors.get("issueType") != null && errors.get("issueType").contains("Failed to convert property value of type 'java.lang.String")) {
            errors.put("issueType", "Kindly Select Issues From [ WATER, ELECTRICITY, SEWAGE, GARBAGE, OTHER ]");
        }

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyTaken(UserAlreadyExistsException ex) {

        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Account cannot be created");
        resp.setCode("EMAIL_ALREADY_EXISTS");

        Map<String, String> errors = new HashMap<>();
        errors.put("email",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {

        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Invalid Credentials");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handlePasswordUpdation(InvalidPasswordException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(InvalidUserCreationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserCreation(InvalidUserCreationException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Account Creation Failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("Role",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleEmptyRoleSelection(HttpMessageNotReadableException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Validation failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("role","Role is empty or invalid");

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Ward Creation Failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("councillorId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }

    @ExceptionHandler(WardCouncillorRoleMismatchException.class)
    public ResponseEntity<ErrorResponse> handleWardCouncillorRoleMismatch(WardCouncillorRoleMismatchException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Ward Creation Failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("councillorId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }
    @ExceptionHandler(WardAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleWardCouncillorRoleMismatch(WardAlreadyExistsException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Ward Creation Failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("wardName",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
    }

    @ExceptionHandler(InvalidWardException.class)
    public ResponseEntity<ErrorResponse> handleInvalidWard(InvalidWardException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Account Creation Failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("wardId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(CouncillorAlreadyAssignedException.class)
    public ResponseEntity<ErrorResponse> handleInvalidWard(CouncillorAlreadyAssignedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Ward creation failed");
        resp.setCode("COUNCILLOR_ALREADY_EXISTS");

        Map<String, String> errors = new HashMap<>();
        errors.put("councillorId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleImageUploadFailure(FileUploadException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintNotExistException.class)
    public ResponseEntity<ErrorResponse> handleInvalidComplaint(ComplaintNotExistException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Complaint not found");

        Map<String, String> errors = new HashMap<>();
        errors.put("complaintId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }

    @ExceptionHandler(UserMismatchException.class)
    public ResponseEntity<ErrorResponse> handleInvalidComplaint(UserMismatchException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("You are not allowed to access this complaint");

        Map<String, String> errors = new HashMap<>();
        errors.put("userId",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resp);
    }

    @ExceptionHandler(NoFieldProvidedException.class)
    public ResponseEntity<ErrorResponse> handleUpdateComplaintInvalidInput(NoFieldProvidedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintModificationForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleUpdateComplaintAlreadyVerified(ComplaintModificationForbiddenException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ImageDeletionFailedException.class)
    public ResponseEntity<ErrorResponse> handleImageDeletionWhileUpdatingComplaint(ImageDeletionFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(InvalidUserRoleException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserRole(InvalidUserRoleException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserRole(MethodArgumentTypeMismatchException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Invalid issue type or status provided in request URL.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(MissingDepartmentException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserRole(MissingDepartmentException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Account creation failed");

        Map<String, String> errors = new HashMap<>();
        errors.put("department",ex.getMessage());

        resp.setErrors(errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(EmptyFileUploadException.class)
    public ResponseEntity<ErrorResponse> handleEmptyFileUpload(EmptyFileUploadException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Image upload fails " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(UnsupportedFileTypeException.class)
    public ResponseEntity<ErrorResponse> handleUnsupportedFileUpload(UnsupportedFileTypeException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Image upload fails " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ImageSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleLargeImageUpload(ImageSizeExceededException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Image upload fails " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintNotAssignedToOfficerException.class)
    public ResponseEntity<ErrorResponse> handleComplaintNotAssignedToOfficer(ComplaintNotAssignedToOfficerException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(OfficerMismatchException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOfficer(OfficerMismatchException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintStatusMismatchException.class)
    public ResponseEntity<ErrorResponse> handleComplaintMismatch(ComplaintStatusMismatchException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage("Complaint already marked as done "+ ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    // Though, this will be handled by our image validator only, but still keeping it so that app doesn't crashes silently.
    @ExceptionHandler(ComplaintCompletionImagesMissingException.class)
    public ResponseEntity<ErrorResponse> handleCompletionImagesMissing(ComplaintCompletionImagesMissingException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(MaxImageUploadExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxImageUploadExceeded(MaxImageUploadExceededException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("IMAGE_UPLOAD_LIMIT_EXCEEDED");
        resp.setMessage("Image upload fails " + ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintCreationFailedException.class)
    public ResponseEntity<ErrorResponse> handleMaxImageUploadExceeded(ComplaintCreationFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintSubmissionFailedException.class)
    public ResponseEntity<ErrorResponse> handleComplaintSubmissionFailed(ComplaintSubmissionFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintRejectionFailedException.class)
    public ResponseEntity<ErrorResponse> handleComplaintRejectiomFailed(ComplaintRejectionFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(InvalidFlowTransitionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidFlowTransition(InvalidFlowTransitionException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintAlreadyVerifiedException.class)
    public ResponseEntity<ErrorResponse> handleComplaintAlreadyVerified(ComplaintAlreadyVerifiedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintAssignmentFailedException.class)
    public ResponseEntity<ErrorResponse> handleComplaintAssignmentFailed(ComplaintAssignmentFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("COMPLAINT_NOT_APPROVED");
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintApprovalFailedException.class)
    public ResponseEntity<ErrorResponse> handleComplaintApprovalFailed(ComplaintApprovalFailedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(OTPRequestTooFrequentException.class)
    public ResponseEntity<ErrorResponse> handleOTPGenerationFailed(OTPRequestTooFrequentException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidEmailForResetPassword(ConstraintViolationException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage().substring(15));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(OTPInvalidException.class)
    public ResponseEntity<ErrorResponse> handleOTPInvalid(OTPInvalidException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(OTPExpiredException.class)
    public ResponseEntity<ErrorResponse> handleOTPExpired(OTPExpiredException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ResetPasswordWindowExceededException.class)
    public ResponseEntity<ErrorResponse> handleResetPasswordWindowExceeded(ResetPasswordWindowExceededException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(OTPNotGeneratedException.class)
    public ResponseEntity<ErrorResponse> handleOTPNotGenerated(OTPNotGeneratedException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(MissingWardException.class)
    public ResponseEntity<ErrorResponse> handleMissingWard(MissingWardException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(WardAlreadyAssignedToDifferentCouncillorException.class)
    public ResponseEntity<ErrorResponse> handleWardAlreadyAssignedToDifferentCouncillor(WardAlreadyAssignedToDifferentCouncillorException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("COUNCILLOR_ALREADY_EXISTS");
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(ComplaintPriorityChangeForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleComplaintPriorityChangeForbidden(ComplaintPriorityChangeForbiddenException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("INVALID_OFFICER_DEPARTMENT");
        resp.setMessage("Bad data");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }

    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<ErrorResponse> handleAccountDisabled(AccountDisabledException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("ACCOUNT_DISABLED");
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resp);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("INVALID_CREDENTIALS");
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
    }

    @ExceptionHandler(InsufficentLocationDetailsException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(InsufficentLocationDetailsException ex) {
        ErrorResponse resp = new ErrorResponse();
        resp.setSuccess(false);
        resp.setCode("INSUFFICENT_LOCATION_DETAILS");
        resp.setMessage(ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }



















}
