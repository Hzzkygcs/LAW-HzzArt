from django.apps import AppConfig

from consul_config.consul_services import initialize_consul


class HealthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'health'
    def ready(self):
        initialize_consul()
