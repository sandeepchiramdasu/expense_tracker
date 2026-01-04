from django.urls import path
from . import views

urlpatterns = [
    path('expenses/', views.get_expenses_grouped, name='get_expenses'),
    path('expenses/add/', views.add_expense, name='add_expense'),
    path('expenses/edit/<int:id>/', views.edit_expense, name='edit_expense'),
    path('expenses/delete/<int:id>/', views.delete_expense, name='delete_expense'),
    path('expenses/filter/', views.filter_expenses, name='filter_expenses'),
    path('categories/', views.get_categories, name='get_categories'),
]