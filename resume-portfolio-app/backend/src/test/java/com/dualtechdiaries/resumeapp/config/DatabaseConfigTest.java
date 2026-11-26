package com.dualtechdiaries.resumeapp.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DatabaseConfigTest {

    @Test
    void normalize_renderPostgresUrlWithPortAndCredentials_convertsToValidJdbc() {
        String inputUrl = "postgresql://resumecraft_user:secret_pass_123@dpg-xxxxx-a.oregon-postgres.render.com:5432/resumecraft";

        DatabaseConfig.NormalizedDataSourceConfig config = DatabaseConfig.normalize(
                inputUrl, "sa", "", ""
        );

        assertEquals("jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com:5432/resumecraft", config.jdbcUrl);
        assertEquals("resumecraft_user", config.username);
        assertEquals("secret_pass_123", config.password);
        assertEquals("org.postgresql.Driver", config.driverClassName);
    }

    @Test
    void normalize_postgresSchemeWithoutPortAndWithSsl_convertsToValidJdbcWithDefaultPort() {
        String inputUrl = "postgres://user_neon:pass_neon@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require";

        DatabaseConfig.NormalizedDataSourceConfig config = DatabaseConfig.normalize(
                inputUrl, "", "", ""
        );

        assertEquals("jdbc:postgresql://ep-xyz.us-east-1.aws.neon.tech:5432/neondb?sslmode=require", config.jdbcUrl);
        assertEquals("user_neon", config.username);
        assertEquals("pass_neon", config.password);
        assertEquals("org.postgresql.Driver", config.driverClassName);
    }

    @Test
    void normalize_standardJdbcPostgresUrl_preservesAndSetsDriver() {
        String inputUrl = "jdbc:postgresql://localhost:5432/resumecraft";

        DatabaseConfig.NormalizedDataSourceConfig config = DatabaseConfig.normalize(
                inputUrl, "myuser", "mypass", ""
        );

        assertEquals("jdbc:postgresql://localhost:5432/resumecraft", config.jdbcUrl);
        assertEquals("myuser", config.username);
        assertEquals("mypass", config.password);
        assertEquals("org.postgresql.Driver", config.driverClassName);
    }

    @Test
    void normalize_localH2FileUrl_preservesUrlAndH2Driver() {
        String inputUrl = "jdbc:h2:file:./data/resumedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";

        DatabaseConfig.NormalizedDataSourceConfig config = DatabaseConfig.normalize(
                inputUrl, "sa", "", ""
        );

        assertEquals(inputUrl, config.jdbcUrl);
        assertEquals("sa", config.username);
        assertEquals("", config.password);
        assertEquals("org.h2.Driver", config.driverClassName);
    }

    @Test
    void normalize_inMemoryH2TestUrl_preservesUrlAndH2Driver() {
        String inputUrl = "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1";

        DatabaseConfig.NormalizedDataSourceConfig config = DatabaseConfig.normalize(
                inputUrl, "sa", "", ""
        );

        assertEquals(inputUrl, config.jdbcUrl);
        assertEquals("sa", config.username);
        assertEquals("org.h2.Driver", config.driverClassName);
    }
}
