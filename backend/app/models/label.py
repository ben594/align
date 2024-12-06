from flask import current_app as app
from sqlalchemy import text

from .project import Project

# Label class includes SQL queries related to creating, updating, approving, and rejecting labels

class Label:
    def __init__(self, labeler_uid, project_id, image_url, label):
        self.labeler_uid = labeler_uid
        self.project_id = project_id
        self.image_url = image_url
        self.label = label

    # updates db with created label 
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
            image_url=image_url,
        )

        return image_url if image_url else None
    
    # label is approved 
    @staticmethod
    def approve_label(image_url):
        # transaction to approve label and transfer fund to labeler
        # begin transaction
        with app.db.engine.begin() as conn:
            status = (
                conn.execute(
                    statement=text(
                        """
                        UPDATE Images
                        SET accepted_status = TRUE
                        WHERE image_url = :image_url
                        """
                    ),
                    parameters=dict(
                        image_url=image_url,
                    ),
                ).rowcount
                > 0
            )

            # transfer money to labeler
            labeler_uid = conn.execute(
                statement=text(
                    """
                    SELECT labeler_uid
                    FROM Images
                    WHERE image_url = :image_url
                    """
                ),
                parameters=dict(
                    image_url=image_url,
                ),
            ).scalar()
           
            project_id = conn.execute(
                statement=text(
                    """
                    SELECT project_id
                    FROM Images
                    WHERE image_url = :image_url
                    """
                ),
                parameters=dict(
                    image_url=image_url,
                ),
            ).scalar()

            ppi = Project.get_project_ppi(project_id)

            conn.execute(
                statement=text(
                    """
                UPDATE Users
                SET balance = balance + :ppi
                WHERE user_id = :labeler_uid
                """
                ),
                parameters=dict(labeler_uid=labeler_uid, ppi=ppi),
            )
            
            # create payment record
            conn.execute(
                statement=text(
                    """
                    INSERT INTO Payments(user_id, transaction_time, balance_change)
                    VALUES(:user_id, NOW(), :balance_change);
                    """
                ),
                parameters=dict(
                    user_id=labeler_uid,
                    balance_change=ppi,
                ),
            )

            return bool(status)

    # labeler is paid based on # of approved labels
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
                ppi=ppi,
            )
        except Exception as e:
            print(f"Error updating user balance: {e}")
            return False
        return bool(status)

    #reject label
    @staticmethod
    def reject_label(image_url):
        status = app.db.execute(
            """
            UPDATE Images
            SET labeled_status = FALSE
            WHERE image_url = :image_url
            """,
            image_url=image_url,
        )
        return bool(status)

    @staticmethod
    def update_finalize_label(project_id, image_url, new_label):
        status = app.db.execute(
            """
            UPDATE Images
            SET label_text = :new_label,
             labeled_status = TRUE,
             accepted_status = TRUE
            WHERE project_id = :project_id
            AND image_url = :image_url
            """,
            project_id=project_id,
            image_url=image_url,
            new_label=new_label,
        )
        return bool(status)
