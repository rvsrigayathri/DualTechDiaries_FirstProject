package com.dualtechdiaries.resumeapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

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

    @Test
    void postgreSqlSchemaAndEndpoints_createTableAndPersistResumeSuccessfully() throws Exception {
        // 1. Verify that 'profiles' table exists in the database
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE LOWER(table_name) = 'profiles'",
                Integer.class
        );
        assertTrue(count != null && count > 0, "The 'profiles' table must exist in the PostgreSQL-compatible schema");

        // 2. Test POST /api/resume/save against PostgreSQL schema
        String payload = """
            {
              "fullName": "Elena Rostova",
              "email": "elena.rostova@example.com",
              "desiredRole": "Senior Cloud Architect",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Rostova\\",\\"summary\\":\\"Cloud Native Infrastructure Architect\\"}}"
            }
            """;

        mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").exists());

        // 3. Test GET /api/resume/latest against PostgreSQL schema
        mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Elena Rostova"))
                .andExpect(jsonPath("$.desiredRole").value("Senior Cloud Architect"))
                .andExpect(jsonPath("$.targetTemplate").value("modern_executive"))
                .andExpect(jsonPath("$.resumeJson").value("{\"personal\":{\"fullName\":\"Elena Rostova\",\"summary\":\"Cloud Native Infrastructure Architect\"}}"));
    }
}
