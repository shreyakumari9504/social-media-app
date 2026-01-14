from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from .views import authenticated, start_chat, get_chat_rooms
from .views import ChatRoomListView, StartChatView
from .views import get_user_profile_data, CustomTokenObtainPairView, CustomTokenRefreshView, register, toggleFollow, get_users_posts, toggleLike, create_post, get_posts, search_users, logout, update_user_details
path('authenticated/', authenticated),
from .views import get_messages, send_message


urlpatterns = [
    path('user_data/<str:pk>/', get_user_profile_data),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register),
    path('authenticated/', authenticated),
    path('toggle_follow/', toggleFollow ),
    path('posts/<str:pk>/', get_users_posts),
    path('toggleLike/', toggleLike),
    path('create_post/', create_post),
    path('get_posts/', get_posts),
    path('search/', search_users),
    path('update_user/', update_user_details),
    path('logout/', logout),
    path("chat/start/<str:username>/", start_chat),
    path("chat/rooms/", get_chat_rooms),
    path("chat/rooms/", ChatRoomListView.as_view()),
    path("chat/start/<str:username>/", StartChatView.as_view()),
    path("chat/<int:room_id>/messages/", get_messages),
    path("chat/<int:room_id>/send/", send_message),
  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
