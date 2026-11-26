package com.dualtechdiaries.resumeapp.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:pgcompatibilitydb;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect",
    "spring.jpa.generate-ddl=true",
    "spring.jpa.hibernate.ddl-auto=update"
})
class PostgreSqlIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void postgreSqlSchemaAndEndpoints_createTableAndPersistResumeSuccessfully() throws Exception {
        // 1. Verify that 'profiles' table exists in the database
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE LOWER(table_name) = 'profiles'",
                Integer.class
        );
        assertTrue(count != null && count > 0, "The 'profiles' table must exist in the PostgreSQL-compatible schema");

        // 2. Test POST /api/resume/save against PostgreSQL schema (First save)
        String payload1 = """
            {
              "fullName": "Elena Rostova",
              "email": "elena.rostova@example.com",
              "desiredRole": "Senior Cloud Architect",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Rostova\\",\\"photoUrl\\":\\"data:image/png;base64,iVBORw0KGgo...\\",\\"summary\\":\\"Cloud Native Infrastructure Architect\\"}}"
            }
            """;

        MvcResult result1 = mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        JsonNode json1 = objectMapper.readTree(result1.getResponse().getContentAsString());
        long assignedId = json1.get("id").asLong();

        // 3. Second save updates the existing record, keeping assignedId
        String payload2 = String.format("""
            {
              "id": %d,
              "fullName": "Elena Rostova",
              "email": "elena.rostova@example.com",
              "desiredRole": "Principal Cloud Architect",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Rostova\\",\\"photoUrl\\":\\"data:image/png;base64,iVBORw0KGgo...\\",\\"summary\\":\\"Enterprise Cloud Leader\\"}}"
            }
            """, assignedId);

        mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").value(assignedId));

        // 4. Verify total rows in PostgreSQL remains 1
        Integer totalRows = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM profiles",
                Integer.class
        );
        assertEquals(1, totalRows, "Profiles table must have exactly 1 record after updating existing resume");

        // 5. Test GET /api/resume/latest against PostgreSQL schema
        MvcResult latestResult = mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(assignedId))
                .andExpect(jsonPath("$.fullName").value("Elena Rostova"))
                .andExpect(jsonPath("$.desiredRole").value("Principal Cloud Architect"))
                .andExpect(jsonPath("$.targetTemplate").value("modern_executive"))
                .andReturn();

        JsonNode latestJson = objectMapper.readTree(latestResult.getResponse().getContentAsString());
        String resumeJsonStr = latestJson.get("resumeJson").asText();
        assertTrue(resumeJsonStr.contains("data:image/png;base64"), "Photo URL data must be preserved in resumeJson");
    }
}
