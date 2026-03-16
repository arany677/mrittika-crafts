using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mrittika.Server.Migrations
{
    /// <inheritdoc />
    public partial class SetupContactAndNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReadByAdmin",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "Reply",
                table: "ContactMessages");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "ContactMessages",
                newName: "MessageBody");

            migrationBuilder.RenameColumn(
                name: "IsReadByUser",
                table: "ContactMessages",
                newName: "IsRead");

            migrationBuilder.AddColumn<int>(
                name: "ParentMessageId",
                table: "ContactMessages",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentMessageId",
                table: "ContactMessages");

            migrationBuilder.RenameColumn(
                name: "MessageBody",
                table: "ContactMessages",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "IsRead",
                table: "ContactMessages",
                newName: "IsReadByUser");

            migrationBuilder.AddColumn<bool>(
                name: "IsReadByAdmin",
                table: "ContactMessages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Reply",
                table: "ContactMessages",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
