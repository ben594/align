\COPY Users FROM 'Users.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Projects FROM 'Projects.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Payments FROM 'Payments.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Roles FROM 'Roles.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Images FROM 'Images.csv' WITH DELIMITER ',' NULL '' CSV
-- \COPY Tags FROM 'Tags.csv' WITH DELIMITER ',' NULL '' CSV
-- \COPY ProjectTags FROM 'ProjectTags.csv' WITH DELIMITER ',' NULL '' CSV

-- since id is auto-generated; we need the next command to adjust the counter
-- for auto-generation so next INSERT will not clash with ids loaded above:
--SELECT pg_catalog.setval('public.users_id_seq',
                      -- (SELECT MAX(user_id)+1 FROM Users),
                      --   false);
