# Quiz-app

A simple and interactive web-based quiz application that supports multiple languages, question categories, animations, timers, result charts, and smooth navigation between questions.

Features

• Language selection before starting
• Category selection after choosing a language
• All questions stored in a single JSON file
• Random selection of 10 questions per category
• Shuffled answers for every question
• One question per screen
• Next and Previous navigation
• Saved answers while navigating
• Prevent answer changes once confirmed
• Countdown timer for each question
• Half-minute timer per question
• Smooth animations when switching questions
• Progress bar based on current position
• Submit confirmation box (custom UI, no alerts)
• Final results with

Correct answers

Wrong answers

Skipped questions

Percentage score
• Results chart using Chart.js
• Show Answers after finishing
• Restart button to retake the quiz
• Last result saved in localStorage
• Clean and responsive UI

How It Works

User selects the language

Categories appear only after choosing a language

Once a category is selected
questions are loaded from the JSON file

The app randomly picks 10 questions

Answers are shuffled

Each question shows with animation

User can move forward or back

Timer runs for each question

When clicking Submit
a confirmation box appears

After confirming
final results and chart appear

User can review correct answers

Technologies Used

• HTML
• CSS
• JavaScript
• Chart.js

JSON Structure

Each question includes
• language
• category
• title
• answers array
• right_answer

🔗 **Live Demo:** [Click here to view the site](https://dinaelbry.github.io/Quiz-app)
