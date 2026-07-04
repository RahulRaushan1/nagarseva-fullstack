package com.nagarseva.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nagarseva.backend.enums.IssueType;
import com.nagarseva.backend.enums.Priority;
import com.nagarseva.backend.enums.Role;
import com.nagarseva.backend.enums.Status;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${mail.sender}")
    String senderEmail;

    @Value("${brevo.api.key}")
    String brevoApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);
        return headers;
    }

    private String createEmailBody(
            String toEmail,
            String subject,
            String htmlContent
    ) throws JsonProcessingException {
        return """
                {
                  "sender": {
                    "name": "NagarSeva",
                    "email": "%s"
                  },
                  "to": [
                    {
                      "email": "%s"
                    }
                  ],
                  "subject": %s,
                  "htmlContent": %s
                }
                """.formatted(
                senderEmail,
                toEmail,
                objectMapper.writeValueAsString(subject),
                objectMapper.writeValueAsString(htmlContent)
        );
    }

    @Async
    public void sendRegistrationSuccessEmail(String name, String email) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/register.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);

            String body = createEmailBody(
                    email,
                    "✅ Welcome to Nagarseva – Registration Successful!",
                    htmlContent
            );


            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintApprovedEmail(String name, String email, Integer complaintId, IssueType issueType, Integer wardId, Status status) {

        try {
            ClassPathResource resource = new ClassPathResource("templates/approved.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{status}}",status.name());

            String body = createEmailBody(
                    email,
                    "✅ Your Complaint Has Been Approved – Nagarseva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );


        }  catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintDisapprovedEmail(String name, String email, Integer complaintId, IssueType issueType, Integer wardId, Status status) {

        try {
            ClassPathResource resource = new ClassPathResource("templates/rejected.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{status}}",status.name());

            String body = createEmailBody(
                    email,
                    "❌ Your Complaint Has Been Rejected – Nagarseva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintPendingVerificationEmail(String name, String email, Integer complaintId, IssueType issueType, Integer wardId, Status status) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/pendingverification.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{status}}",status.name());

            String body = createEmailBody(
                    email,
                    "✅ Complaint Work Completed • Verification Pending – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintAutoClosedEmail(String name, String email, Integer complaintId, IssueType issueType, Integer wardId, Status status) {

        try {
            ClassPathResource resource = new ClassPathResource("templates/autoclosed.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{status}}",status.name());

            String body = createEmailBody(
                    email,
                    "⏳ Complaint Automatically Closed – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        }  catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintReopenedEmail(String name, String email, Integer complaintId, IssueType issueType, Integer wardId, Status status) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/reopened.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}", name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{status}}",status.name());

            String body = createEmailBody(
                    email,
                    "🔄 Complaint Reopened for Further Action – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendOTPGenerationEmail(String resetOtp, String email) {
        try {

            ClassPathResource resource = new ClassPathResource("templates/forgotpassword.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{otp}}",resetOtp);

            String body = createEmailBody(
                    email,
                    "🔐 Password Reset Verification Code – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendPasswordChangedConfirmationEmail(String name, String email, LocalDateTime current) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/passwordchanged.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}",name);
            htmlContent = htmlContent.replace("{{changedDate}}",current.toLocalDate().toString());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

            htmlContent = htmlContent.replace("{{changedTime}}",current.toLocalTime().format(formatter));

            String body = createEmailBody(
                    email,
                    "✅ Your Password Has Been Changed – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendOfficialRegistrationSuccessEmail(String name, String email, Role role, String password) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/registerbyadmin.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{name}}",name);

            String role1 = "";
            if (role.equals(Role.COUNCILLOR)) role1 = "Ward " + role.name();
            if (role.equals(Role.OFFICER)) role1 = "Municipal " + role.name();
            if (role.equals(Role.ADMIN)) role1 = "Municipal Administrator";

            htmlContent = htmlContent.replace("{{role}}", role1);
            htmlContent = htmlContent.replace("{{email}}", email);
            htmlContent = htmlContent.replace("{{tempPass}}", password);


            String body = createEmailBody(
                    email,
                    "✅ Welcome to NagarSeva – Your Account Is Ready",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintAssignedEmail(String name, Integer complaintId, IssueType issueType, Integer wardId, Priority priority, LocalDateTime lastUpdatedAt, String email) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/assigned.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{officerName}}",name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace("{{priorityClass}}",priority.name().toLowerCase());
            htmlContent = htmlContent.replace("{{priority}}",priority.name());
            htmlContent = htmlContent.replace("{{date}}",lastUpdatedAt.toLocalDate().toString());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

            htmlContent = htmlContent.replace("{{time}}",lastUpdatedAt.format(formatter));

            String body = createEmailBody(
                    email,
                    "📌 New Complaint Assigned To You – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendComplaintPriorityUpdateEmail(String name, Integer complaintId, IssueType issueType, Integer wardId, Priority prevPriority, Priority newPriority, LocalDateTime lastUpdatedAt, String email) {

        try {

            ClassPathResource resource = new ClassPathResource("templates/priority.html");

            String htmlContent = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            htmlContent = htmlContent.replace("{{officerName}}",name);
            htmlContent = htmlContent.replace("{{complaintId}}",complaintId+"");
            htmlContent = htmlContent.replace("{{issueType}}",issueType.name());
            htmlContent = htmlContent.replace("{{wardNo}}",wardId+"");
            htmlContent = htmlContent.replace(" {{prevPriority}}",prevPriority.name());
            htmlContent = htmlContent.replace("{{prevPriorityClass}}",prevPriority.name().toLowerCase());
            htmlContent = htmlContent.replace(" {{newPriority}}",newPriority.name());
            htmlContent = htmlContent.replace("{{newPriorityClass}}",newPriority.name().toLowerCase());

            htmlContent = htmlContent.replace("{{date}}",lastUpdatedAt.toLocalDate().toString());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");

            htmlContent = htmlContent.replace("{{time}}",lastUpdatedAt.format(formatter));

            String body = createEmailBody(
                    email,
                    "⚠️ Complaint Priority Updated – NagarSeva",
                    htmlContent
            );

            HttpEntity<String> request =
                    new HttpEntity<>(body, createHeaders());

            restTemplate.postForEntity(
                    BREVO_API_URL,
                    request,
                    String.class
            );

        }  catch (IOException e) {
            e.printStackTrace();
        }
    }
}
