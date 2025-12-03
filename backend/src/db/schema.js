import { getPool } from "./pool.js";
import { logger } from "../logger.js";

const createTableStatements = [
  `CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(64) NOT NULL UNIQUE,
      description VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) NOT NULL PRIMARY KEY,
      email VARCHAR(160) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(160) NOT NULL,
      role_id INT NOT NULL,
      status ENUM('ACTIVE','DISABLED','INVITE_PENDING') DEFAULT 'ACTIVE',
      last_login_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
      id CHAR(36) NOT NULL PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      token VARCHAR(512) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_refresh_user (user_id),
      CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS airports (
      id CHAR(36) NOT NULL PRIMARY KEY,
      iata_code VARCHAR(8),
      icao_code VARCHAR(8),
      name VARCHAR(160) NOT NULL,
      city VARCHAR(120),
      country VARCHAR(120),
      timezone VARCHAR(64),
      latitude DECIMAL(10,6),
      longitude DECIMAL(10,6),
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_airport_codes (iata_code, icao_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS aircraft_types (
      id CHAR(36) NOT NULL PRIMARY KEY,
      manufacturer VARCHAR(120) NOT NULL,
      model VARCHAR(120) NOT NULL,
      icao_code VARCHAR(8),
      iata_code VARCHAR(8),
      mtow_kg INT NULL,
      typical_crew INT NULL,
      typical_pax INT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_aircraft_codes (icao_code, iata_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS operators (
      id CHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      address TEXT,
      contact_name VARCHAR(120),
      contact_email VARCHAR(160),
      contact_phone VARCHAR(64),
      billing_email VARCHAR(160),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS flights (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_number VARCHAR(24),
      flight_uid CHAR(36) NOT NULL,
      operator_id CHAR(36) NOT NULL,
      aircraft_type_id CHAR(36) NOT NULL,
      aircraft_registration VARCHAR(32),
      mtow_kg INT,
      origin_airport_id CHAR(36) NOT NULL,
      destination_airport_id CHAR(36) NOT NULL,
      departure_date DATE NOT NULL,
      scheduled_departure DATETIME,
      actual_departure DATETIME,
      scheduled_arrival DATETIME,
      actual_arrival DATETIME,
      captain_name VARCHAR(120),
      first_officer_name VARCHAR(120),
      passenger_count INT DEFAULT 0,
      crew_count INT DEFAULT 0,
      status ENUM('PLANNED','READY','IN_PROGRESS','COMPLETED','CANCELLED') DEFAULT 'PLANNED',
      turnaround_status ENUM('NOT_STARTED','IN_PROGRESS','COMPLETE') DEFAULT 'NOT_STARTED',
      purpose ENUM('COMMERCIAL','PRIVATE','CARGO','OTHER') DEFAULT 'PRIVATE',
      remarks TEXT,
      created_by CHAR(36),
      updated_by CHAR(36),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_flights_operator (operator_id),
      INDEX idx_flights_origin (origin_airport_id),
      INDEX idx_flights_destination (destination_airport_id),
      CONSTRAINT fk_flights_operator FOREIGN KEY (operator_id) REFERENCES operators(id),
      CONSTRAINT fk_flights_aircraft FOREIGN KEY (aircraft_type_id) REFERENCES aircraft_types(id),
      CONSTRAINT fk_flights_origin FOREIGN KEY (origin_airport_id) REFERENCES airports(id),
      CONSTRAINT fk_flights_destination FOREIGN KEY (destination_airport_id) REFERENCES airports(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS passengers (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      passenger_uid CHAR(36) NOT NULL,
      first_name VARCHAR(120) NOT NULL,
      last_name VARCHAR(120) NOT NULL,
      gender ENUM('MALE','FEMALE','OTHER') DEFAULT 'OTHER',
      date_of_birth DATE,
      nationality VARCHAR(120),
      passport_number VARCHAR(64),
      passport_country VARCHAR(120),
      passport_expiry DATE,
      visa_number VARCHAR(64),
      email VARCHAR(160),
      phone VARCHAR(64),
      arrival_status ENUM('SCHEDULED','ARRIVED','READY_FOR_BOARDING','ON_BOARD','OFFLOADED') DEFAULT 'SCHEDULED',
      seat_number VARCHAR(16),
      baggage_count INT DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_passengers_flight (flight_id),
      CONSTRAINT fk_passengers_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS crew_members (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      crew_uid CHAR(36) NOT NULL,
      first_name VARCHAR(120) NOT NULL,
      last_name VARCHAR(120) NOT NULL,
      nationality VARCHAR(120),
      position VARCHAR(80),
      duty_type ENUM('OPERATING','DEADHEADING','STANDBY') DEFAULT 'OPERATING',
      license_number VARCHAR(64),
      license_expiry DATE,
      arrival_status ENUM('SCHEDULED','ARRIVED','ON_BOARD') DEFAULT 'SCHEDULED',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_crew_flight (flight_id),
      CONSTRAINT fk_crew_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS baggage_items (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      passenger_id CHAR(36),
      tag_code VARCHAR(64) NOT NULL UNIQUE,
      weight_kg DECIMAL(6,2),
      pieces INT DEFAULT 1,
      status ENUM('CREATED','CHECKED_IN','LOADED','UNLOADED','MISSING') DEFAULT 'CREATED',
      last_scanned_at DATETIME,
      last_scanned_location VARCHAR(120),
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_baggage_flight (flight_id),
      INDEX idx_baggage_passenger (passenger_id),
      CONSTRAINT fk_baggage_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
      CONSTRAINT fk_baggage_passenger FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS document_templates (
      id CHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      code VARCHAR(64) NOT NULL UNIQUE,
      category ENUM('GENERAL_DECLARATION','PASSENGER_MANIFEST','CREW_LIST','OTHER') DEFAULT 'OTHER',
      version VARCHAR(16) DEFAULT '1.0',
      description TEXT,
      template_json JSON NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS documents (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      template_id CHAR(36),
      type ENUM('GENERAL_DECLARATION','PASSENGER_MANIFEST','CREW_LIST','BAGGAGE_REPORT','OTHER') DEFAULT 'OTHER',
      storage_path VARCHAR(255),
      storage_url VARCHAR(255),
      metadata JSON,
      created_by CHAR(36),
      signature_required TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_documents_flight (flight_id),
      CONSTRAINT fk_documents_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
      CONSTRAINT fk_documents_template FOREIGN KEY (template_id) REFERENCES document_templates(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS qr_passes (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      entity_type ENUM('PASSENGER','CREW') NOT NULL,
      entity_id CHAR(36) NOT NULL,
      token VARCHAR(160) NOT NULL UNIQUE,
      access_level ENUM('PASSENGER','CREW','HANDLER','AUTHORITY') DEFAULT 'PASSENGER',
      issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      sent_at DATETIME,
      status ENUM('ACTIVE','REVOKED','EXPIRED') DEFAULT 'ACTIVE',
      payload JSON,
      INDEX idx_qr_flight (flight_id),
      INDEX idx_qr_entity (entity_id),
      CONSTRAINT fk_qr_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS authority_notifications (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36) NOT NULL,
      authority_type VARCHAR(80) NOT NULL,
      destination VARCHAR(160),
      document_id CHAR(36),
      status ENUM('PENDING','SENT','FAILED') DEFAULT 'PENDING',
      response_message TEXT,
      sent_at DATETIME,
      retry_count INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_notifications_flight (flight_id),
      CONSTRAINT fk_notifications_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
      CONSTRAINT fk_notifications_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      entity_type VARCHAR(64) NOT NULL,
      entity_id CHAR(36),
      action VARCHAR(64) NOT NULL,
      performed_by CHAR(36),
      payload JSON,
      ip_address VARCHAR(64),
      user_agent VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_audit_entity (entity_type, entity_id),
      INDEX idx_audit_performer (performed_by)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS sync_events (
      id CHAR(36) NOT NULL PRIMARY KEY,
      flight_id CHAR(36),
      entity_type VARCHAR(64) NOT NULL,
      entity_id CHAR(36),
      operation ENUM('CREATE','UPDATE','DELETE') NOT NULL,
      payload JSON,
      status ENUM('PENDING','IN_PROGRESS','COMPLETE','FAILED') DEFAULT 'PENDING',
      retries INT DEFAULT 0,
      last_error TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_sync_flight (flight_id),
      CONSTRAINT fk_sync_flight FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

export const createTables = async () => {
  const pool = getPool();

  for (const statement of createTableStatements) {
    try {
      await pool.query(statement);
    } catch (error) {
      logger.error("Failed to execute schema statement", { error, statement });
      throw error;
    }
  }

  logger.info("Database schema verified");
};

