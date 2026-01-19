INSERT INTO click_events (event_type)
SELECT 'page_load'
WHERE NOT EXISTS (SELECT 1 FROM click_events WHERE event_type = 'page_load');

INSERT INTO click_events (event_type)
SELECT 'button_click'
WHERE NOT EXISTS (SELECT 1 FROM click_events WHERE event_type = 'button_click');
-- Seed event types for dropdown
-- This is not used to insert into click_events, but to provide the list of types
-- If you want to seed click_events, add logic here, but for now, keep empty for a true zero start