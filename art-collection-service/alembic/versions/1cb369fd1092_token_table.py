"""Token Table

Revision ID: 1cb369fd1092
Revises: 78fc2113e07d
Create Date: 2023-05-18 13:34:49.348957

"""
from alembic import op
from sqlalchemy import Column, String, Integer, ForeignKey


# revision identifiers, used by Alembic.
revision = '1cb369fd1092'
down_revision = '78fc2113e07d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'token',
        Column('token', String, primary_key=True),
        Column('value', String, default=None),
    )


def downgrade() -> None:
    op.drop_table('token')
