"""Removed hours available

Revision ID: 86371532a9c0
Revises: cf2c26dfd7a2
Create Date: 2024-04-22 23:53:33.262239

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '86371532a9c0'
down_revision = 'cf2c26dfd7a2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service_providers', schema=None) as batch_op:
        batch_op.drop_column('hours_available')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service_providers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hours_available', sa.VARCHAR(length=255), nullable=True))

    # ### end Alembic commands ###
