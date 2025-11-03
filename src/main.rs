use actix_files as fs;
use actix_web::{App, HttpResponse, HttpServer, Responder, middleware::Logger, web};
use chrono::{Datelike, Utc};
use dotenvy::dotenv;
use env_logger::Env;
use serde::Deserialize;
use std::env;
use tera::{Context, Tera};

#[derive(Deserialize)]
struct Booking {
    name: String,
    email: Option<String>,
    phone: String,
    driver_type: String,
    pickup_date: Option<String>,
    pickup_time: Option<String>,
    pickup_location: Option<String>,
    dropoff_location: Option<String>,
}

async fn handle_booking(data: web::Json<Booking>) -> impl Responder {
    let api_key = env::var("MAILTRAP_API_TOKEN").expect("SMTP_API_KEY not set");

    let datum = render_booking_email(&data);

    let payload = serde_json::json!({
        "from": {"email": "hello@aplusdrivers.ng", "name": "APlus Drivers"},
        "to": [{"email": "aplusdriversng@gmail.com"}],
        "subject": format!("{} Booking!", data.driver_type),
        "text": datum.0,
        "html": datum.1,
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

fn render_booking_email(booking: &Booking) -> (String, String) {
    let tera = Tera::new("templates/**/*").expect("Error loading templates");

    let mut context = Context::new();
    context.insert("name", &booking.name);
    context.insert("email", &booking.email);
    context.insert("phone", &booking.phone);
    context.insert("driver_type", &booking.driver_type);
    context.insert("pickup_date", &booking.pickup_date);
    context.insert("pickup_time", &booking.pickup_time);
    context.insert("pickup_location", &booking.pickup_location);
    context.insert("dropoff_location", &booking.dropoff_location);
    context.insert("year", &Utc::now().year());

    let html = tera
        .render("booking_email.html", &context)
        .expect("Failed to render HTML email");

    let mut text = String::new();
    text.push_str("New Booking Request\n\n");
    text.push_str(&format!("Name: {}\n", booking.name));
    text.push_str(&format!("Phone: {}\n", booking.phone));
    text.push_str(&format!(
        "Email: {}\n",
        booking.email.as_deref().unwrap_or("—")
    ));
    text.push_str(&format!("Driver Type: {}\n", booking.driver_type));
    if let Some(d) = &booking.pickup_date {
        text.push_str(&format!("Pickup Date: {}\n", d));
    }
    if let Some(t) = &booking.pickup_time {
        text.push_str(&format!("Pickup Time: {}\n", t));
    }
    if let Some(p) = &booking.pickup_location {
        text.push_str(&format!("Pickup Location: {}\n", p));
    }
    if let Some(d) = &booking.dropoff_location {
        text.push_str(&format!("Dropoff Location: {}\n", d));
    }
    text.push_str("\nPlease follow up with the customer.\n");

    (text, html)
}
