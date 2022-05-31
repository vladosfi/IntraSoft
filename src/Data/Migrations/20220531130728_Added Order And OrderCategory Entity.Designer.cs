﻿// <auto-generated />
using System;
using IntraSoft.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace IntraSoft.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20220531130728_Added Order And OrderCategory Entity")]
    partial class AddedOrderAndOrderCategoryEntity
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.4");

            modelBuilder.Entity("IntraSoft.Data.Models.Contact", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<int>("DepartmentId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<string>("MiddleName")
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Phone")
                        .HasMaxLength(10)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.ToTable("Contacts");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Department", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasMaxLength(200)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Departments");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Document", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("MenuId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("MenuId")
                        .IsUnique();

                    b.ToTable("Documents");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<int>("IsoCategoryId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("IsoServicesId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("IsoCategoryId");

                    b.HasIndex("IsoServicesId");

                    b.ToTable("IsoFiles");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoFileCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("IsoFileCategories");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoService", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<int>("DepartmentId")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.ToTable("IsoServices");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Menu", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Icon")
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ParentId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("RouterLink")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ParentId");

                    b.ToTable("Menus");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("About")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.OrderCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ModifiedOn")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<int>("OrderId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("OrderId")
                        .IsUnique();

                    b.ToTable("OrderCategories");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Contact", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.Department", "Department")
                        .WithMany("Contacts")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Document", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.Menu", "Menu")
                        .WithOne("Document")
                        .HasForeignKey("IntraSoft.Data.Models.Document", "MenuId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Menu");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoFile", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.IsoFileCategory", "IsoFileCategory")
                        .WithMany("IsoFiles")
                        .HasForeignKey("IsoCategoryId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("IntraSoft.Data.Models.IsoService", "IsoService")
                        .WithMany("IsoFiles")
                        .HasForeignKey("IsoServicesId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("IsoFileCategory");

                    b.Navigation("IsoService");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoService", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.Department", "Department")
                        .WithMany("IsoServices")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Menu", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.Menu", "ParentMenu")
                        .WithMany("Children")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("ParentMenu");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.OrderCategory", b =>
                {
                    b.HasOne("IntraSoft.Data.Models.Order", "Order")
                        .WithOne("Category")
                        .HasForeignKey("IntraSoft.Data.Models.OrderCategory", "OrderId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Order");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Department", b =>
                {
                    b.Navigation("Contacts");

                    b.Navigation("IsoServices");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoFileCategory", b =>
                {
                    b.Navigation("IsoFiles");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.IsoService", b =>
                {
                    b.Navigation("IsoFiles");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Menu", b =>
                {
                    b.Navigation("Children");

                    b.Navigation("Document");
                });

            modelBuilder.Entity("IntraSoft.Data.Models.Order", b =>
                {
                    b.Navigation("Category");
                });
#pragma warning restore 612, 618
        }
    }
}
