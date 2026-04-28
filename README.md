# UPSA Accommodation Finder

Welcome to the UPSA Accommodation Finder! This is a simple, easy-to-use web application designed to help students find and book hostels near their campus.

## What is this website?
This website allows students to:
- Browse a list of available hostels.
- View photos, prices, amenities, and reviews for each hostel.
- Create an account and log in.
- Book a room for a specific move-in and move-out date.

## How does the code work?
The website is built using standard web technologies that run directly in your web browser:
- **HTML:** Gives structure to the pages (like text, images, and buttons).
- **CSS:** Makes the website look beautiful (colors, layouts, and animations).
- **JavaScript (JS):** Makes the website interactive. It handles things like showing image popups, filtering search results, and managing the login system.

## How does the database work?
Behind the scenes, we use a simple file called `db.json` to act as our database. 
- When a student registers an account or books a hostel, the website securely sends that information to the backend.
- The backend then saves it neatly into the `db.json` file.
- `db.json` has two main sections: one for **students** (storing names, emails, and passwords) and one for **bookings** (storing which student booked which room).

*Note: Because this website is hosted on Vercel (a serverless platform), the `db.json` file works perfectly for testing and local use. However, changes made by users on the live internet website will reset over time. For permanent internet storage in the future, this file can be easily swapped out for a cloud database like Firebase!*

## How to use or view the website locally
If you want to view this website on your own computer:
1. Double-click the `index.html` file to open the homepage in your browser.
2. If you want to test the database features (login, booking), you can use a local server tool (like the "Live Server" extension in VS Code) or run it via Vercel's local command `vercel dev`.
