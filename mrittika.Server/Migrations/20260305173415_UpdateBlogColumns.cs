using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mrittika.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBlogColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Blogs");

            migrationBuilder.AddColumn<bool>(
                name: "IsClayCutlery",
                table: "Blogs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsHandmadeShowpiece",
                table: "Blogs",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsClayCutlery",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "IsHandmadeShowpiece",
                table: "Blogs");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
