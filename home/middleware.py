from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

MOBILE_KEYWORDS = [
    'Mobile', 'Android', 'iPhone', 'iPad',
    'iPod', 'BlackBerry', 'Opera Mini', 'IEMobile'
]

class MobileRedirectMiddleware(MiddlewareMixin):
    def process_request(self, request):
        path = request.path.lower()

        # já está no mobile → não mexe
        if path.startswith('/mobile'):
            return None

        # ignora admin, static, media
        if (
            path.startswith('/admin')
            or path.startswith('/static')
            or path.startswith('/media')
        ):
            return None

        user_agent = request.META.get('HTTP_USER_AGENT', '')

        is_mobile = any(
            keyword.lower() in user_agent.lower()
            for keyword in MOBILE_KEYWORDS
        )

        if is_mobile:
            return redirect('/mobile/')

        return None
