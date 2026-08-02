using Vira.Abstractions.Settings;
using Vira.Application;

var builder = WebApplication.CreateBuilder(args);

// Controllers (D3) + OpenAPI/Swagger (frontend generates types from the spec).
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Settings binding.
builder.Services.Configure<AiSettings>(builder.Configuration.GetSection("Ai"));
builder.Services.Configure<TikTokSettings>(builder.Configuration.GetSection("TikTok"));
builder.Services.Configure<FirebaseSettings>(builder.Configuration.GetSection("Firebase"));

// Application layer wires DataAccess, AutoMapper, and the service clients.
var connectionString = builder.Configuration.GetConnectionString("Postgres") ?? string.Empty;
builder.Services.AddApplication(connectionString);

// TODO: cookie auth, CORS (Vercel origin), Firebase Admin init, background token-refresh service.

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
