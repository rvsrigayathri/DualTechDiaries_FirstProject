package com.dualtechdiaries.resumeapp.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/**
 * Datasource Configuration.
 *
 * Automatically normalizes cloud database connection strings (Render, Railway, Heroku)
 * that use "postgres://" or "postgresql://" into standard JDBC URLs starting with
 * "jdbc:postgresql://", selects "org.postgresql.Driver", and extracts credentials.
 *
 * Preserves local H2 database ("jdbc:h2:...") and its data without modification.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:jdbc:h2:file:./data/resumedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String rawUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:}")
    private String explicitDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        NormalizedDataSourceConfig config = normalize(rawUrl, username, password, explicitDriver);
        log.info("Initializing DataSource with driver [{}] and target URL [{}]",
                config.driverClassName, sanitizeForLog(config.jdbcUrl));

        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(config.jdbcUrl);
        hikariConfig.setDriverClassName(config.driverClassName);

        if (config.username != null && !config.username.isEmpty()) {
            hikariConfig.setUsername(config.username);
        }
        if (config.password != null && !config.password.isEmpty()) {
            hikariConfig.setPassword(config.password);
        }

        // Connection pool settings suitable for cloud and local execution
        hikariConfig.setMaximumPoolSize(5);
        hikariConfig.setMinimumIdle(1);
        hikariConfig.setConnectionTimeout(30000);
        hikariConfig.setIdleTimeout(600000);
        hikariConfig.setMaxLifetime(1800000);

        return new HikariDataSource(hikariConfig);
    }

    /**
     * Normalizes any input URL and credentials into a JDBC-compliant configuration.
     */
    public static NormalizedDataSourceConfig normalize(String rawUrl, String defaultUser, String defaultPassword, String explicitDriver) {
        String url = rawUrl != null ? rawUrl.trim() : "";
        String user = defaultUser != null ? defaultUser.trim() : "";
        String pass = defaultPassword != null ? defaultPassword : "";
        String driver = explicitDriver != null ? explicitDriver.trim() : "";

        // Check if the URL starts with standard cloud URI schemes (postgres:// or postgresql://)
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            driver = "org.postgresql.Driver";
            try {
                // Parse components by substituting scheme with standard http:// for URI parser
                String withoutScheme = url.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = new URI(withoutScheme);

                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath(); // Includes leading '/' e.g. /resumecraft

                // Extract user and password from URI userInfo if present and not explicitly set
                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    String[] parts = userInfo.split(":", 2);
                    String parsedUser = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
                    String parsedPass = parts.length > 1 ? URLDecoder.decode(parts[1], StandardCharsets.UTF_8) : "";

                    if (user.isEmpty() || "sa".equals(user)) {
                        user = parsedUser;
                    }
                    if (pass.isEmpty()) {
                        pass = parsedPass;
                    }
                }

                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                        .append(host)
                        .append(":")
                        .append(port)
                        .append(path);

                if (uri.getQuery() != null && !uri.getQuery().isEmpty()) {
                    jdbcUrl.append("?").append(uri.getQuery());
                }

                return new NormalizedDataSourceConfig(jdbcUrl.toString(), user, pass, driver);
            } catch (Exception e) {
                log.warn("URI parsing failed for cloud URL, applying string fallback: {}", e.getMessage());
                String fallback = url.startsWith("postgres://")
                        ? "jdbc:postgresql://" + url.substring("postgres://".length())
                        : "jdbc:postgresql://" + url.substring("postgresql://".length());
                return new NormalizedDataSourceConfig(fallback, user, pass, driver);
            }
        }

        // Already formatted as JDBC PostgreSQL URL
        if (url.startsWith("jdbc:postgresql:")) {
            if (driver.isEmpty()) {
                driver = "org.postgresql.Driver";
            }
            return new NormalizedDataSourceConfig(url, user, pass, driver);
        }

        // H2 or other JDBC URL (local development / testing)
        if (driver.isEmpty()) {
            if (url.startsWith("jdbc:h2:")) {
                driver = "org.h2.Driver";
            }
        }
        return new NormalizedDataSourceConfig(url, user, pass, driver);
    }

    private static String sanitizeForLog(String url) {
        if (url == null) return "null";
        return url.replaceAll("://[^:@]+:[^@]+@", "://***:***@");
    }

    public static class NormalizedDataSourceConfig {
        public final String jdbcUrl;
        public final String username;
        public final String password;
        public final String driverClassName;

        public NormalizedDataSourceConfig(String jdbcUrl, String username, String password, String driverClassName) {
            this.jdbcUrl = jdbcUrl;
            this.username = username;
            this.password = password;
            this.driverClassName = driverClassName;
        }
    }
}
