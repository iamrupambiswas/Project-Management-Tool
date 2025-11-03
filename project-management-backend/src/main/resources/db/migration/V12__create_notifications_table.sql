CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    recipient_id BIGINT NOT NULL,
    related_entity_id BIGINT,
    CONSTRAINT fk_notification_user FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE
);
