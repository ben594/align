\COPY Users FROM 'Users.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Projects FROM 'Projects.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Roles FROM 'Roles.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Images FROM 'Images.csv' WITH (FORMAT csv, HEADER, FORCE_NULL(labeler_uid, label_text))
\COPY Tags FROM 'Tags.csv' WITH DELIMITER ',' NULL '' CSV
\COPY ProjectTags FROM 'ProjectTags.csv' WITH DELIMITER ',' NULL '' CSV
