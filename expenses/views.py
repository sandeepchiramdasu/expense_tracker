#expenses/views.py
from datetime import date, datetime, timedelta
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Expense, Category
from .serializers import CategorySerializer, ExpenseSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_expenses_grouped(request):
    today = date.today()
    expenses = Expense.objects.filter(
        user=request.user,
        date__month=today.month,
        date__year=today.year
    ).order_by('-date')

    if not expenses.exists():
        return Response({
            "success": False,
            "message": f"No expenses found for {today.strftime('%B %Y')}",
            "total_expenses": 0,
            "expenses": []
        }, status=200)

    serializer = ExpenseSerializer(expenses, many=True)
    total_expenses = sum(exp.amount for exp in expenses)

    return Response({
        "success": True,
        "message": f"Showing expenses for {today.strftime('%B %Y')}",
        "total_expenses": total_expenses,
        "expenses": serializer.data
    }, status=200)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_expense(request):
    data = request.data

    if isinstance(data, list):
        created_count = 0
        errors = []

        for item in data:
            title = item.get('title')
            amount = item.get('amount')
            category_name = item.get('category')
            date_str = item.get('date')

            if not (title and amount and category_name and date_str):
                errors.append({"item": item, "error": "All fields are required"})
                continue

            try:
                amount = float(amount)
            except ValueError:
                errors.append({"item": item, "error": "Invalid amount"})
                continue

            category, _ = Category.objects.get_or_create(name=category_name)
            Expense.objects.create(
                user=request.user,
                title=title,
                amount=amount,
                category=category,
                date=date_str
            )
            created_count += 1

        return Response({
            "message": f"{created_count} expenses added successfully",
            "errors": errors
        })

    else:
        title = data.get('title')
        amount = data.get('amount')
        category_name = data.get('category')
        date_str = data.get('date')

        if not (title and amount and category_name and date_str):
            return Response({"error": "All fields are required"}, status=400)

        try:
            amount = float(amount)
        except ValueError:
            return Response({"error": "Invalid amount"}, status=400)

        category, _ = Category.objects.get_or_create(name=category_name)
        Expense.objects.create(
            user=request.user,
            title=title,
            amount=amount,
            category=category,
            date=date_str
        )
        return Response({"message": "Expense added successfully"})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_expense(request, id):
    try:
        expense = Expense.objects.get(id=id, user=request.user)
    except Expense.DoesNotExist:
        return Response({"error": "Expense not found"}, status=404)

    expense.title = request.data.get('title', expense.title)
    amount = request.data.get('amount', expense.amount)
    try:
        expense.amount = float(amount)
    except ValueError:
        return Response({"error": "Invalid amount"}, status=400)

    category_name = request.data.get('category')
    if category_name:
        category, _ = Category.objects.get_or_create(name=category_name)
        expense.category = category

    expense.date = request.data.get('date', expense.date)
    expense.save()

    return Response({"message": "Expense updated"})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_expense(request, id):
    try:
        expense = Expense.objects.get(id=id, user=request.user)
        expense.delete()
        return Response({"message": "Expense deleted successfully"})
    except Expense.DoesNotExist:
        return Response({"error": "Expense not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def filter_expenses(request):
    expenses = Expense.objects.filter(user=request.user)
    period = request.query_params.get('period')
    date_str = request.query_params.get('date')
    month = request.query_params.get('month')
    year = request.query_params.get('year')
    category_name = request.query_params.get('category')
    today = date.today()

    if category_name:
        expenses = expenses.filter(category__name=category_name)

    if period == 'daily':
        filter_date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else today
        expenses = expenses.filter(date=filter_date)
    elif period == 'weekly':
        filter_date = datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else today
        start_week = filter_date - timedelta(days=filter_date.weekday())
        end_week = start_week + timedelta(days=6)
        expenses = expenses.filter(date__range=[start_week, end_week])
    elif period == 'monthly':
        filter_month = int(month) if month else today.month
        filter_year = int(year) if year else today.year
        expenses = expenses.filter(date__month=filter_month, date__year=filter_year)
    elif period == 'yearly':
        filter_year = int(year) if year else today.year
        expenses = expenses.filter(date__year=filter_year)

    if not period and not month and not year:
        expenses = expenses.filter(date__month=today.month, date__year=today.year)

    serializer = ExpenseSerializer(expenses.order_by('-date'), many=True)
    total = sum(exp.amount for exp in expenses)

    return Response({
        "total_expenses": total,
        "expenses": serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
