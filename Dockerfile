FROM microsoft/iis

RUN mkdir C:\runakunaweb

RUN powershell -NoProfile -Command \
    Import-module IISAdministration; \
    New-IISSite -Name "Runakuna.web" -PhysicalPath C:\runakunaweb -BindingInformation "*:8000:"

EXPOSE 8000

ADD dist/ /runakunaweb