from flask import current_app as app

class Label:
    def __init__(
        self,
        labeler_uid,
        project_id,
        image_url,
        label
    ):
        self.labeler_uid = labeler_uid
        self.project_id = project_id
        self.image_url = image_url
        self.label = label

    @staticmethod
    def create(
        labeler_uid,
        project_id,
        image_url,
        label,
    ):
        print("label", label)
        project_id = app.db.execute(
            """
            UPDATE Images
            SET labeler_uid = :labeler_uid, labeled_status = TRUE, label_text = :label_text where image_url = :image_url
            RETURNING image_url
            """,
            labeler_uid=labeler_uid,
            label_text=label,
            image_url=image_url
        )

        return image_url if image_url else None
    
    @staticmethod
    def approve_label(image_url):
        status = app.db.execute(
            """
            UPDATE Images
            SET accepted_status = TRUE
            WHERE image_url = :image_url
            """,
            image_url=image_url
        )
        return bool(status)
    
    @staticmethod
    def pay_labeler(labeler_uid, ppi): 
        try:
            status = app.db.execute(
                """
                UPDATE Users
                SET balance = balance + :ppi
                WHERE user_id = :labeler_uid
                """,
                labeler_uid=labeler_uid,
                ppi=ppi
            )
        except Exception as e:
            print(f"Error updating user balance: {e}")
            return False
        return bool(status)
    
    # TODO add rejected label to history
    @staticmethod
    def reject_label(image_url):
        status = app.db.execute(
            """
            UPDATE Images
            SET labeled_status = FALSE
            WHERE image_url = :image_url
            """,
            image_url=image_url
        )
        return bool(status)


