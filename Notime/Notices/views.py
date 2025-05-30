from django.shortcuts import render,redirect, get_object_or_404
from django.contrib.auth.models import User
from django.http import HttpResponse
from .models import noti
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.contrib import messages
from datetime import datetime

#for user
def notices_view(request):
    notices=noti.objects.all()
    context={
        'notices':notices,
        'dean':'Dean office',
       

    }

         

    return render(request,'notices.html',context)  

def login_view(request):
    if request.user.is_authenticated:
        return redirect('admin.html')

    if request.method=="POST":
        username=request.POST.get('username')
        password=request.POST.get('password')

        user=authenticate(username=username,password=password)

        if user is not None:
            login(request,user)
            if request.user.is_superuser:
                return redirect('admin.html')
            else:
                messages.error(request, "You are not allowed for this action.")
                return redirect('login.html')

    return render(request,'login.html')



@login_required
def home_view(request):
    if request.method=="POST":
        title=request.POST.get('title')
        descri=request.POST.get('descri')
        ckeck=request.POST.get('ckeck') == "on"
        img=request.FILES.get('img')
        new_noti=noti(title=title,descri=descri,ckeck=ckeck,img=img)
        new_noti.save()

    notices=noti.objects.all()
    context={
    'notices':notices,
    'date':datetime.now(),
    }
    
    return render(request,'admin.html',context)


def search_view(request):
    query = request.GET.get("query", "")
    notices = noti.objects.all() 
    no_results = False

    if query:
        notices = notices.filter(
            Q(title__icontains=query) | Q(descri__icontains=query) | Q(img__icontains=query)
        )

        if not notices.exists(): 
            no_results = True
    else:
        pass


    return render(request, 'notices.html', {
        "notices": notices,
        "query": query,
        "no_results": no_results, 
    })
@login_required
def delete_noti(request,noti_id):
    notice= get_object_or_404(noti,id=noti_id)
    notice.delete()
    return redirect('admin_delete')

@login_required
def view_admin(request):
    username=request.user.username
    notices=noti.objects.all()
    context={
        'username':username,
        'notices':notices,
    }
   
    return render(request,'delete.html',context)

def Dev_view(request):

    return render(request,'dev.html')

def view_404(request):
    return render(request,'404.html')

@login_required
def logout_view(request):
    if request.method=="POST":
        logout(request)
    return render(request,'notices.html')
