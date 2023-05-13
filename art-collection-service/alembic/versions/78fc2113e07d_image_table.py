"""image table

Revision ID: 78fc2113e07d
Revises: 914892b1ee15
Create Date: 2023-05-10 03:05:55.343650

"""
from alembic import op
from sqlalchemy import Column, String, Integer, ForeignKey


# revision identifiers, used by Alembic.
revision = '78fc2113e07d'
down_revision = '914892b1ee15'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'image',
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('url', String, nullable=False),
        Column('collection_id', Integer, ForeignKey("art_collection.id"))
    )


def downgrade() -> None:
    op.drop_table('image')
