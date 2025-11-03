use actix_files as fs;
use actix_web::{App, HttpResponse, HttpServer, Responder, middleware::Logger, web};
use dotenvy::dotenv;
use env_logger::Env;
use serde::Deserialize;
use std::env;

#[derive(Deserialize)]
struct Booking {
    name: String,
    phone: String,
    driverType: String,
}

async fn handle_booking(data: web::Json<Booking>) -> impl Responder {
    let api_key = env::var("MAILTRAP_API_TOKEN").expect("SMTP_API_KEY not set");

    let payload = serde_json::json!({
        "from": {"email": "hello@aplusdrivers.ng", "name": data.driverType},
        "to": [{"email": "aplusdriversng@gmail.com"}],
        "subject": "Booking!",
        "text": format!("New booking from {} - {}", data.name, data.phone),
        "category": "Integration Test"
    });

    let client = reqwest::Client::new();
    let res = client
        .post("https://send.api.mailtrap.io/api/send")
        .bearer_auth(api_key)
        .json(&payload)
        .send()
        .await;

    match res {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({ "status": "ok" })),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    // Initialize logger from environment variables
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    println!("🚀 Server running on http://localhost:{port}");

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(Logger::new("%a %{User-Agent}i -> %r %s %b bytes %D ms"))
            .route("/api/booking", web::post().to(handle_booking))
            .service(fs::Files::new("/", "./static").index_file("index.html"))
    })
    .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
    .run()
    .await
}
