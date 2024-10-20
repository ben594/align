from flask import current_app as app

class Label:
    def __init__(
        self,
        labeler_uid
        projectID,
        imageURL,
        label
    ):
        self.labeler_uid = labeler_uid
        self.projectID = projectID
        self.imageURL = imageURL
        self.label = label

    @staticmethod
    def create(
        labeler_uid,
        projectID,
        imageURL,
        label,
    ):
        project_id = app.db.execute(
            """
            INSERT INTO Images (vendor_uid,
            project_name,
            description,
            price_per_image)
            VALUES (:labeler_uid, :project_id, :labeled_status, :label_text)
            RETURNING image_url
            """,
            labeler_uid=labeler_uid,
            project_id=projectID,
            labeled_status=True,
            label_text=label,
        )

        return image_url if image_url else None


