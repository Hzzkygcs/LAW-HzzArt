from django.apps import AppConfig

from consul_config.consul_services import initialize_consul


class LikeCommentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "like_comment"
