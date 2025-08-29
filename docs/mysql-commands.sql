-- Comandos MySQL para la base de datos kayakbrokers

create database if not exists kayakbrokers;

create user if not exists dsw@'%' identified by 'dsw';
grant all on kayakbrokers.* to dsw@'%';