using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mrittika.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialNotificationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "ContactMessages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TargetBlogId",
                table: "ContactMessages",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "TargetBlogId",
                table: "ContactMessages");
        }
    }
}
