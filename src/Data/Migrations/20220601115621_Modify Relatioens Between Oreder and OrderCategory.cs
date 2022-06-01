using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntraSoft.Data.Migrations
{
    public partial class ModifyRelatioensBetweenOrederandOrderCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderCategories_Orders_OrderId",
                table: "OrderCategories");

            migrationBuilder.DropIndex(
                name: "IX_OrderCategories_OrderId",
                table: "OrderCategories");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "OrderCategories");

            migrationBuilder.AddColumn<int>(
                name: "OrderCategoryId",
                table: "Orders",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Orders",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderCategoryId",
                table: "Orders",
                column: "OrderCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_OrderCategories_OrderCategoryId",
                table: "Orders",
                column: "OrderCategoryId",
                principalTable: "OrderCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_OrderCategories_OrderCategoryId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_OrderCategoryId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrderCategoryId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Orders");

            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "OrderCategories",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrderCategories_OrderId",
                table: "OrderCategories",
                column: "OrderId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderCategories_Orders_OrderId",
                table: "OrderCategories",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
