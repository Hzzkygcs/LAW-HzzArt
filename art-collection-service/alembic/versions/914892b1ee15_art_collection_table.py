"""art collection table

Revision ID: 914892b1ee15
Revises: a6316011c5e0
Create Date: 2023-05-10 01:56:29.119798

"""
from alembic import op
from sqlalchemy import Column, String, Integer


# revision identifiers, used by Alembic.
revision = '914892b1ee15'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'art_collection',
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('owner', String, nullable=False),
        Column('name', String, nullable=False)
    )


def downgrade() -> None:
    op.drop_table('art_collection')
