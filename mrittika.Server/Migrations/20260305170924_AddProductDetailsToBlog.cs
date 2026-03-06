using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mrittika.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddProductDetailsToBlog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Blogs",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Blogs");
        }
    }
}
