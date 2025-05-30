from django.urls import path 
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('',views.notices_view,name='notices'),
    path('login/', views.login_view, name='login'),
    path('dev/',views.Dev_view,name='developer_side'),
    path('404/',views.view_404,name='404'),
    path('search/', views.search_view, name='search_view'), 
    path('boss/',views.home_view,name='boss'),
    path('delete_noti/<int:noti_id>/',views.delete_noti,name='delete_notice'),
    path('delete_notice/',views.view_admin,name='admin_delete'),
    path('logout/', views.logout_view, name='logout')


]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
